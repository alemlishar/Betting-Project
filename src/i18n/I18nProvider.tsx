import React from "react";
import { IntlProvider } from "react-intl";
import useSWR from "swr";
import it from "src/l10n/compiled/it.json";
import es from "src/l10n/compiled/es.json";
// if these are in error, see i18n compilation steps in the readme

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { data: locale } = useSWR("locale", getLocale);
  const { data: translations } = useSWR(locale ?? null, loadLocaleData);
  if (!locale || !translations) {
    return null;
  }
  return (
    <IntlProvider messages={translations} locale={locale} defaultLocale="it">
      {children}
    </IntlProvider>
  );
}

async function getLocale() {
  return "it";
  // TODO implementare lato backend la lettura della lingua

  // const response = await fetch("/path-rest-per-lingua");
  // const data = await response.text();
  // return data;
}

async function loadLocaleData(locale: string) {
  // TODO caricamento asincrono della lingua
  switch (locale) {
    case "it":
      return it;
    case "es":
      return es;
    default:
      return null;
  }
}
