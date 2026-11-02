import { MedusaService } from "@medusajs/framework/utils"
import Banner from "./models/banner"
import HomeSection from "./models/home-section"
import SiteSetting from "./models/site-setting"

/**
 * Generated methods include:
 * listBanners, createBanners, updateBanners, deleteBanners,
 * listHomeSections, createHomeSections, updateHomeSections, deleteHomeSections,
 * listSiteSettings, createSiteSettings, updateSiteSettings, deleteSiteSettings
 */
class StoreContentModuleService extends MedusaService({
  Banner,
  HomeSection,
  SiteSetting,
}) {
  /** Returns all settings as a plain { key: value } object. */
  async getSettingsMap(): Promise<Record<string, string>> {
    const settings = await this.listSiteSettings({}, { take: 500 })
    return settings.reduce((acc, s) => {
      acc[s.key] = s.value ?? ""
      return acc
    }, {} as Record<string, string>)
  }

  /** Creates or updates each key in `values`. */
  async upsertSettings(values: Record<string, string | null>) {
    const keys = Object.keys(values)
    if (!keys.length) {
      return this.getSettingsMap()
    }

    const existing = await this.listSiteSettings({ key: keys }, { take: 500 })
    const byKey = new Map(existing.map((s) => [s.key, s]))

    const toUpdate = existing.map((s) => ({ id: s.id, value: values[s.key] ?? null }))
    const toCreate = keys
      .filter((k) => !byKey.has(k))
      .map((k) => ({ key: k, value: values[k] ?? null }))

    if (toUpdate.length) {
      await this.updateSiteSettings(toUpdate)
    }
    if (toCreate.length) {
      await this.createSiteSettings(toCreate)
    }

    return this.getSettingsMap()
  }
}

export default StoreContentModuleService
