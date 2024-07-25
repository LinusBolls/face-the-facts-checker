type Language = typeof en;

const en = {
  meta: {
    name: "Face the Facts",
    description: "Get live, ai-based fact checks on your content!",
  },
  fact: {
    aiCaption: "AI added context",
    copyButton: "Copy",
    ariaCopyButton: "Copy this fact",
    isThisHelpful: "Is this helpful?",
    helpfulness: {
      yes: {
        label: "Yes",
        aria: "Rate as helpful",
      },
      somewhat: {
        label: "Somewhat",
        aria: "Rate as somewhat helpful",
      },
      no: {
        label: "No",
        aria: "Rate as unhelpful",
      },
    },
    ariaDescription:
      "Context to the current video section, brought to you by Face the Facts",
    ariaCloseButton: "Close fact",
  },
};

const de = {
  meta: {
    name: "Face the Facts",
    description: "Live, KI-generierte Faktenchecks für YouTube!",
  },
  fact: {
    aiCaption: "KI-generierter Kontext zum Video",
    copyButton: "Kopieren",
    ariaCopyButton: "Diesen Fakt kopieren",
    isThisHelpful: "Ist das hilfreich?",
    helpfulness: {
      yes: {
        label: "Ja",
        aria: "Als hilfreich bewerten",
      },
      somewhat: {
        label: "Etwas",
        aria: "Als etwas hilfreich bewerten",
      },
      no: {
        label: "Nein",
        aria: "Als nicht hilfreich bewerten",
      },
    },
    ariaDescription: "Kontext zum Video, präsentiert von Face the Facts",
    ariaCloseButton: "Fakt schließen",
  },
} satisfies Language;

export const locales = {
  en,
  de,
} satisfies Record<string, Language>;

export function t(key: string): string {
  return chrome.i18n.getMessage(key);
}
