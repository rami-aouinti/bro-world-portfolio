import { computed } from "vue";
import { useAppConfig } from "#imports";

type ThemeConfig = {
  customizable: boolean;
  color: string;
  radius: number;
};

type HeaderConfig = {
  darkModeToggle: boolean;
};

type DocsAppConfig = {
  theme: ThemeConfig;
  header: HeaderConfig;
};

type PartialDocsConfig = Partial<DocsAppConfig> & {
  theme?: Partial<ThemeConfig>;
  header?: Partial<HeaderConfig>;
};

const defaultConfig: DocsAppConfig = {
  theme: {
    customizable: false,
    color: "zinc",
    radius: 0.75,
  },
  header: {
    darkModeToggle: false,
  },
};

export function useConfig() {
  const appConfig = useAppConfig();

  return computed(() => {
    const rawConfig = (appConfig?.shadcnDocs as PartialDocsConfig | undefined) ?? {};

    return {
      ...defaultConfig,
      ...rawConfig,
      theme: {
        ...defaultConfig.theme,
        ...rawConfig.theme,
      },
      header: {
        ...defaultConfig.header,
        ...rawConfig.header,
      },
    } satisfies DocsAppConfig;
  });
}
