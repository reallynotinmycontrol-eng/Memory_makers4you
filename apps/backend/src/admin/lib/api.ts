// Small helper for calling this backend's admin API from admin pages.
// The admin dashboard is served by the backend, so relative URLs and the
// session cookie work out of the box.

export async function adminFetch<T = any>(
  path: string,
  init: { method?: string; body?: unknown } = {}
): Promise<T> {
  const res = await fetch(path, {
    method: init.method ?? "GET",
    credentials: "include",
    headers: init.body ? { "Content-Type": "application/json" } : undefined,
    body: init.body ? JSON.stringify(init.body) : undefined,
  })

  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(json?.message ?? `Request failed (${res.status})`)
  }
  return json as T
}

/** Uploads an image through Medusa's file module and returns its URL. */
export async function uploadImage(file: File): Promise<string> {
  const form = new FormData()
  form.append("files", file)

  const res = await fetch("/admin/uploads", {
    method: "POST",
    credentials: "include",
    body: form,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || !json?.files?.[0]?.url) {
    throw new Error(json?.message ?? "Upload failed")
  }
  return json.files[0].url as string
}
