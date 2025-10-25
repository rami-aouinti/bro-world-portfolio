import type { SiteMenuItem } from "~/types/settings";
import type { MenuBlueprint } from "~/lib/navigation/menu-blueprints";
import { convertBlueprintsToMenus, mergeMenuBlueprints } from "~/lib/navigation/menu-blueprints";

export interface PluginQuickLaunchDefinition {
  icon: string;
  label: string;
  to: string;
  order?: number;
}

export interface PluginRegistryEntry {
  id: string;
  menuItems: MenuBlueprint[];
  quickLaunch?: PluginQuickLaunchDefinition | PluginQuickLaunchDefinition[];
}

const pluginRegistry: readonly [
  {
    menuItems: readonly [
      {
        icon: "mdi:message-text-outline";
        id: "messenger";
        label: "layout.sidebar.items.messenger";
        to: "/messenger";
        isVisible: false;
        translate: true;
        order: 0;
      },
    ];
    id: "messenger";
  },
  {
    menuItems: readonly [
      {
        icon: "mdi:briefcase-search";
        id: "jobs";
        label: "layout.sidebar.items.jobs";
        to: "/job";
        isVisible: true;
        translate: true;
        order: 0;
      },
      {
        children: readonly [
          {
            requiresAdmin: true;
            children: readonly [
              {
                requiresAdmin: true;
                icon: "mdi:tune";
                id: "admin-job-general";
                label: "layout.sidebar.items.adminGeneralSetting";
                to: "/admin/job-management";
                isVisible: true;
                translate: true;
                order: 0;
              },
              {
                requiresAdmin: true;
                icon: "mdi:database-outline";
                id: "admin-job-data";
                label: "layout.sidebar.items.adminData";
                to: "/admin/job-management/data";
                isVisible: true;
                translate: true;
                order: 1;
              },
              {
                requiresAdmin: true;
                icon: "mdi:clock-outline";
                id: "admin-job-crons";
                label: "layout.sidebar.items.adminCrons";
                to: "/admin/job-management/crons";
                isVisible: true;
                translate: true;
                order: 2;
              },
            ];
            icon: "mdi:briefcase-outline";
            id: "admin-job-management";
            label: "layout.sidebar.items.adminJobManagement";
            isVisible: true;
            translate: true;
            order: 3;
          },
        ];
        id: "admin";
      },
    ];
    id: "job";
  },
  {
    quickLaunch: {
      icon: "mdi:gamepad-variant-outline";
      label: "layout.appIcons.game";
      to: "/game";
      order: 2;
    };
    menuItems: readonly [
      {
        icon: "mdi:gamepad-variant-outline";
        id: "game";
        label: "layout.sidebar.items.game";
        to: "/game";
        isVisible: true;
        translate: true;
        order: 1;
      },
      {
        children: readonly [
          {
            requiresAdmin: true;
            children: readonly [
              {
                requiresAdmin: true;
                icon: "mdi:tune";
                id: "admin-game-general";
                label: "layout.sidebar.items.adminGeneralSetting";
                to: "/admin/game-management";
                isVisible: true;
                translate: true;
                order: 0;
              },
              {
                requiresAdmin: true;
                icon: "mdi:database-outline";
                id: "admin-game-data";
                label: "layout.sidebar.items.adminData";
                to: "/admin/game-management/data";
                isVisible: true;
                translate: true;
                order: 1;
              },
              {
                requiresAdmin: true;
                icon: "mdi:clock-outline";
                id: "admin-game-crons";
                label: "layout.sidebar.items.adminCrons";
                to: "/admin/game-management/crons";
                isVisible: true;
                translate: true;
                order: 2;
              },
            ];
            icon: "mdi:gamepad-variant-outline";
            id: "admin-game-management";
            label: "layout.sidebar.items.adminGameManagement";
            isVisible: true;
            translate: true;
            order: 6;
          },
        ];
        id: "admin";
      },
    ];
    id: "game";
  },
  {
    menuItems: readonly [
      {
        icon: "mdi:account-box-multiple-outline";
        id: "crm";
        label: "layout.sidebar.items.crm";
        to: "/crm";
        isVisible: true;
        translate: true;
        order: 2;
      },
      {
        children: readonly [
          {
            children: readonly [
              {
                requiresAdmin: true;
                icon: "mdi:account-box-multiple-outline";
                id: "admin-general-crm";
                label: "layout.sidebar.items.adminCrm";
                to: "/admin/crm";
                isVisible: true;
                translate: true;
                order: 3;
              },
            ];
            id: "admin-general";
          },
        ];
        id: "admin";
      },
    ];
    id: "crm";
  },
  {
    quickLaunch: {
      icon: "mdi:shopping-outline";
      label: "layout.appIcons.ecommerce";
      to: "/ecommerce";
      order: 0;
    };
    menuItems: readonly [
      {
        children: readonly [
          {
            icon: "mdi:view-dashboard-outline";
            id: "ecommerce-overview";
            label: "layout.sidebar.items.ecommerceOverview";
            to: "/ecommerce";
            translate: true;
            order: 0;
          },
          {
            icon: "mdi:view-grid-outline";
            id: "ecommerce-catalog";
            label: "layout.sidebar.items.ecommerceCatalog";
            to: "/ecommerce/catalog";
            translate: true;
            order: 1;
          },
          {
            icon: "mdi:cart";
            id: "ecommerce-cart";
            label: "layout.sidebar.items.ecommerceCart";
            to: "/ecommerce/cart";
            translate: true;
            order: 2;
          },
          {
            icon: "mdi:credit-card-check-outline";
            id: "ecommerce-checkout";
            label: "layout.sidebar.items.ecommerceCheckout";
            to: "/ecommerce/checkout";
            translate: true;
            order: 3;
          },
        ];
        icon: "mdi:shopping-outline";
        id: "ecommerce";
        label: "layout.sidebar.items.ecommerce";
        to: "/ecommerce";
        isVisible: true;
        translate: true;
        order: 3;
      },
      {
        children: readonly [
          {
            requiresAdmin: true;
            children: readonly [
              {
                requiresAdmin: true;
                icon: "mdi:tune";
                id: "admin-ecommerce-general";
                label: "layout.sidebar.items.adminGeneralSetting";
                to: "/admin/ecommerce-management";
                isVisible: true;
                translate: true;
                order: 0;
              },
              {
                requiresAdmin: true;
                icon: "mdi:database-outline";
                id: "admin-ecommerce-data";
                label: "layout.sidebar.items.adminData";
                to: "/admin/ecommerce-management/data";
                isVisible: true;
                translate: true;
                order: 1;
              },
              {
                requiresAdmin: true;
                icon: "mdi:clock-outline";
                id: "admin-ecommerce-crons";
                label: "layout.sidebar.items.adminCrons";
                to: "/admin/ecommerce-management/crons";
                isVisible: true;
                translate: true;
                order: 2;
              },
            ];
            icon: "mdi:shopping-outline";
            id: "admin-ecommerce-management";
            label: "layout.sidebar.items.adminEcommerceManagement";
            isVisible: true;
            translate: true;
            order: 4;
          },
        ];
        id: "admin";
      },
    ];
    id: "ecommerce";
  },
  {
    quickLaunch: {
      icon: "mdi:school-outline";
      label: "layout.appIcons.education";
      to: "/education";
      order: 1;
    };
    menuItems: readonly [
      {
        icon: "mdi:school-outline";
        id: "education";
        label: "layout.sidebar.items.education";
        to: "/education";
        isVisible: true;
        translate: true;
        order: 4;
      },
      {
        children: readonly [
          {
            requiresAdmin: true;
            children: readonly [
              {
                requiresAdmin: true;
                icon: "mdi:tune";
                id: "admin-education-general";
                label: "layout.sidebar.items.adminGeneralSetting";
                to: "/admin/education-management";
                isVisible: true;
                translate: true;
                order: 0;
              },
              {
                requiresAdmin: true;
                icon: "mdi:database-outline";
                id: "admin-education-data";
                label: "layout.sidebar.items.adminData";
                to: "/admin/education-management/data";
                isVisible: true;
                translate: true;
                order: 1;
              },
              {
                requiresAdmin: true;
                icon: "mdi:clock-outline";
                id: "admin-education-crons";
                label: "layout.sidebar.items.adminCrons";
                to: "/admin/education-management/crons";
                isVisible: true;
                translate: true;
                order: 2;
              },
            ];
            icon: "mdi:school-outline";
            id: "admin-education-management";
            label: "layout.sidebar.items.adminEducationManagement";
            isVisible: true;
            translate: true;
            order: 5;
          },
        ];
        id: "admin";
      },
    ];
    id: "education";
  },
  {
    menuItems: readonly [
      {
        children: readonly [
          {
            requiresAdmin: true;
            children: readonly [
              {
                requiresAdmin: true;
                icon: "mdi:tune";
                id: "admin-blog-general";
                label: "layout.sidebar.items.adminGeneralSetting";
                to: "/admin/blog";
                isVisible: true;
                translate: true;
                order: 0;
              },
              {
                requiresAdmin: true;
                icon: "mdi:database-outline";
                id: "admin-blog-data";
                label: "layout.sidebar.items.adminData";
                to: "/admin/blog/data";
                isVisible: true;
                translate: true;
                order: 1;
              },
              {
                requiresAdmin: true;
                icon: "mdi:clock-outline";
                id: "admin-blog-crons";
                label: "layout.sidebar.items.adminCrons";
                to: "/admin/blog/crons";
                isVisible: true;
                translate: true;
                order: 2;
              },
            ];
            icon: "mdi:post-outline";
            id: "admin-blog-management";
            label: "layout.sidebar.items.adminBlogManagement";
            isVisible: true;
            translate: true;
            order: 1;
          },
        ];
        id: "admin";
      },
    ];
    id: "blog";
  },
] = [
  {
    id: "messenger",
    menuItems: [
      {
        id: "messenger",
        label: "layout.sidebar.items.messenger",
        icon: "mdi:message-text-outline",
        translate: true,
        to: "/messenger",
        isVisible: false,
        order: 0,
      },
    ],
  },
  {
    id: "job",
    menuItems: [
      {
        id: "jobs",
        label: "layout.sidebar.items.jobs",
        icon: "mdi:briefcase-search",
        translate: true,
        to: "/job",
        isVisible: true,
        order: 0,
      },
      {
        id: "admin",
        children: [
          {
            id: "admin-job-management",
            label: "layout.sidebar.items.adminJobManagement",
            icon: "mdi:briefcase-outline",
            translate: true,
            requiresAdmin: true,
            isVisible: true,
            order: 3,
            children: [
              {
                id: "admin-job-general",
                label: "layout.sidebar.items.adminGeneralSetting",
                icon: "mdi:tune",
                translate: true,
                to: "/admin/job-management",
                requiresAdmin: true,
                isVisible: true,
                order: 0,
              },
              {
                id: "admin-job-data",
                label: "layout.sidebar.items.adminData",
                icon: "mdi:database-outline",
                translate: true,
                to: "/admin/job-management/data",
                requiresAdmin: true,
                isVisible: true,
                order: 1,
              },
              {
                id: "admin-job-crons",
                label: "layout.sidebar.items.adminCrons",
                icon: "mdi:clock-outline",
                translate: true,
                to: "/admin/job-management/crons",
                requiresAdmin: true,
                isVisible: true,
                order: 2,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "game",
    menuItems: [
      {
        id: "game",
        label: "layout.sidebar.items.game",
        icon: "mdi:gamepad-variant-outline",
        translate: true,
        to: "/game",
        isVisible: true,
        order: 1,
      },
      {
        id: "admin",
        children: [
          {
            id: "admin-game-management",
            label: "layout.sidebar.items.adminGameManagement",
            icon: "mdi:gamepad-variant-outline",
            translate: true,
            requiresAdmin: true,
            isVisible: true,
            order: 6,
            children: [
              {
                id: "admin-game-general",
                label: "layout.sidebar.items.adminGeneralSetting",
                icon: "mdi:tune",
                translate: true,
                to: "/admin/game-management",
                requiresAdmin: true,
                isVisible: true,
                order: 0,
              },
              {
                id: "admin-game-data",
                label: "layout.sidebar.items.adminData",
                icon: "mdi:database-outline",
                translate: true,
                to: "/admin/game-management/data",
                requiresAdmin: true,
                isVisible: true,
                order: 1,
              },
              {
                id: "admin-game-crons",
                label: "layout.sidebar.items.adminCrons",
                icon: "mdi:clock-outline",
                translate: true,
                to: "/admin/game-management/crons",
                requiresAdmin: true,
                isVisible: true,
                order: 2,
              },
            ],
          },
        ],
      },
    ],
    quickLaunch: {
      icon: "mdi:gamepad-variant-outline",
      label: "layout.appIcons.game",
      to: "/game",
      order: 2,
    },
  },
  {
    id: "crm",
    menuItems: [
      {
        id: "crm",
        label: "layout.sidebar.items.crm",
        icon: "mdi:account-box-multiple-outline",
        translate: true,
        to: "/crm",
        isVisible: true,
        order: 2,
      },
      {
        id: "admin",
        children: [
          {
            id: "admin-general",
            children: [
              {
                id: "admin-general-crm",
                label: "layout.sidebar.items.adminCrm",
                icon: "mdi:account-box-multiple-outline",
                translate: true,
                to: "/admin/crm",
                requiresAdmin: true,
                isVisible: true,
                order: 3,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ecommerce",
    menuItems: [
      {
        id: "ecommerce",
        label: "layout.sidebar.items.ecommerce",
        icon: "mdi:shopping-outline",
        translate: true,
        to: "/ecommerce",
        isVisible: true,
        order: 3,
        children: [
          {
            id: "ecommerce-overview",
            label: "layout.sidebar.items.ecommerceOverview",
            icon: "mdi:view-dashboard-outline",
            translate: true,
            to: "/ecommerce",
            order: 0,
          },
          {
            id: "ecommerce-catalog",
            label: "layout.sidebar.items.ecommerceCatalog",
            icon: "mdi:view-grid-outline",
            translate: true,
            to: "/ecommerce/catalog",
            order: 1,
          },
          {
            id: "ecommerce-cart",
            label: "layout.sidebar.items.ecommerceCart",
            icon: "mdi:cart",
            translate: true,
            to: "/ecommerce/cart",
            order: 2,
          },
          {
            id: "ecommerce-checkout",
            label: "layout.sidebar.items.ecommerceCheckout",
            icon: "mdi:credit-card-check-outline",
            translate: true,
            to: "/ecommerce/checkout",
            order: 3,
          },
        ],
      },
      {
        id: "admin",
        children: [
          {
            id: "admin-ecommerce-management",
            label: "layout.sidebar.items.adminEcommerceManagement",
            icon: "mdi:shopping-outline",
            translate: true,
            requiresAdmin: true,
            isVisible: true,
            order: 4,
            children: [
              {
                id: "admin-ecommerce-general",
                label: "layout.sidebar.items.adminGeneralSetting",
                icon: "mdi:tune",
                translate: true,
                to: "/admin/ecommerce-management",
                requiresAdmin: true,
                isVisible: true,
                order: 0,
              },
              {
                id: "admin-ecommerce-data",
                label: "layout.sidebar.items.adminData",
                icon: "mdi:database-outline",
                translate: true,
                to: "/admin/ecommerce-management/data",
                requiresAdmin: true,
                isVisible: true,
                order: 1,
              },
              {
                id: "admin-ecommerce-crons",
                label: "layout.sidebar.items.adminCrons",
                icon: "mdi:clock-outline",
                translate: true,
                to: "/admin/ecommerce-management/crons",
                requiresAdmin: true,
                isVisible: true,
                order: 2,
              },
            ],
          },
        ],
      },
    ],
    quickLaunch: {
      icon: "mdi:shopping-outline",
      label: "layout.appIcons.ecommerce",
      to: "/ecommerce",
      order: 0,
    },
  },
  {
    id: "education",
    menuItems: [
      {
        id: "education",
        label: "layout.sidebar.items.education",
        icon: "mdi:school-outline",
        translate: true,
        to: "/education",
        isVisible: true,
        order: 4,
      },
      {
        id: "admin",
        children: [
          {
            id: "admin-education-management",
            label: "layout.sidebar.items.adminEducationManagement",
            icon: "mdi:school-outline",
            translate: true,
            requiresAdmin: true,
            isVisible: true,
            order: 5,
            children: [
              {
                id: "admin-education-general",
                label: "layout.sidebar.items.adminGeneralSetting",
                icon: "mdi:tune",
                translate: true,
                to: "/admin/education-management",
                requiresAdmin: true,
                isVisible: true,
                order: 0,
              },
              {
                id: "admin-education-data",
                label: "layout.sidebar.items.adminData",
                icon: "mdi:database-outline",
                translate: true,
                to: "/admin/education-management/data",
                requiresAdmin: true,
                isVisible: true,
                order: 1,
              },
              {
                id: "admin-education-crons",
                label: "layout.sidebar.items.adminCrons",
                icon: "mdi:clock-outline",
                translate: true,
                to: "/admin/education-management/crons",
                requiresAdmin: true,
                isVisible: true,
                order: 2,
              },
            ],
          },
        ],
      },
    ],
    quickLaunch: {
      icon: "mdi:school-outline",
      label: "layout.appIcons.education",
      to: "/education",
      order: 1,
    },
  },
  {
    id: "blog",
    menuItems: [
      {
        id: "admin",
        children: [
          {
            id: "admin-blog-management",
            label: "layout.sidebar.items.adminBlogManagement",
            icon: "mdi:post-outline",
            translate: true,
            requiresAdmin: true,
            isVisible: true,
            order: 1,
            children: [
              {
                id: "admin-blog-general",
                label: "layout.sidebar.items.adminGeneralSetting",
                icon: "mdi:tune",
                translate: true,
                to: "/admin/blog",
                requiresAdmin: true,
                isVisible: true,
                order: 0,
              },
              {
                id: "admin-blog-data",
                label: "layout.sidebar.items.adminData",
                icon: "mdi:database-outline",
                translate: true,
                to: "/admin/blog/data",
                requiresAdmin: true,
                isVisible: true,
                order: 1,
              },
              {
                id: "admin-blog-crons",
                label: "layout.sidebar.items.adminCrons",
                icon: "mdi:clock-outline",
                translate: true,
                to: "/admin/blog/crons",
                requiresAdmin: true,
                isVisible: true,
                order: 2,
              },
            ],
          },
        ],
      },
    ],
  },
] as const;

export const pluginRegistryMap = new Map(pluginRegistry.map((entry) => [entry.id, entry] as const));

export function getPluginRegistry(): readonly PluginRegistryEntry[] {
  return pluginRegistry;
}

export function getAllPluginIds(): string[] {
  return pluginRegistry.map((entry) => entry.id);
}

export function getPluginMenuBlueprints(selectedPluginIds: Iterable<string>): MenuBlueprint[] {
  let merged: MenuBlueprint[] = [];
  const seen = new Set<string>();

  for (const pluginId of selectedPluginIds ?? []) {
    const normalized = pluginId.trim();
    if (!normalized || seen.has(normalized)) {
      continue;
    }

    const registryEntry = pluginRegistryMap.get(normalized);
    if (!registryEntry?.menuItems.length) {
      seen.add(normalized);
      continue;
    }

    merged = mergeMenuBlueprints(merged, registryEntry.menuItems);
    seen.add(normalized);
  }

  return merged;
}

export function buildMenusForPlugins(selectedPluginIds: Iterable<string>): SiteMenuItem[] {
  return convertBlueprintsToMenus(getPluginMenuBlueprints(selectedPluginIds));
}

export interface PluginQuickLaunchEntry {
  pluginId: string;
  icon: string;
  label: string;
  to: string;
  order: number;
}

export function getPluginQuickLaunchEntries(
  selectedPluginIds?: Iterable<string>,
): PluginQuickLaunchEntry[] {
  const allowed = selectedPluginIds
    ? new Set(
        Array.from(selectedPluginIds)
          .filter((value): value is string => typeof value === "string")
          .map((value) => value.trim())
          .filter(Boolean),
      )
    : null;

  const entries: PluginQuickLaunchEntry[] = [];

  for (const registryEntry of pluginRegistry) {
    if (allowed && !allowed.has(registryEntry.id)) {
      continue;
    }

    const quickLaunch = registryEntry.quickLaunch;
    if (!quickLaunch) {
      continue;
    }

    const definitions = Array.isArray(quickLaunch) ? quickLaunch : [quickLaunch];

    for (const definition of definitions) {
      entries.push({
        pluginId: registryEntry.id,
        icon: definition.icon,
        label: definition.label,
        to: definition.to,
        order: definition.order ?? 0,
      });
    }
  }

  return entries.sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
}
