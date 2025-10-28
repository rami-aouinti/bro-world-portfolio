declare module "#app" {
  interface NuxtApp {
    $smoothScroll?: import("~/types/smooth-scroll").SmoothScrollController;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $smoothScroll?: import("~/types/smooth-scroll").SmoothScrollController;
  }
}

export {};
