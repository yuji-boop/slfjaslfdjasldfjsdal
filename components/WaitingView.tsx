import React, { useState, useEffect } from 'react';
import EmotionalCard, { EmotionalCardData } from './EmotionalCard';

const emotionalCards: EmotionalCardData[] = [
  { type: 'story', text: '이 골목, 내가 매일 산책하던 길이야. 곧 당신에게도 익숙해지겠죠?' },
  { type: 'sound', title: '여행지의 소리', description: '잠시 눈을 감고 다가올 여행지의 소리를 상상해보세요.', icon: '🎧' },
  { type: 'quote', text: '여행은 속도가 아니라 방향이다. 당신의 방향은 어디인가요?' },
  { type: 'check-in', question: '지금 당신의 여행 기분은 어떤가요?', options: ['설렘', '평온', '모험'] },
  { type: 'quiz', question: 'Tastetrip의 슬로건은 무엇일까요?', options: ['내 취향을 완성하는 여행', '가장 저렴한 여행', '가장 빠른 여행'] },
];

interface WaitingViewProps {
  isLoading: boolean;
  onFinish: () => void;
  destination: string;
  isNeo?: boolean;
}

const WaitingView: React.FC<WaitingViewProps> = ({ isLoading, onFinish, destination, isNeo = false }) => {
  const [progress, setProgress] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  
  const MIN_WAIT_SECONDS = 15;

  useEffect(() => {
    // Progress bar timer
    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + 100 / MIN_WAIT_SECONDS, 100));
    }, 1000);

    // Emotional card cycle timer
    const cardInterval = setInterval(() => {
        setCardIndex(i => (i + 1) % emotionalCards.length);
    }, 5000); // Change card every 5 seconds

    return () => {
      clearInterval(progressInterval);
      clearInterval(cardInterval);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100 && !isLoading) {
      onFinish();
    }
  }, [progress, isLoading, onFinish]);

  const getStatusMessage = () => {
      if (progress < 30) return `현지 전문가와 연결 중...`;
      if (progress < 70) return `당신의 취향을 분석하여 ${destination} 전문가에게 전달하고 있어요.`;
      if (progress < 100) return `최적의 코스를 구성하고 있습니다. 거의 다 됐어요!`;
      if (isLoading) return `마지막 감성을 더하는 중...✨`;
      return `당신만을 위한 여행이 완성되었어요!`;
  }

  return (
    <div className={`${isNeo ? 'flex flex-col items-center justify-center text-center p-8 min-h-[50vh] rounded-3xl bg-[radial-gradient(120%_80%_at_10%_10%,#E0F2FF_0%,transparent_60%),radial-gradient(120%_80%_at_90%_90%,#F5ECFF_0%,transparent_55%)] backdrop-blur-xl border border-white/30 shadow-[0_10px_30px_rgba(59,130,246,0.15)]' : 'flex flex-col items-center justify-center text-center p-8 min-h-[50vh] rounded-2xl bg-white border border-slate-200 shadow-sm'}` }>
      <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-4">
        {getStatusMessage()}
      </h2>
      <p className="text-ink-500 mb-8 max-w-lg">
        Tastetrip은 단순히 빠른 결과보다, 당신의 여행에 대한 기대를 높이는 '기다림의 시간'을 소중히 여깁니다. 잠시만 기다려주시면, 최고의 여행을 선물해 드릴게요.
      </p>
      
      <div className="w-full max-w-md mb-8">
        <div className="w-full bg-lightBlue/60 rounded-full h-2.5">
          <div 
            className={`${isNeo ? 'bg-gradient-to-r from-[#3B6AFF] via-[#4FA8FF] to-[#6FD6FF] shadow-[0_6px_20px_rgba(63,106,255,0.35)]' : 'bg-gradient-to-r from-[#3B6AFF] to-[#6FD6FF]'} h-2.5 rounded-full transition-all duration-1000 ease-linear`} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <EmotionalCard card={emotionalCards[cardIndex]} />
    </div>
  );
};

export default WaitingView;