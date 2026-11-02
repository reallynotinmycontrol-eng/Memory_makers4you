import crypto from "crypto"
import {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  BigNumberInput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from "@medusajs/framework/types"
import {
  AbstractPaymentProvider,
  BigNumber,
  MathBN,
  MedusaError,
  PaymentActions,
  PaymentSessionStatus,
} from "@medusajs/framework/utils"

type Options = {
  keyId: string
  keySecret: string
  webhookSecret?: string
}

type RazorpayPayment = {
  id: string
  order_id: string
  status: "created" | "authorized" | "captured" | "refunded" | "failed"
  amount: number
  currency: string
  notes?: Record<string, string>
}

const API = "https://api.razorpay.com/v1"

/** INR and most currencies use 2 decimal places: ₹1 = 100 paise. */
function toSmallestUnit(amount: BigNumberInput): number {
  return Math.round(new BigNumber(MathBN.mult(amount, 100)).numeric)
}

function fromSmallestUnit(amount: number): number {
  return new BigNumber(MathBN.div(amount, 100)).numeric
}

/**
 * Razorpay payment provider.
 *
 * Flow:
 * 1. initiatePayment creates a Razorpay Order and returns its id.
 * 2. The storefront opens Razorpay Checkout with that order id.
 * 3. When the customer completes payment, the storefront places the order.
 *    authorizePayment asks Razorpay directly whether the order has a
 *    successful payment, so the storefront can't fake a payment.
 * 4. Webhooks (optional but recommended) keep Medusa in sync if the
 *    customer closes the browser before the order is placed.
 */
class RazorpayProviderService extends AbstractPaymentProvider<Options> {
  static identifier = "razorpay"

  protected options_: Options

  static validateOptions(options: Record<string, unknown>) {
    if (!options.keyId || !options.keySecret) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Razorpay: `keyId` and `keySecret` are required"
      )
    }
  }

  constructor(cradle: Record<string, unknown>, options: Options) {
    // @ts-ignore
    super(...arguments)
    this.options_ = options
  }

  // ---------------------------------------------------------------- helpers

  private async request<T>(
    method: "GET" | "POST",
    path: string,
    body?: Record<string, unknown>
  ): Promise<T> {
    const auth = Buffer.from(
      `${this.options_.keyId}:${this.options_.keySecret}`
    ).toString("base64")

    const res = await fetch(`${API}${path}`, {
      method,
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    const json = (await res.json().catch(() => ({}))) as any

    if (!res.ok) {
      const message =
        json?.error?.description ?? `Razorpay request failed (${res.status})`
      throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, message)
    }

    return json as T
  }

  private async createOrder(
    amount: BigNumberInput,
    currency: string,
    sessionId: string
  ) {
    const order = await this.request<{ id: string; amount: number; currency: string }>(
      "POST",
      "/orders",
      {
        amount: toSmallestUnit(amount),
        currency: currency.toUpperCase(),
        receipt: sessionId.slice(0, 40),
        notes: { session_id: sessionId },
      }
    )

    return {
      id: order.id,
      razorpay_order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      // The key id is public and needed by Razorpay Checkout in the browser.
      key_id: this.options_.keyId,
      session_id: sessionId,
    }
  }

  /** Finds the best payment made against a Razorpay order. */
  private async findOrderPayment(orderId: string): Promise<RazorpayPayment | null> {
    const { items } = await this.request<{ items: RazorpayPayment[] }>(
      "GET",
      `/orders/${orderId}/payments`
    )
    return (
      items.find((p) => p.status === "captured") ??
      items.find((p) => p.status === "authorized") ??
      items.find((p) => p.status === "refunded") ??
      null
    )
  }

  private async statusFor(data: Record<string, unknown> | undefined) {
    const orderId = data?.razorpay_order_id as string | undefined
    if (!orderId) {
      return { status: PaymentSessionStatus.PENDING, data: data ?? {} }
    }

    const payment = await this.findOrderPayment(orderId)
    const nextData = {
      ...data,
      razorpay_payment_id: payment?.id ?? data?.razorpay_payment_id,
      razorpay_payment_status: payment?.status,
    }

    switch (payment?.status) {
      case "captured":
      case "refunded":
        return { status: PaymentSessionStatus.CAPTURED, data: nextData }
      case "authorized":
        return { status: PaymentSessionStatus.AUTHORIZED, data: nextData }
      default:
        return { status: PaymentSessionStatus.PENDING, data: nextData }
    }
  }

  // ------------------------------------------------------- provider methods

  async initiatePayment({
    amount,
    currency_code,
    data,
  }: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const sessionId = (data?.session_id as string) ?? crypto.randomUUID()
    const orderData = await this.createOrder(amount, currency_code, sessionId)
    return {
      id: orderData.id,
      data: orderData,
      status: PaymentSessionStatus.PENDING,
    }
  }

  async updatePayment({
    amount,
    currency_code,
    data,
  }: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    // Razorpay orders can't change amount, so create a new order when the
    // cart total changes.
    if (data?.amount === toSmallestUnit(amount)) {
      return { data, status: PaymentSessionStatus.PENDING }
    }
    const sessionId = (data?.session_id as string) ?? crypto.randomUUID()
    const orderData = await this.createOrder(amount, currency_code, sessionId)
    return { data: orderData, status: PaymentSessionStatus.PENDING }
  }

  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    return this.statusFor(input.data)
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    return this.statusFor(input.data)
  }

  async capturePayment({
    data,
  }: CapturePaymentInput): Promise<CapturePaymentOutput> {
    const paymentId = data?.razorpay_payment_id as string | undefined
    if (!paymentId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Razorpay: no payment found to capture"
      )
    }

    const payment = await this.request<RazorpayPayment>(
      "GET",
      `/payments/${paymentId}`
    )

    if (payment.status === "authorized") {
      const captured = await this.request<RazorpayPayment>(
        "POST",
        `/payments/${paymentId}/capture`,
        { amount: payment.amount, currency: payment.currency }
      )
      return { data: { ...data, razorpay_payment_status: captured.status } }
    }

    // Already captured automatically by Razorpay (the default setting).
    return { data: { ...data, razorpay_payment_status: payment.status } }
  }

  async refundPayment({
    amount,
    data,
  }: RefundPaymentInput): Promise<RefundPaymentOutput> {
    const paymentId = data?.razorpay_payment_id as string | undefined
    if (!paymentId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Razorpay: no payment found to refund"
      )
    }
    const refund = await this.request<{ id: string }>(
      "POST",
      `/payments/${paymentId}/refund`,
      { amount: toSmallestUnit(amount) }
    )
    return { data: { ...data, last_refund_id: refund.id } }
  }

  async cancelPayment({ data }: CancelPaymentInput): Promise<CancelPaymentOutput> {
    // Razorpay orders expire on their own; uncaptured payments are
    // auto-refunded by Razorpay. Nothing to call here.
    return { data }
  }

  async deletePayment({ data }: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return { data }
  }

  async retrievePayment({
    data,
  }: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    const orderId = data?.razorpay_order_id as string | undefined
    if (!orderId) {
      return { data }
    }
    const order = await this.request<Record<string, unknown>>(
      "GET",
      `/orders/${orderId}`
    )
    return { data: { ...data, order } }
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const { data, rawData, headers } = payload
    const secret = this.options_.webhookSecret

    if (!secret) {
      return { action: PaymentActions.NOT_SUPPORTED }
    }

    const signature = headers["x-razorpay-signature"] as string | undefined
    const expected = crypto
      .createHmac("sha256", secret)
      .update(typeof rawData === "string" ? rawData : rawData.toString("utf8"))
      .digest("hex")

    if (
      !signature ||
      signature.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    ) {
      return { action: PaymentActions.NOT_SUPPORTED }
    }

    const event = data as any
    const payment = event?.payload?.payment?.entity as RazorpayPayment | undefined
    let sessionId = payment?.notes?.session_id

    // Fall back to the order's notes, which initiatePayment always sets.
    if (!sessionId && payment?.order_id) {
      const order = await this.request<{ notes?: Record<string, string> }>(
        "GET",
        `/orders/${payment.order_id}`
      )
      sessionId = order.notes?.session_id
    }

    if (!payment || !sessionId) {
      return { action: PaymentActions.NOT_SUPPORTED }
    }

    const amount = new BigNumber(fromSmallestUnit(payment.amount))

    switch (event.event) {
      case "payment.authorized":
        return {
          action: PaymentActions.AUTHORIZED,
          data: { session_id: sessionId, amount },
        }
      case "payment.captured":
      case "order.paid":
        return {
          action: PaymentActions.SUCCESSFUL,
          data: { session_id: sessionId, amount },
        }
      case "payment.failed":
        return {
          action: PaymentActions.FAILED,
          data: { session_id: sessionId, amount },
        }
      default:
        return { action: PaymentActions.NOT_SUPPORTED }
    }
  }
}

export default RazorpayProviderService
