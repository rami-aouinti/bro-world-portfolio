import { defineEventHandler, readBody, createError } from "h3";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { assertCsrf } from "~/server/utils/session";
import { createAdminUser, toPublicUser } from "~/server/utils/user-store";

const createAdminSchema = z.object({
  email: z.string().email("Adresse e-mail invalide."),
  name: z.string().min(1, "Le nom est requis."),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
});

export default defineEventHandler(async (event) => {
  await assertCsrf(event);

  const payload = await readBody(event);
  const { email, name, password } = createAdminSchema.parse(payload);

  try {
    const user = await createAdminUser({ email, name, password });
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
