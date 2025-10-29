export default defineNuxtPlugin((nuxtApp) => {
  const isAppReady = useState<boolean>("app:ready", () => false);
  const isRouteLoading = useState<boolean>("app:route-loading", () => false);
  let routeLoaderTimeout: ReturnType<typeof window.setTimeout> | null = null;

  function showRouteLoader() {
    if (!isAppReady.value) {
      return;
    }

    if (routeLoaderTimeout !== null) {
      return;
    }

    routeLoaderTimeout = window.setTimeout(() => {
      isRouteLoading.value = true;
    }, 150);
  }

  function hideRouteLoader() {
    if (routeLoaderTimeout !== null) {
      window.clearTimeout(routeLoaderTimeout);
      routeLoaderTimeout = null;
    }

    if (!isRouteLoading.value) {
      return;
    }

    window.requestAnimationFrame(() => {
      isRouteLoading.value = false;
    });
  }

  nuxtApp.hook("app:mounted", () => {
    window.requestAnimationFrame(() => {
      isAppReady.value = true;
    });
  });

  nuxtApp.hook("page:start", showRouteLoader);
  nuxtApp.hook("page:finish", hideRouteLoader);
  nuxtApp.hook("page:error", hideRouteLoader);
});
