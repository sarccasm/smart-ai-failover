import { AiResponse } from "./types";

export async function sendToWebhook(
  prompt: string,
  forceError: boolean
): Promise<AiResponse> {
  const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL;
  if (!webhookUrl) throw new Error("NEXT_PUBLIC_WEBHOOK_URL is not set");

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, force_error: forceError }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Webhook error ${res.status}: ${text}`);
  }

  return res.json() as Promise<AiResponse>;
}
