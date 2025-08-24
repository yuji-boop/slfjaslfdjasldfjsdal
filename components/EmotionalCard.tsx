import React from 'react';

export type EmotionalCardData = {
  type: 'quote' | 'story' | 'sound' | 'quiz' | 'check-in';
  text?: string;
  title?: string;
  description?: string;
  icon?: string;
  question?: string;
  options?: string[];
};

interface EmotionalCardProps {
  card: EmotionalCardData;
}

const icons: { [key: string]: string } = {
  sound: '🎧',
  quote: '❝',
  story: '📖',
  quiz: '🤔',
  'check-in': '😊',
};

const EmotionalCard: React.FC<EmotionalCardProps> = ({ card }) => {
  const icon = card.icon || icons[card.type] || '✨';

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 w-full max-w-md mx-auto text-center animate-fade-in">
      <div className="text-5xl mb-4">{icon}</div>
      {card.title && <h3 className="text-xl font-bold text-slate-800 mb-2">{card.title}</h3>}
      {card.question && <p className="text-lg font-semibold text-slate-700 mb-3">{card.question}</p>}
      {card.text && <p className="text-lg text-slate-600 italic">“{card.text}”</p>}
      {card.description && <p className="text-md text-slate-500">{card.description}</p>}
      {card.options && (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {card.options.map((opt) => (
            <span key={opt} className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
              {opt}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmotionalCard;