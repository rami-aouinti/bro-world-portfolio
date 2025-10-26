import { useRuntimeConfig } from "#imports";

export class MailerConfigurationError extends Error {
  constructor(message = "Email service is not configured.") {
    super(message);
    this.name = "MailerConfigurationError";
  }
}

export class MailerDeliveryError extends Error {
  constructor(
    message: string,
    public cause?: unknown,
  ) {
    super(message);
    this.name = "MailerDeliveryError";
  }
}

type ResendConfig = {
  apiKey?: string | null;
  from?: string | null;
  to?: string | null;
};

type RuntimeMailerConfig = {
  mailer?: {
    resend?: ResendConfig;
  };
};

type ContactEmailPayload = {
  name: string;
  email: string;
  message: string;
};

function getMailerConfig(): RuntimeMailerConfig {
  try {
    return useRuntimeConfig();
  } catch {
    return {};
  }
}

function getResendConfig(): Required<ResendConfig> {
  const config = getMailerConfig();
  const resendConfig = config.mailer?.resend ?? {};

  const apiKey = typeof resendConfig.apiKey === "string" ? resendConfig.apiKey.trim() : "";
  const from = typeof resendConfig.from === "string" ? resendConfig.from.trim() : "";
  const to = typeof resendConfig.to === "string" ? resendConfig.to.trim() : "";

  if (!apiKey || !from || !to) {
    throw new MailerConfigurationError();
  }

  return { apiKey, from, to };
}

function buildPlainTextMessage(payload: ContactEmailPayload) {
  const lines = [
    `New contact message received`,
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    "",
    "Message:",
    payload.message,
  ];

  return lines.join("\n");
}

function buildHtmlMessage(payload: ContactEmailPayload) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>New contact form message</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.5;">
    <h1 style="font-size: 20px; margin-bottom: 16px;">New contact form message</h1>
    <p style="margin: 0 0 8px;"><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    <p style="margin: 16px 0 8px;"><strong>Message:</strong></p>
    <p style="white-space: pre-wrap; margin: 0;">${escapeHtml(payload.message)}</p>
  </body>
</html>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactEmail(payload: ContactEmailPayload) {
  const config = getResendConfig();
  const recipients = config.to
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    throw new MailerConfigurationError("No destination address configured.");
  }

  const requestPayload = {
    from: config.from,
    to: recipients,
    reply_to: payload.email,
    subject: `New contact from ${payload.name}`,
    text: buildPlainTextMessage(payload),
    html: buildHtmlMessage(payload),
  } as const;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestPayload),
  });

  if (!response.ok) {
    let errorMessage = `Resend API responded with status ${response.status}`;
    let errorBody: unknown;

    try {
      errorBody = await response.json();
    } catch (parseError) {
      errorBody = parseError instanceof Error ? parseError.message : null;
    }

    if (errorBody && typeof errorBody === "object" && "error" in errorBody) {
      const nestedError = (errorBody as { error?: { message?: unknown } }).error;
      if (nestedError && typeof nestedError.message === "string") {
        errorMessage = nestedError.message;
      }
    } else if (typeof errorBody === "string" && errorBody.trim()) {
      errorMessage = errorBody;
    }

    throw new MailerDeliveryError(errorMessage);
  }
}
