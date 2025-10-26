import type { LocaleCode } from "~/utils/i18n/locales";

type MessageOverrides = Record<string, unknown>;

const MOCK_TRANSLATIONS: Record<LocaleCode, MessageOverrides> = {
  en: {
    portfolio: {
      contact: {
        description: "This is placeholder contact information displayed while working locally.",
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
          description: "Mock contact options to preview the layout during development.",
        },
      },
      blog: {
        description: "Placeholder insights appear here while developing locally.",
        filters: {
          search: "Search mock articles",
          categories: "Mock categories",
          tags: "Mock tags",
          all: "All mock posts",
        },
        list: {
          readingTime: "{minutes} min read",
          readMore: "Open mock article",
          empty: {
            title: "No mock posts for these filters",
            description:
              "Adjust the filters to preview how the blog behaves with different datasets in development.",
          },
        },
        meta: {
          heading: "Mock article details",
          published: "Published",
          updated: "Updated",
          readingTime: "Reading time",
          copyLink: "Copy mock link",
          linkCopied: "Link copied!",
          backToList: "View all mock posts",
        },
        related: "More mock articles",
        notFound: {
          title: "Mock article not found",
          description:
            "This placeholder entry might not exist. Return to the blog overview to keep testing.",
          cta: "Back to mock blog",
        },
        empty: {
          title: "Demo articles coming soon",
          description:
            "Development mode shows example content so you can review the blog layout. Feel free to get in touch about your project.",
        },
      },
      githubProjects: {
        description: "Mock repositories are displayed while developing locally.",
        empty: "Example GitHub projects appear here in development builds.",
        metaDescription:
          "Browse placeholder GitHub repositories available in local development mode.",
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
        filters: {
          search: "Rechercher (démo)",
          categories: "Catégories fictives",
          tags: "Tags fictifs",
          all: "Tous les articles de démo",
        },
        list: {
          readingTime: "{minutes} min",
          readMore: "Ouvrir l’article démo",
          empty: {
            title: "Aucun article de démo pour ces filtres",
            description:
              "Ajustez les filtres pour prévisualiser le comportement du blog en développement.",
          },
        },
        meta: {
          heading: "Détails (démo)",
          published: "Publié",
          updated: "Mis à jour",
          readingTime: "Temps de lecture",
          copyLink: "Copier le lien démo",
          linkCopied: "Lien copié !",
          backToList: "Retour aux articles de démo",
        },
        related: "Autres articles de démonstration",
        notFound: {
          title: "Article de démo introuvable",
          description:
            "Cet élément factice n’existe peut-être pas. Revenez à la liste pour continuer les tests.",
          cta: "Retour au blog de démo",
        },
        empty: {
          title: "Articles à venir (démonstration)",
          description:
            "En développement, nous affichons des exemples pour vérifier la mise en page du blog. Contactez-moi pour discuter de votre projet.",
        },
      },
      githubProjects: {
        description: "Des dépôts fictifs s'affichent pendant le développement local.",
        empty: "Des projets GitHub d'exemple apparaissent ici en mode développement.",
        metaDescription: "Consultez des dépôts GitHub factices disponibles en environnement local.",
      },
    },
  },
  de: {
    portfolio: {
      contact: {
        description: "Platzhalter-Kontaktdaten für lokale Entwicklungsumgebungen.",
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
        description: "Während der Entwicklung werden hier Platzhalter-Einblicke angezeigt.",
        filters: {
          search: "Beiträge suchen (Demo)",
          categories: "Demo-Kategorien",
          tags: "Demo-Tags",
          all: "Alle Demo-Beiträge",
        },
        list: {
          readingTime: "{minutes} Min.",
          readMore: "Demo-Beitrag öffnen",
          empty: {
            title: "Keine Demo-Beiträge für diese Filter",
            description: "Passe die Filter an, um das Blog-Verhalten in der Entwicklung zu testen.",
          },
        },
        meta: {
          heading: "Demodaten",
          published: "Veröffentlicht",
          updated: "Aktualisiert",
          readingTime: "Lesezeit",
          copyLink: "Demo-Link kopieren",
          linkCopied: "Link kopiert!",
          backToList: "Zurück zur Demo-Liste",
        },
        related: "Weitere Demo-Artikel",
        notFound: {
          title: "Demo-Artikel nicht gefunden",
          description:
            "Dieser Platzhalter existiert eventuell nicht. Kehre zur Übersicht zurück, um weiterzutesten.",
          cta: "Zurück zum Demo-Blog",
        },
        empty: {
          title: "Beiträge folgen bald (Demo)",
          description:
            "Im Entwicklungsmodus zeigen wir Beispieldaten, um das Blog-Layout zu prüfen. Melde dich gern, um über dein Projekt zu sprechen.",
        },
      },
      githubProjects: {
        description: "Während der lokalen Entwicklung werden Platzhalter-Repositories angezeigt.",
        empty: "Beispielhafte GitHub-Projekte erscheinen hier im Entwicklungsmodus.",
        metaDescription:
          "Entdecke Platzhalter-GitHub-Repositories, die in der lokalen Entwicklung verfügbar sind.",
      },
    },
  },
  es: {
    portfolio: {
      contact: {
        description: "Información de contacto ficticia mostrada en el entorno de desarrollo.",
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
        description: "Mientras desarrollamos se muestran aquí ideas ficticias.",
        filters: {
          search: "Buscar artículos demo",
          categories: "Categorías demo",
          tags: "Etiquetas demo",
          all: "Todas las publicaciones demo",
        },
        list: {
          readingTime: "{minutes} min",
          readMore: "Abrir artículo demo",
          empty: {
            title: "No hay artículos demo para estos filtros",
            description:
              "Ajusta los filtros para comprobar el comportamiento del blog durante el desarrollo.",
          },
        },
        meta: {
          heading: "Detalles (demo)",
          published: "Publicado",
          updated: "Actualizado",
          readingTime: "Tiempo de lectura",
          copyLink: "Copiar enlace demo",
          linkCopied: "¡Enlace copiado!",
          backToList: "Volver a las publicaciones demo",
        },
        related: "Más artículos demo",
        notFound: {
          title: "Artículo demo no encontrado",
          description:
            "Puede que esta entrada ficticia no exista. Regresa al blog para seguir probando.",
          cta: "Volver al blog demo",
        },
        empty: {
          title: "Publicaciones en camino (demo)",
          description:
            "En desarrollo mostramos datos de ejemplo para revisar el diseño del blog. Escríbeme cuando quieras hablar de tu proyecto.",
        },
      },
      githubProjects: {
        description: "Durante el desarrollo local se muestran repositorios de ejemplo.",
        empty: "En modo desarrollo aparecerán aquí proyectos de GitHub de demostración.",
        metaDescription:
          "Explora repositorios de GitHub ficticios disponibles en el entorno local de desarrollo.",
      },
    },
  },
  it: {
    portfolio: {
      contact: {
        description: "Informazioni di contatto fittizie mostrate nell'ambiente di sviluppo.",
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
          description: "Canali di contatto di esempio per vedere l'impaginazione in sviluppo.",
        },
      },
      blog: {
        description: "Durante lo sviluppo qui compaiono contenuti segnaposto.",
        filters: {
          search: "Cerca articoli demo",
          categories: "Categorie demo",
          tags: "Tag demo",
          all: "Tutti gli articoli demo",
        },
        list: {
          readingTime: "{minutes} min",
          readMore: "Apri articolo demo",
          empty: {
            title: "Nessun articolo demo con questi filtri",
            description: "Modifica i filtri per vedere come reagisce il blog durante lo sviluppo.",
          },
        },
        meta: {
          heading: "Dettagli (demo)",
          published: "Pubblicato",
          updated: "Aggiornato",
          readingTime: "Tempo di lettura",
          copyLink: "Copia link demo",
          linkCopied: "Link copiato!",
          backToList: "Torna agli articoli demo",
        },
        related: "Altri articoli demo",
        notFound: {
          title: "Articolo demo non trovato",
          description:
            "È possibile che questo elemento fittizio non esista. Torna alla lista per continuare i test.",
          cta: "Ritorna al blog demo",
        },
        empty: {
          title: "Articoli in arrivo (demo)",
          description:
            "In sviluppo mostriamo dati di esempio per verificare il layout del blog. Scrivimi quando vuoi parlare del tuo progetto.",
        },
      },
      githubProjects: {
        description: "Durante lo sviluppo locale vengono mostrati repository di esempio.",
        empty: "In modalità sviluppo qui compaiono progetti GitHub dimostrativi.",
        metaDescription:
          "Esplora repository GitHub fittizi disponibili nell'ambiente di sviluppo locale.",
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
          description: "Пример вариантов связи, чтобы посмотреть макет в режиме разработки.",
        },
      },
      blog: {
        description: "Во время разработки здесь показываются демонстрационные материалы.",
        filters: {
          search: "Поиск статей (демо)",
          categories: "Демо-категории",
          tags: "Демо-теги",
          all: "Все демо-статьи",
        },
        list: {
          readingTime: "{minutes} мин",
          readMore: "Открыть демо-статью",
          empty: {
            title: "Нет демо-статей для выбранных фильтров",
            description:
              "Измените фильтры, чтобы посмотреть, как блог ведёт себя в режиме разработки.",
          },
        },
        meta: {
          heading: "Детали (демо)",
          published: "Опубликовано",
          updated: "Обновлено",
          readingTime: "Время чтения",
          copyLink: "Скопировать демо-ссылку",
          linkCopied: "Ссылка скопирована!",
          backToList: "К списку демо-статей",
        },
        related: "Другие демо-материалы",
        notFound: {
          title: "Демо-статья не найдена",
          description:
            "Возможно, этой фиктивной записи нет. Вернитесь к списку, чтобы продолжить тестирование.",
          cta: "Назад к демо-блогу",
        },
        empty: {
          title: "Статьи появятся скоро (демо)",
          description:
            "В режиме разработки мы показываем пример данных, чтобы проверить макет блога. Пишите, если хотите обсудить свой проект.",
        },
      },
      githubProjects: {
        description: "Во время локальной разработки отображаются демонстрационные репозитории.",
        empty: "В режиме разработки здесь появятся демонстрационные проекты GitHub.",
        metaDescription:
          "Просмотрите демонстрационные репозитории GitHub, доступные в локальной среде разработки.",
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
        filters: {
          search: "ابحث في مقالات التجربة",
          categories: "تصنيفات تجريبية",
          tags: "وسوم تجريبية",
          all: "كل مقالات التجربة",
        },
        list: {
          readingTime: "{minutes} دقيقة",
          readMore: "عرض المقال التجريبي",
          empty: {
            title: "لا توجد مقالات تجريبية لهذه الفلاتر",
            description: "عدّل الفلاتر لمعاينة سلوك المدونة أثناء التطوير.",
          },
        },
        meta: {
          heading: "تفاصيل (تجريبي)",
          published: "تاريخ النشر",
          updated: "آخر تحديث",
          readingTime: "مدة القراءة",
          copyLink: "نسخ رابط تجريبي",
          linkCopied: "تم النسخ!",
          backToList: "العودة لقائمة التجربة",
        },
        related: "مقالات تجريبية إضافية",
        notFound: {
          title: "لم يتم العثور على المقال التجريبي",
          description: "قد لا يكون هذا العنصر الوهمي موجودًا. عُد إلى المدونة لمواصلة الاختبار.",
          cta: "العودة إلى المدونة التجريبية",
        },
        empty: {
          title: "مقالات قادمة قريباً (تجريبي)",
          description:
            "في وضع التطوير نعرض بيانات مثال لمراجعة تخطيط المدونة. لا تتردد في التواصل لمناقشة مشروعك.",
        },
      },
      githubProjects: {
        description: "أثناء التطوير المحلي تُعرض مستودعات تجريبية.",
        empty: "في وضع التطوير ستظهر هنا مشاريع GitHub تجريبية.",
        metaDescription: "استعرض مستودعات GitHub تجريبية متاحة في بيئة التطوير المحلية.",
      },
    },
  },
};

export function getMockTranslations(locale: LocaleCode): MessageOverrides {
  return MOCK_TRANSLATIONS[locale] ?? MOCK_TRANSLATIONS.en;
}
