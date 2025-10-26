import { defineEventHandler, readBody, createError, getRouterParam } from "h3";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { assertCsrf } from "~/server/utils/session";
import { updateAdminUser, toPublicUser } from "~/server/utils/user-store";

const updateAdminSchema = z
  .object({
    email: z.string().email("Adresse e-mail invalide.").optional(),
    name: z.string().min(1, "Le nom est requis.").optional(),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères.").optional(),
  })
  .refine(
    (value) => Object.values(value).some((entry) => typeof entry === "string" && entry.trim()),
    {
      message: "Au moins un champ doit être fourni.",
    },
  );

export default defineEventHandler(async (event) => {
  await assertCsrf(event);

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Identifiant requis." });
  }

  const payload = await readBody(event);
  const { email, name, password } = updateAdminSchema.parse(payload);

  try {
    const user = await updateAdminUser(id, { email, name, password });
    if (!user) {
      throw createError({ statusCode: 404, statusMessage: "Administrateur introuvable." });
    }

    return { user: toPublicUser(user) };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw createError({
        statusCode: 409,
        statusMessage: "Un administrateur avec cette adresse e-mail existe déjà.",
      });
    }
    throw error;
  }
});
