import { google } from "googleapis";
import { getServerConfig } from "@/lib/config";

export interface CalendarEventInput {
  title: string;
  startTime: string;
  endTime?: string;
  description?: string;
  address?: string;
  assignedToCalendarId?: string;
}

const hasCalendarConfig = () => {
  const { google: googleConfig } = getServerConfig();
  return Boolean(
    googleConfig.serviceAccountEmail &&
      googleConfig.serviceAccountPrivateKey &&
      googleConfig.calendarOwnerId,
  );
};

export const createGoogleCalendarEvent = async (
  input: CalendarEventInput,
): Promise<string | null> => {
  if (!hasCalendarConfig()) {
    return null;
  }

  const { google: googleConfig } = getServerConfig();
  const auth = new google.auth.JWT({
    email: googleConfig.serviceAccountEmail,
    key: googleConfig.serviceAccountPrivateKey,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  const calendar = google.calendar({ version: "v3", auth });
  const calendarId =
    input.assignedToCalendarId || googleConfig.calendarOwnerId || "primary";
  const response = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: input.title,
      description: input.description,
      location: input.address,
      start: { dateTime: input.startTime },
      end: {
        dateTime: input.endTime || new Date(new Date(input.startTime).getTime() + 60 * 60 * 1000).toISOString(),
      },
    },
  });

  return response.data.id ?? null;
};
