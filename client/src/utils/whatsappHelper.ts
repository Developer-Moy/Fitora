/**
 * Reusable WhatsApp deep-link builder for FITORA.
 *
 * Pure utility — no React, no UI. Returns a complete `https://wa.me/...` URL
 * with the default FITORA inquiry message pre-filled and URL-encoded.
 */
const DEFAULT_WHATSAPP_MESSAGE =
  "Hi FITORA, I want to inquire about membership and personal training.";

/**
 * Build a `https://wa.me/<phone>?text=<message>` link.
 * Non-digit characters (spaces, +, dashes) are stripped so display-formatted
 * numbers such as "+880 1700-000000" produce an international wa.me URL.
 */
export function getWhatsAppUrl(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(
    DEFAULT_WHATSAPP_MESSAGE,
  )}`;
}