import { useI18n } from "vue-i18n";

// const { t } = useI18n();
import { $t } from "./i18n/locales";

export default defineAppConfig({
  shadcnDocs: {
    site: {
      name: "Bro World Portfolio",
      description: "Documentation hub for the Bro World Portfolio experience and admin tooling.",
      ogImage: "/og-image.png",
    },
    theme: {
      customizable: true,
      color: "zinc",
      radius: 0.75,
    },
    banner: {
      enable: true,
      showClose: false,
      content: "Explore the live experience at [**rami.aouinti.com**](https://rami.aouinti.com).",
      to: "https://rami.aouinti.com",
      target: "_blank",
      border: true,
    },
    header: {
      title: "Bro World Portfolio",
      showTitle: true,
      darkModeToggle: true,
      logo: {
        light: "/logo.svg",
        dark: "/logo-dark.svg",
      },
      nav: [
        {
          title: $t("nav.Docs"),
          links: [
            {
              title: $t("nav.GettingStarted"),
              to: "/getting-started/introduction",
              description: $t("nav.GettingStartedDescription"),
            },
            {
              title: $t("nav.Installation"),
              to: "/getting-started/installation",
              description: $t("nav.InstallationDescription"),
            },
            {
              title: $t("nav.Components"),
              to: "/components",
              description: $t("nav.ComponentsDescription"),
              target: "_self",
            },
            {
              title: "Live Bro World site",
              to: "https://rami.aouinti.com",
              description: "Preview the production Bro World Portfolio experience.",
              target: "_blank",
            },
          ],
        },
        {
          title: "Credits",
          links: [
            {
              title: "Aceternity UI",
              to: "https://ui.aceternity.com/",
              description:
                "For providing the inspiration and permission to adapt the original designs.",
              target: "_blank",
            },
            {
              title: "Magic UI",
              to: "https://magicui.design/",
              description: "For providing the inspiration for designs.",
              target: "_blank",
            },
            {
              title: "shadcn-vue",
              to: "https://www.shadcn-vue.com/",
              description: "For the Vue port of shadcn-ui and contributions to some components",
              target: "_blank",
            },
            {
              title: "shadcn-docs-nuxt",
              to: "https://github.com/ZTL-UwU/shadcn-docs-nuxt",
              description: "For the beautifully crafted Nuxt documentation site.",
              target: "_blank",
            },
          ],
        },
        {
          title: $t("nav.Community"),
          links: [
            {
              title: "GitHub",
              to: "https://github.com/rami-aouinti/bro-world-portfolio",
              description: "Browse the source code and contribute to Bro World Portfolio.",
              target: "_blank",
            },
            {
              title: "Discussions",
              to: "https://github.com/rami-aouinti/bro-world-portfolio/discussions",
              description: "Share feedback and ideas with the maintainers.",
              target: "_blank",
            },
            {
              title: "Issues",
              to: "https://github.com/rami-aouinti/bro-world-portfolio/issues",
              target: "_blank",
              description: "Report bugs or track roadmap tasks.",
            },
          ],
        },
      ],
      links: [
        {
          icon: "lucide:github",
          to: "https://github.com/rami-aouinti/bro-world-portfolio",
          target: "_blank",
        },
        {
          icon: "lucide:globe",
          to: "https://rami.aouinti.com",
          target: "_blank",
        },
      ],
    },
    aside: {
      useLevel: true,
      collapse: false,
      folderStyle: "tree",
      levelStyle: "aside",
    },
    main: {
      breadCrumb: true,
      showTitle: true,
      padded: true,
      codeCopyToast: true,
    },
    footer: {
      credits: "Bro World Portfolio © 2024 - 2025",
      links: [
        {
          icon: "lucide:globe",
          to: "https://rami.aouinti.com",
          title: "Maintained by Mohamed Rami Aouinti",
          target: "_blank",
        },
        {
          icon: "lucide:github",
          title: "GitHub",
          to: "https://github.com/rami-aouinti/bro-world-portfolio",
          target: "_blank",
        },
      ],
    },
    toc: {
      enable: true,
      title: $t("toc.title"),
      enableInHomepage: false,
      carbonAds: {
        enable: true,
        code: "CW7DEK37",
        placement: "bro-world-portfolio",
      },
      links: [
        {
          title: $t("toc.StarOnGitHub"),
          icon: "lucide:star",
          to: "https://github.com/rami-aouinti/bro-world-portfolio",
          target: "_blank",
        },
        {
          title: $t("toc.CreateIssues"),
          icon: "lucide:circle-dot",
          to: "https://github.com/rami-aouinti/bro-world-portfolio/issues",
          target: "_blank",
        },
        {
          title: $t("toc.Forum"),
          icon: "lucide:newspaper",
          to: "https://github.com/rami-aouinti/bro-world-portfolio/discussions",
          target: "_blank",
        },
        {
          title: "Live portfolio",
          icon: "lucide:globe",
          to: "https://rami.aouinti.com",
          target: "_blank",
        },
      ],
    },
    search: {
      enable: true,
    },
  },
});
