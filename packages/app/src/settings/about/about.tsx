import { Brand } from "@opencode/util/brand"
import { useLanguage } from "@/runtime/i18n/language"
import { usePlatform } from "@/runtime/platform/platform"
import { ExternalLink } from "@/runtime/platform/external-link"
import legal from "./legal.svg"
import { AnimatedWordmark } from "./animated-wordmark"

export function SettingsAbout(props: { active: boolean }) {
  const language = useLanguage()
  const platform = usePlatform()

  return (
    <div class="settings-about-content">
      <div class="settings-about-intro">
        <p>{language.t("settings.about.version", { version: platform.version ?? language.t("settings.about.devVersion") })}</p>
        <p>{language.t("settings.about.license")}</p>
      </div>

      <AnimatedWordmark active={props.active} />

      <div class="settings-about-publication">
        <p>{language.t("settings.about.firstPublished")}</p>
      </div>

      <p class="settings-about-faint">
        <ExternalLink href={Brand.home}>
          <bdi dir="ltr">{language.t("settings.about.website")}</bdi>
        </ExternalLink>
      </p>

      <div class="settings-about-details">
        <p>{language.t("settings.about.description")}</p>
        <p>{language.t("settings.about.trademark")}</p>
        <p>{language.t("settings.about.typeset")}</p>
      </div>

      <p>{language.t("settings.about.tagline")}</p>
      <img class="settings-about-legal" src={legal} alt="" />
      <div class="settings-about-copyright">
        <p>{language.t("settings.about.copyright")}</p>
      </div>
    </div>
  )
}
