//types/Calendar.ts

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  location: string;
  event_type: string;
  status: string;
  timezone: string;
  organizer_id: string;
  image_link?: string;
};

export type EventFormData = {
  id: string;
  title: string;
  description: string;
  start_time: Date;
  end_time: Date;
  is_all_day: boolean;
  location: string;
  event_type: string;
  status: string;
  timezone: string;
};