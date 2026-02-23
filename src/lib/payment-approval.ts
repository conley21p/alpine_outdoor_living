import { createHmac, timingSafeEqual } from "crypto";
import { getServerConfig } from "@/lib/config";

const buildDigest = (token: string, action: "approve" | "deny") => {
  const { paymentApprovalWebhookSecret } = getServerConfig();
  if (!paymentApprovalWebhookSecret) {
    return "";
  }
  return createHmac("sha256", paymentApprovalWebhookSecret)
    .update(`${token}:${action}`)
    .digest("hex");
};

export const createPaymentApprovalSignature = (
  token: string,
  action: "approve" | "deny",
) => buildDigest(token, action);

export const verifyPaymentApprovalSignature = (
  token: string,
  action: "approve" | "deny",
  signature?: string,
) => {
  const { paymentApprovalWebhookSecret } = getServerConfig();
  if (!paymentApprovalWebhookSecret) {
    return true;
  }
  if (!signature) {
    return false;
  }
  const expected = buildDigest(token, action);
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }
  return timingSafeEqual(expectedBuffer, providedBuffer);
};
