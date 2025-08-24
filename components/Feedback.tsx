import React, { useState } from 'react';
import { Button } from './ui/Button';

interface FeedbackProps {
  onFeedbackSubmit: (feedback: string) => void;
}

const feedbackOptions = [
  { label: "Spot On! 딱 내 취향저격", value: "perfect" },
  { label: "오, 괜찮은데? 내 취향", value: "good" },
  { label: "음... 이건 타인의 취향", value: "bad" },
];

const Feedback: React.FC<FeedbackProps> = ({ onFeedbackSubmit }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleClick = (feedback: string) => {
    onFeedbackSubmit(feedback);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
        <p className="font-semibold text-green-800">소중한 피드백 감사합니다! 다음 추천에 꼭 반영할게요. 😊</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200 text-center">
      <h3 className="text-xl font-bold text-slate-800 mb-2">이 여행, 어떠셨나요?</h3>
      <p className="text-slate-600 mb-6">피드백을 남겨주시면 다음 추천이 더욱 정교해져요.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        {feedbackOptions.map(opt => (
          <Button key={opt.value} onClick={() => handleClick(opt.value)} variant="outline" size="lg" className="flex-1">
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Feedback;