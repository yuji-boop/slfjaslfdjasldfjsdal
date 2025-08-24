import React from 'react';

interface BottomNavProps {
  active: 'chatting' | 'form' | 'waiting' | 'result' | 'admin';
  onGoHome: () => void;
  onStartForm: () => void;
  onOpenAdmin: () => void;
}

const IconChat = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-colors ${active ? 'text-white' : 'text-white/70'}`}>
    <rect x="3" y="4" width="18" height="14" rx="4" fill="currentColor"/>
    <path d="M9 18 L9 22 L13 18 Z" fill="currentColor"/>
  </svg>
);

const IconGear = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-colors ${active ? 'text-white' : 'text-white/70'}`}>
    <path d="M19.14 12.94a7.79 7.79 0 0 0 .06-1l1.71-1.33-1.62-2.8-2 .37a8 8 0 0 0-.86-.5l-.31-2h-3.24l-.31 2c-.29.14-.58.31-.86.5l-2-.37-1.62 2.8 1.71 1.33a7.79 7.79 0 0 0-.06 1l-1.71 1.33 1.62 2.8 2-.37c.28.19.57.36.86.5l.31 2h3.24l.31-2c.29-.14.58-.31.86-.5l2 .37 1.62-2.8-1.71-1.33ZM12 15.5A3.5 3.5 0 1 1 15.5 12 3.51 3.51 0 0 1 12 15.5Z" fill="currentColor"/>
  </svg>
);

export const BottomNav: React.FC<BottomNavProps> = ({ active, onGoHome, onStartForm, onOpenAdmin }) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50">
      <div className="mx-auto max-w-4xl px-4 pb-3">
        <div className="relative h-20 rounded-t-3xl bg-[#3B6AFF] shadow-[0_-10px_40px_rgba(59,106,255,0.35)]">
          {/* Nav icons */}
          <div className="absolute inset-0 flex items-end justify-between px-8 pb-4">
            <button onClick={onGoHome} className="p-2">
              <IconChat active={active === 'chatting'} />
            </button>
            <button onClick={onOpenAdmin} className="p-2">
              <IconGear active={active === 'admin'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;



