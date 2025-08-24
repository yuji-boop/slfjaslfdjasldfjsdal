export interface DestinationInfo {
  [key: string]: string | number;
  name: string;
  category: '명소' | '식당' | '숙소' | '활동';
  location: string;
  description: string;
}

export interface ItineraryDay {
  day: number;
  theme: string;
  activities: {
    time: string;
    activity: string;
    description: string;
    location: string;
  }[];
}

export interface ItineraryPlan {
  tripTitle: string;
  tripSlogan: string;
  destination: string;
  dailyPlans: ItineraryDay[];
}