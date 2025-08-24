import React from 'react';
import { ItineraryDay } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface ItineraryCardProps {
  dayPlan: ItineraryDay;
  neo?: boolean;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ dayPlan, neo = false }) => {
  return (
    <Card className={`overflow-hidden ${neo ? 'rounded-3xl' : 'rounded-2xl'}`}>
      <CardHeader className={`${neo ? 'bg-white/70 backdrop-blur-md border-b border-white/50' : 'bg-gradient-to-r from-orange-50 to-amber-100'}`}>
        <div className="flex items-baseline space-x-4">
          <span className={`text-4xl font-black tracking-tighter ${neo ? 'bg-gradient-to-r from-[#3B6AFF] to-[#6FD6FF] bg-clip-text text-transparent drop-shadow-[0_6px_16px_rgba(59,106,255,0.25)]' : 'text-orange-600'}`}>{`Day ${dayPlan.day}`}</span>
          <CardTitle className={`text-2xl font-bold tracking-tight ${neo ? 'text-navy' : 'text-slate-700'}`}>{dayPlan.theme}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className={`relative ml-6 ${neo ? 'border-l-2 border-white/40' : 'border-l-2 border-slate-200'}`}>
          {dayPlan.activities.map((activity, index) => (
            <div key={index} className="mb-8 relative">
              <div className={`absolute -left-[34px] top-0 flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center font-bold border-4 border-white ${neo ? 'bg-white/70 backdrop-blur-md text-navy shadow-[0_6px_16px_rgba(59,106,255,0.18)]' : 'bg-slate-100 text-slate-600'}`}>
                {activity.time}
              </div>
              <div className="ml-8">
                <h4 className={`font-semibold text-lg ${neo ? 'text-navy' : 'text-slate-800'}`}>{activity.activity}</h4>
                <p className="text-sm text-slate-500 mt-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {activity.location}
                </p>
                <p className={`mt-2 p-3 rounded-md border ${neo ? 'text-slate-700 bg-white/70 backdrop-blur-md border-white/50 rounded-xl' : 'text-slate-600 bg-slate-50 border-slate-200'}`}>{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ItineraryCard;