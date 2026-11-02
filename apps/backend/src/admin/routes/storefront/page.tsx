import { defineRouteConfig } from "@medusajs/admin-sdk"
import { BuildingStorefront } from "@medusajs/icons"
import {
  Badge,
  Button,
  Container,
  Heading,
  Input,
  Label,
  Switch,
  Tabs,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui"
import { useEffect, useState } from "react"
import { adminFetch, uploadImage } from "../../lib/api"

// ----------------------------------------------------------------- types

type Banner = {
  id?: string
  title: string
  subtitle?: string | null
  button_text?: string | null
  link?: string | null
  image_url?: string | null
  mobile_image_url?: string | null
  placement: "hero" | "promo"
  rank: number
  is_active: boolean
}

type Section = {
  id?: string
  title: string
  subtitle?: string | null
  type: "category_grid" | "product_grid"
  category_handle?: string | null
  collection_handle?: string | null
  max_items: number
  rank: number
  is_active: boolean
}

const SETTING_LABELS: Record<string, { label: string; hint?: string; long?: boolean }> = {
  store_name: { label: "Store name" },
  logo_url: { label: "Logo", hint: "Optional. Without a logo the store name is shown." },
  announcement_text: {
    label: "Announcement bar text",
    hint: "Shown at the very top of every page. Leave empty to hide it.",
  },
  announcement_link: { label: "Announcement bar link", hint: "Optional, e.g. /categories/resin-art" },
  shipping_note: { label: "Shipping note", hint: "Shown on product pages and in the cart." },
  phone: { label: "Phone" },
  whatsapp: { label: "WhatsApp number", hint: "With country code, digits only, e.g. 919876543210" },
  email: { label: "Email" },
  address: { label: "Address", long: true },
  instagram_url: { label: "Instagram URL" },
  facebook_url: { label: "Facebook URL" },
  youtube_url: { label: "YouTube URL" },
  footer_about: { label: "Footer: about the store", long: true },
}

const select =
  "bg-ui-bg-field shadow-borders-base txt-compact-small h-8 w-full rounded-md px-2 text-ui-fg-base outline-none"

// ------------------------------------------------------------- settings

const SettingsTab = () => {
  const [values, setValues] = useState<Record<string, string>>({})
  const [keys, setKeys] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    adminFetch("/admin/content/settings")
      .then((r) => {
        setValues(r.settings ?? {})
        setKeys(r.keys ?? [])
      })
      .catch((e) => toast.error(e.message))
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      const r = await adminFetch("/admin/content/settings", {
        method: "POST",
        body: { settings: values },
      })
      setValues(r.settings)
      toast.success("Settings saved")
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-y-4 px-6 py-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {keys.map((key) => {
          const meta = SETTING_LABELS[key] ?? { label: key }
          if (key === "logo_url") {
            return (
              <div key={key}>
                <ImageField
                  label={meta.label}
                  value={values[key]}
                  onChange={(url) => setValues({ ...values, [key]: url })}
                />
                <Text size="xsmall" className="text-ui-fg-subtle mt-1">
                  {meta.hint}
                </Text>
              </div>
            )
          }
          return (
            <div key={key} className={meta.long ? "md:col-span-2" : ""}>
              <Label size="small" weight="plus">
                {meta.label}
              </Label>
              {meta.long ? (
                <Textarea
                  className="mt-1"
                  value={values[key] ?? ""}
                  onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                />
              ) : (
                <Input
                  className="mt-1"
                  value={values[key] ?? ""}
                  onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                />
              )}
              {meta.hint && (
                <Text size="xsmall" className="text-ui-fg-subtle mt-1">
                  {meta.hint}
                </Text>
              )}
            </div>
          )
        })}
      </div>
      <div className="flex justify-end">
        <Button onClick={save} isLoading={saving}>
          Save settings
        </Button>
      </div>
    </div>
  )
}

// --------------------------------------------------------------- banners

const emptyBanner: Banner = {
  title: "",
  subtitle: "",
  button_text: "Shop now",
  link: "",
  image_url: "",
  mobile_image_url: "",
  placement: "hero",
  rank: 0,
  is_active: true,
}

const ImageField = ({
  label,
  value,
  onChange,
}: {
  label: string
  value?: string | null
  onChange: (url: string) => void
}) => {
  const [uploading, setUploading] = useState(false)
  return (
    <div>
      <Label size="small" weight="plus">
        {label}
      </Label>
      <div className="mt-1 flex items-center gap-3">
        {value ? (
          <img src={value} alt="" className="h-14 w-24 rounded object-cover" />
        ) : (
          <div className="bg-ui-bg-subtle h-14 w-24 rounded" />
        )}
        <label className="txt-compact-small text-ui-fg-interactive cursor-pointer">
          {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              setUploading(true)
              try {
                onChange(await uploadImage(file))
              } catch (err: any) {
                toast.error(err.message)
              } finally {
                setUploading(false)
              }
            }}
          />
        </label>
        {value && (
          <button
            className="txt-compact-small text-ui-fg-muted"
            onClick={() => onChange("")}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  )
}

const BannerForm = ({
  initial,
  onDone,
}: {
  initial: Banner
  onDone: () => void
}) => {
  const [b, setB] = useState<Banner>(initial)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!b.title.trim()) {
      toast.error("Title is required")
      return
    }
    setSaving(true)
    try {
      const { id, ...body } = b as any
      delete body.created_at
      delete body.updated_at
      delete body.deleted_at
      await adminFetch(
        id ? `/admin/content/banners/${id}` : "/admin/content/banners",
        { method: "POST", body }
      )
      toast.success("Banner saved")
      onDone()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-ui-bg-subtle flex flex-col gap-3 rounded-lg p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <Label size="small" weight="plus">Title</Label>
          <Input className="mt-1" value={b.title} onChange={(e) => setB({ ...b, title: e.target.value })} />
        </div>
        <div>
          <Label size="small" weight="plus">Subtitle</Label>
          <Input className="mt-1" value={b.subtitle ?? ""} onChange={(e) => setB({ ...b, subtitle: e.target.value })} />
        </div>
        <div>
          <Label size="small" weight="plus">Button text</Label>
          <Input className="mt-1" value={b.button_text ?? ""} onChange={(e) => setB({ ...b, button_text: e.target.value })} />
        </div>
        <div>
          <Label size="small" weight="plus">Link</Label>
          <Input
            className="mt-1"
            placeholder="/categories/resin-art"
            value={b.link ?? ""}
            onChange={(e) => setB({ ...b, link: e.target.value })}
          />
        </div>
        <div>
          <Label size="small" weight="plus">Placement</Label>
          <select
            className={`${select} mt-1`}
            value={b.placement}
            onChange={(e) => setB({ ...b, placement: e.target.value as Banner["placement"] })}
          >
            <option value="hero">Hero slider (top of homepage)</option>
            <option value="promo">Promo tile (middle of homepage)</option>
          </select>
        </div>
        <div>
          <Label size="small" weight="plus">Order (lower shows first)</Label>
          <Input
            className="mt-1"
            type="number"
            value={b.rank}
            onChange={(e) => setB({ ...b, rank: Number(e.target.value) })}
          />
        </div>
        <ImageField label="Image (desktop)" value={b.image_url} onChange={(url) => setB({ ...b, image_url: url })} />
        <ImageField
          label="Image (mobile, optional)"
          value={b.mobile_image_url}
          onChange={(url) => setB({ ...b, mobile_image_url: url })}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch checked={b.is_active} onCheckedChange={(v) => setB({ ...b, is_active: v })} />
          <Label size="small">Visible on the store</Label>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onDone}>Cancel</Button>
          <Button onClick={save} isLoading={saving}>Save banner</Button>
        </div>
      </div>
    </div>
  )
}

const BannersTab = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [editing, setEditing] = useState<Banner | null>(null)

  const load = () =>
    adminFetch("/admin/content/banners")
      .then((r) => setBanners(r.banners))
      .catch((e) => toast.error(e.message))

  useEffect(() => {
    load()
  }, [])

  const remove = async (id: string) => {
    if (!window.confirm("Delete this banner?")) return
    try {
      await adminFetch(`/admin/content/banners/${id}`, { method: "DELETE" })
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  return (
    <div className="flex flex-col gap-y-3 px-6 py-4">
      {editing ? (
        <BannerForm
          key={editing.id ?? "new"}
          initial={editing}
          onDone={() => {
            setEditing(null)
            load()
          }}
        />
      ) : (
        <div className="flex justify-end">
          <Button size="small" onClick={() => setEditing({ ...emptyBanner, rank: banners.length })}>
            Add banner
          </Button>
        </div>
      )}

      {banners.length === 0 && !editing && (
        <Text className="text-ui-fg-subtle">No banners yet.</Text>
      )}

      {banners.map((b) => (
        <div key={b.id} className="shadow-elevation-card-rest flex items-center gap-4 rounded-lg p-3">
          {b.image_url ? (
            <img src={b.image_url} alt="" className="h-12 w-20 rounded object-cover" />
          ) : (
            <div className="bg-ui-bg-subtle h-12 w-20 rounded" />
          )}
          <div className="flex-1">
            <Text weight="plus">{b.title}</Text>
            <Text size="small" className="text-ui-fg-subtle">
              {b.placement === "hero" ? "Hero slider" : "Promo tile"} · order {b.rank}
              {b.link ? ` · ${b.link}` : ""}
            </Text>
          </div>
          <Badge color={b.is_active ? "green" : "grey"}>{b.is_active ? "Visible" : "Hidden"}</Badge>
          <Button size="small" variant="secondary" onClick={() => setEditing(b)}>Edit</Button>
          <Button size="small" variant="transparent" onClick={() => remove(b.id!)}>Delete</Button>
        </div>
      ))}
    </div>
  )
}

// -------------------------------------------------------------- sections

const emptySection: Section = {
  title: "",
  subtitle: "",
  type: "category_grid",
  category_handle: "",
  collection_handle: "",
  max_items: 8,
  rank: 0,
  is_active: true,
}

const SectionForm = ({
  initial,
  onDone,
}: {
  initial: Section
  onDone: () => void
}) => {
  const [s, setS] = useState<Section>(initial)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<{ handle: string; name: string; parent_category_id: string | null }[]>([])

  useEffect(() => {
    adminFetch("/admin/product-categories?limit=500&fields=id,handle,name,parent_category_id")
      .then((r) => setCategories(r.product_categories ?? []))
      .catch(() => {})
  }, [])

  const save = async () => {
    if (!s.title.trim()) {
      toast.error("Title is required")
      return
    }
    setSaving(true)
    try {
      const { id, ...body } = s as any
      delete body.created_at
      delete body.updated_at
      delete body.deleted_at
      await adminFetch(
        id ? `/admin/content/sections/${id}` : "/admin/content/sections",
        { method: "POST", body }
      )
      toast.success("Section saved")
      onDone()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-ui-bg-subtle flex flex-col gap-3 rounded-lg p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <Label size="small" weight="plus">Title</Label>
          <Input className="mt-1" value={s.title} onChange={(e) => setS({ ...s, title: e.target.value })} />
        </div>
        <div>
          <Label size="small" weight="plus">Subtitle</Label>
          <Input className="mt-1" value={s.subtitle ?? ""} onChange={(e) => setS({ ...s, subtitle: e.target.value })} />
        </div>
        <div>
          <Label size="small" weight="plus">Section type</Label>
          <select
            className={`${select} mt-1`}
            value={s.type}
            onChange={(e) => setS({ ...s, type: e.target.value as Section["type"] })}
          >
            <option value="category_grid">Category tiles</option>
            <option value="product_grid">Product row</option>
          </select>
        </div>
        <div>
          <Label size="small" weight="plus">
            {s.type === "category_grid" ? "Show sub-categories of" : "Products from category"}
          </Label>
          <select
            className={`${select} mt-1`}
            value={s.category_handle ?? ""}
            onChange={(e) => setS({ ...s, category_handle: e.target.value })}
          >
            <option value="">
              {s.type === "category_grid" ? "All top-level categories" : "— Any (newest products) —"}
            </option>
            {categories.map((c) => (
              <option key={c.handle} value={c.handle}>
                {c.parent_category_id ? "— " : ""}
                {c.name}
              </option>
            ))}
          </select>
        </div>
        {s.type === "product_grid" && (
          <div>
            <Label size="small" weight="plus">Or collection handle (optional)</Label>
            <Input
              className="mt-1"
              placeholder="new-arrivals"
              value={s.collection_handle ?? ""}
              onChange={(e) => setS({ ...s, collection_handle: e.target.value })}
            />
          </div>
        )}
        <div>
          <Label size="small" weight="plus">Max items</Label>
          <Input
            className="mt-1"
            type="number"
            value={s.max_items}
            onChange={(e) => setS({ ...s, max_items: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label size="small" weight="plus">Order (lower shows first)</Label>
          <Input
            className="mt-1"
            type="number"
            value={s.rank}
            onChange={(e) => setS({ ...s, rank: Number(e.target.value) })}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch checked={s.is_active} onCheckedChange={(v) => setS({ ...s, is_active: v })} />
          <Label size="small">Visible on the store</Label>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onDone}>Cancel</Button>
          <Button onClick={save} isLoading={saving}>Save section</Button>
        </div>
      </div>
    </div>
  )
}

const SectionsTab = () => {
  const [sections, setSections] = useState<Section[]>([])
  const [editing, setEditing] = useState<Section | null>(null)

  const load = () =>
    adminFetch("/admin/content/sections")
      .then((r) => setSections(r.sections))
      .catch((e) => toast.error(e.message))

  useEffect(() => {
    load()
  }, [])

  const remove = async (id: string) => {
    if (!window.confirm("Delete this section?")) return
    try {
      await adminFetch(`/admin/content/sections/${id}`, { method: "DELETE" })
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  return (
    <div className="flex flex-col gap-y-3 px-6 py-4">
      {editing ? (
        <SectionForm
          key={editing.id ?? "new"}
          initial={editing}
          onDone={() => {
            setEditing(null)
            load()
          }}
        />
      ) : (
        <div className="flex justify-end">
          <Button size="small" onClick={() => setEditing({ ...emptySection, rank: sections.length })}>
            Add section
          </Button>
        </div>
      )}

      {sections.map((s) => (
        <div key={s.id} className="shadow-elevation-card-rest flex items-center gap-4 rounded-lg p-3">
          <Text size="small" className="text-ui-fg-muted w-8 text-center">{s.rank}</Text>
          <div className="flex-1">
            <Text weight="plus">{s.title}</Text>
            <Text size="small" className="text-ui-fg-subtle">
              {s.type === "category_grid" ? "Category tiles" : "Product row"}
              {s.category_handle ? ` · ${s.category_handle}` : ""}
              {s.collection_handle ? ` · collection: ${s.collection_handle}` : ""}
            </Text>
          </div>
          <Badge color={s.is_active ? "green" : "grey"}>{s.is_active ? "Visible" : "Hidden"}</Badge>
          <Button size="small" variant="secondary" onClick={() => setEditing(s)}>Edit</Button>
          <Button size="small" variant="transparent" onClick={() => remove(s.id!)}>Delete</Button>
        </div>
      ))}
    </div>
  )
}

// ------------------------------------------------------------------ page

const StorefrontPage = () => {
  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h1">Storefront</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Edit the homepage banners and sections, the announcement bar and your
          contact details. Changes appear on the store within a minute.
        </Text>
      </div>
      <Tabs defaultValue="sections">
        <div className="px-6 pt-4">
          <Tabs.List>
            <Tabs.Trigger value="sections">Homepage sections</Tabs.Trigger>
            <Tabs.Trigger value="banners">Banners</Tabs.Trigger>
            <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
          </Tabs.List>
        </div>
        <Tabs.Content value="sections">
          <SectionsTab />
        </Tabs.Content>
        <Tabs.Content value="banners">
          <BannersTab />
        </Tabs.Content>
        <Tabs.Content value="settings">
          <SettingsTab />
        </Tabs.Content>
      </Tabs>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Storefront",
  icon: BuildingStorefront,
})

export default StorefrontPage
