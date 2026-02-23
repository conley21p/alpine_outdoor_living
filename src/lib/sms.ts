import twilio from "twilio";
import { getServerConfig } from "@/lib/config";

export const sendPaymentAlertSms = async (message: string) => {
  const server = getServerConfig();
  if (
    !server.paymentNotifyPhone ||
    !server.twilio.accountSid ||
    !server.twilio.authToken ||
    !server.twilio.fromNumber
  ) {
    return null;
  }

  const client = twilio(server.twilio.accountSid, server.twilio.authToken);
  const response = await client.messages.create({
    body: message,
    from: server.twilio.fromNumber,
    to: server.paymentNotifyPhone,
  });

  return response.sid;
};
