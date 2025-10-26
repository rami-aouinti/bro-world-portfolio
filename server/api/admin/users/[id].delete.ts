import { defineEventHandler, createError, getRouterParam } from "h3";
import { assertCsrf } from "~/server/utils/session";
import { deleteAdminUser, toPublicUser } from "~/server/utils/user-store";

export default defineEventHandler(async (event) => {
  await assertCsrf(event);

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Identifiant requis." });
  }

  const user = await deleteAdminUser(id);
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: "Administrateur introuvable." });
  }

  return { user: toPublicUser(user) };
});
