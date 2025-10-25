export default defineNuxtRouteMiddleware(async () => {
  const requestFetch = import.meta.server ? useRequestFetch() : $fetch

  try {
    const session = (await requestFetch("/api/auth/session")) as { user: { role: string } | null };
    if (!session?.user || session.user.role !== "admin") {
      return navigateTo("/admin/login");
    }
  } catch (error) {
    return navigateTo("/admin/login");
  }
});
