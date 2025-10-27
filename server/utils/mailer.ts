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
    "---------------------------",
    `Name   : ${payload.name}`,
    `Email  : ${payload.email}`,
    "---------------------------",
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
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>New contact form message</title>
  </head>
  <body style="margin: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #0f172a;">
    <div style="max-width: 560px; margin: 32px auto; padding: 0 16px;">
      <div style="background: linear-gradient(135deg, #1e3a8a, #0ea5e9); border-radius: 16px 16px 0 0; padding: 24px; color: #f8fafc;">
        <p style="margin: 0; font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.8;">Portfolio contact</p>
        <h1 style="margin: 8px 0 0; font-size: 24px; font-weight: 600;">New contact form message</h1>
      </div>
      <div style="background-color: #ffffff; border-radius: 0 0 16px 16px; box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12); overflow: hidden;">
        <div style="padding: 24px 24px 8px;">
          <div style="margin-bottom: 16px;">
            <p style="margin: 0 0 4px; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #64748b;">From</p>
            <p style="margin: 0; font-size: 16px; font-weight: 600;">${escapeHtml(payload.name)}</p>
            <a href="mailto:${encodeURIComponent(payload.email)}" style="display: inline-block; margin-top: 4px; font-size: 14px; color: #0ea5e9; text-decoration: none;">${escapeHtml(payload.email)}</a>
          </div>
        </div>
        <div style="padding: 0 24px 24px;">
          <p style="margin: 0 0 8px; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #64748b;">Message</p>
          <div style="padding: 16px; border-radius: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0;">
            <p style="margin: 0; white-space: pre-wrap; font-size: 15px; color: #0f172a;">${escapeHtml(payload.message)}</p>
          </div>
        </div>
        <div style="padding: 16px 24px; background-color: #0f172a; color: #e2e8f0;">
          <p style="margin: 0; font-size: 13px;">Reply directly to this email to continue the conversation.</p>
        </div>
      </div>
    </div>
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

function buildFromDisplayName(name: string) {
  const sanitized = name.replace(/[\r\n"<>]/g, "").trim();
  return sanitized ? `${sanitized} via Contact Form` : "Contact Form";
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

  const displayFromName = buildFromDisplayName(payload.name);
  const requestPayload = {
    from: `${displayFromName} <${config.from}>`,
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
