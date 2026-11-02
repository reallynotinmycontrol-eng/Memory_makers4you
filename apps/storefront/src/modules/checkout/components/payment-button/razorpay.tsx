"use client"

import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useState } from "react"
import ErrorMessage from "../error-message"

declare global {
  interface Window {
    Razorpay?: any
  }
}

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js"

/** Loads Razorpay Checkout once and resolves when it is ready. */
const loadRazorpay = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true)
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`)
    if (existing) {
      existing.addEventListener("load", () => resolve(true))
      existing.addEventListener("error", () => resolve(false))
      return
    }
    const script = document.createElement("script")
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

/**
 * Opens Razorpay Checkout (UPI, cards, net banking, wallets) for the order
 * the backend created, then places the Medusa order. The backend checks
 * with Razorpay that the payment really succeeded before creating it.
 */
export default function RazorpayPaymentButton({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const session = cart.payment_collection?.payment_sessions?.find((s) =>
    s.provider_id.startsWith("pp_razorpay")
  )
  const data = (session?.data ?? {}) as Record<string, any>

  const completeOrder = async () => {
    try {
      await placeOrder()
    } catch (err: any) {
      setError(
        err?.message ??
          "Payment received, but the order couldn't be completed. Please contact us with your payment ID."
      )
      setSubmitting(false)
    }
  }

  const handlePayment = async () => {
    setError(null)

    if (!data.razorpay_order_id || !data.key_id) {
      setError("Payment isn't ready yet. Go back to the payment step and choose Razorpay again.")
      return
    }

    setSubmitting(true)
    const ready = await loadRazorpay()
    if (!ready || !window.Razorpay) {
      setError("Couldn't load Razorpay. Check your internet connection and try again.")
      setSubmitting(false)
      return
    }

    const address = cart.billing_address ?? cart.shipping_address

    const rzp = new window.Razorpay({
      key: data.key_id,
      order_id: data.razorpay_order_id,
      amount: data.amount,
      currency: data.currency ?? "INR",
      name: process.env.NEXT_PUBLIC_STORE_NAME || "MemoryMakers4U",
      description: `Order for ${cart.items?.length ?? 0} item(s)`,
      prefill: {
        name: [address?.first_name, address?.last_name].filter(Boolean).join(" "),
        email: cart.email,
        contact: address?.phone ?? undefined,
      },
      notes: { session_id: data.session_id ?? session?.id },
      theme: { color: "#7C2F82" },
      handler: () => {
        // Payment succeeded in Razorpay; now create the order.
        completeOrder()
      },
      modal: {
        ondismiss: () => setSubmitting(false),
      },
    })

    rzp.on("payment.failed", (resp: any) => {
      setError(resp?.error?.description ?? "Payment failed. Please try again.")
      setSubmitting(false)
    })

    rzp.open()
  }

  return (
    <>
      <Button
        disabled={notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Pay securely with Razorpay
      </Button>
      <ErrorMessage error={error} data-testid="razorpay-payment-error-message" />
    </>
  )
}
