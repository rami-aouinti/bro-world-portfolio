import type { LocaleCode } from "~/utils/i18n/locales";

type MessageOverrides = Record<string, unknown>;

const MOCK_TRANSLATIONS: Record<LocaleCode, MessageOverrides> = {
  en: {
    portfolio: {
      contact: {
        description:
          "This is placeholder contact information displayed while working locally.",
        methods: {
          email: {
            value: "hello@example.dev",
          },
          location: {
            value: "Remote (worldwide)",
          },
          availability: {
            value: "Monday to Friday, 9am – 5pm (local time)",
          },
        },
        card: {
          description:
            "Mock contact options to preview the layout during development.",
        },
      },
      blog: {
        description: "Placeholder insights appear here while developing locally.",
        empty: {
          title: "Demo articles coming soon",
          description:
            "Development mode shows example content so you can review the blog layout. Feel free to get in touch about your project.",
        },
      },
    },
  },
  fr: {
    portfolio: {
      contact: {
        description:
          "Informations de contact factices affichées en environnement de développement.",
        methods: {
          email: {
            value: "hello@example.dev",
          },
          location: {
            value: "Disponible à distance (monde)",
          },
          availability: {
            value: "Du lundi au vendredi, 9h – 17h (heure locale)",
          },
        },
        card: {
          description:
            "Options de contact fictives pour prévisualiser la mise en page en développement.",
        },
      },
      blog: {
        description: "Des idées factices sont affichées ici pendant le développement.",
        empty: {
          title: "Articles à venir (démonstration)",
          description:
            "En développement, nous affichons des exemples pour vérifier la mise en page du blog. Contactez-moi pour discuter de votre projet.",
        },
      },
    },
  },
  de: {
    portfolio: {
      contact: {
        description:
          "Platzhalter-Kontaktdaten für lokale Entwicklungsumgebungen.",
        methods: {
          email: {
            value: "hello@example.dev",
          },
          location: {
            value: "Remote (weltweit)",
          },
          availability: {
            value: "Montag bis Freitag, 9:00 – 17:00 (Ortszeit)",
          },
        },
        card: {
          description:
            "Fiktive Kontaktmöglichkeiten zur Vorschau des Layouts im Entwicklungsmodus.",
        },
      },
      blog: {
        description:
          "Während der Entwicklung werden hier Platzhalter-Einblicke angezeigt.",
        empty: {
          title: "Beiträge folgen bald (Demo)",
          description:
            "Im Entwicklungsmodus zeigen wir Beispieldaten, um das Blog-Layout zu prüfen. Melde dich gern, um über dein Projekt zu sprechen.",
        },
      },
    },
  },
  es: {
    portfolio: {
      contact: {
        description:
          "Información de contacto ficticia mostrada en el entorno de desarrollo.",
        methods: {
          email: {
            value: "hello@example.dev",
          },
          location: {
            value: "Disponible de forma remota (global)",
          },
          availability: {
            value: "De lunes a viernes, 9:00 – 17:00 (hora local)",
          },
        },
        card: {
          description:
            "Opciones de contacto de ejemplo para previsualizar el diseño en desarrollo.",
        },
      },
      blog: {
        description:
          "Mientras desarrollamos se muestran aquí ideas ficticias.",
        empty: {
          title: "Publicaciones en camino (demo)",
          description:
            "En desarrollo mostramos datos de ejemplo para revisar el diseño del blog. Escríbeme cuando quieras hablar de tu proyecto.",
        },
      },
    },
  },
  it: {
    portfolio: {
      contact: {
        description:
          "Informazioni di contatto fittizie mostrate nell'ambiente di sviluppo.",
        methods: {
          email: {
            value: "hello@example.dev",
          },
          location: {
            value: "Disponibile da remoto (globale)",
          },
          availability: {
            value: "Dal lunedì al venerdì, 9:00 – 17:00 (ora locale)",
          },
        },
        card: {
          description:
            "Canali di contatto di esempio per vedere l'impaginazione in sviluppo.",
        },
      },
      blog: {
        description:
          "Durante lo sviluppo qui compaiono contenuti segnaposto.",
        empty: {
          title: "Articoli in arrivo (demo)",
          description:
            "In sviluppo mostriamo dati di esempio per verificare il layout del blog. Scrivimi quando vuoi parlare del tuo progetto.",
        },
      },
    },
  },
  ru: {
    portfolio: {
      contact: {
        description:
          "На этой странице отображаются фиктивные контактные данные для режима разработки.",
        methods: {
          email: {
            value: "hello@example.dev",
          },
          location: {
            value: "Удалённо (по всему миру)",
          },
          availability: {
            value: "Понедельник – пятница, 9:00 – 17:00 (местное время)",
          },
        },
        card: {
          description:
            "Пример вариантов связи, чтобы посмотреть макет в режиме разработки.",
        },
      },
      blog: {
        description:
          "Во время разработки здесь показываются демонстрационные материалы.",
        empty: {
          title: "Статьи появятся скоро (демо)",
          description:
            "В режиме разработки мы показываем пример данных, чтобы проверить макет блога. Пишите, если хотите обсудить свой проект.",
        },
      },
    },
  },
  ar: {
    portfolio: {
      contact: {
        description: "يتم عرض معلومات اتصال تجريبية أثناء بيئة التطوير.",
        methods: {
          email: {
            value: "hello@example.dev",
          },
          location: {
            value: "عن بُعد (حول العالم)",
          },
          availability: {
            value: "من الإثنين إلى الجمعة، 9:00 – 17:00 (بالتوقيت المحلي)",
          },
        },
        card: {
          description: "قنوات اتصال وهمية لعرض التخطيط في وضع التطوير.",
        },
      },
      blog: {
        description: "أثناء التطوير نعرض هنا محتوى تجريبياً.",
        empty: {
          title: "مقالات قادمة قريباً (تجريبي)",
          description:
            "في وضع التطوير نعرض بيانات مثال لمراجعة تخطيط المدونة. لا تتردد في التواصل لمناقشة مشروعك.",
        },
      },
    },
  },
};

export function getMockTranslations(locale: LocaleCode): MessageOverrides {
  return MOCK_TRANSLATIONS[locale] ?? MOCK_TRANSLATIONS.en;
}
