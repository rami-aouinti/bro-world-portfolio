import { useAuthSession } from "~/stores/auth-session";

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthSession();

  await auth.initialize();

  if (auth.isAuthenticated.value) {
    return;
  }

  if (to.path && to.path !== "/admin/login") {
    auth.setRedirect(to.fullPath ?? to.path);
  }

  return navigateTo("/admin/login");
});
