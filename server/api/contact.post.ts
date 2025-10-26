import { defineEventHandler, readBody, createError } from "h3";
import { z } from "zod";
import {
  MailerConfigurationError,
  MailerDeliveryError,
  sendContactEmail,
} from "~/server/utils/mailer";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email: z.string().trim().email("A valid e-mail is required."),
  message: z.string().trim().min(1, "Message is required."),
});

export default defineEventHandler(async (event) => {
  const payload = await readBody(event);
  const { name, email, message } = contactSchema.parse(payload);

  try {
    await sendContactEmail({ name, email, message });
    return { ok: true };
  } catch (error) {
    if (error instanceof MailerConfigurationError) {
      throw createError({
        statusCode: 503,
        statusMessage: "Email service is currently unavailable.",
      });
    }

    if (error instanceof MailerDeliveryError) {
      console.error("[contact] Failed to send email", error);
      throw createError({
        statusCode: 502,
        statusMessage: "We couldn't send your message. Please try again later.",
      });
    }

    throw error;
  }
});
