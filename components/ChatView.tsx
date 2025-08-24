import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/Button';

type TravelPreferences = {
  duration?: string;
  date?: string;
  purpose?: string[];
  budget?: string;
  transportation?: string;
  ratio?: number;
  spotTypes?: string[];
};

type Message = {
  from: 'user' | 'tpin';
  text: string;
};

const ChatBubble: React.FC<{ from: 'user' | 'tpin'; text: string; showAvatar?: boolean }> = ({ from, text, showAvatar }) => (
  <div className={`w-full flex items-end ${from === 'user' ? 'justify-end' : 'justify-start'} my-2`}>
    <div className="w-8 mr-2">
      {from === 'tpin' && showAvatar && (
        <img
          src="/tpin.png"
          alt="Tpin"
          className="w-8 h-8 rounded-full"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.onerror = null;
            target.src = 'https://i.imgur.com/3JkY2Sj.png';
          }}
        />
      )}
    </div>
    <div
      className={`${from === 'user' ? 'bg-gradient-to-r from-[#3B6AFF] to-[#6FD6FF] text-white' : 'bg-white text-navy'} max-w-[80%] rounded-2xl px-4 py-3 shadow-sm border ${from === 'user' ? 'border-transparent' : 'border-slate-200'} whitespace-pre-wrap`}>
      {text}
    </div>
  </div>
);

const ChoiceButton: React.FC<{ onClick: () => void; selected?: boolean; children: React.ReactNode, className?: string }> = ({ onClick, selected, children, className }) => (
  <Button
    onClick={onClick}
    variant={selected ? 'default' : 'outline'}
    className={`h-14 px-8 m-1.5 transition-all duration-200 text-base ${
      selected
        ? 'bg-gradient-to-r from-[#3B6AFF] to-[#6FD6FF] text-white shadow-lg scale-105'
        : 'bg-white text-navy border border-slate-300 hover:bg-slate-50'
    } ${className}`}
  >
    {children}
  </Button>
);

type Question = { key: keyof TravelPreferences | 'summary'; text: string; options?: string[] };
const questions: { [key: number]: Question } = {
  2: { key: 'duration', text: '여행일정은 어떻게 되나요?' },
  3: { key: 'date', text: '여행 날짜는 언젠가요?' },
  4: { key: 'purpose', text: '이번 여행의 목적은 무엇인가요? (중복 선택 가능)', options: ['힐링', '먹방', '호캉스', '액티비티', '쇼핑', '문화/예술'] },
  5: { key: 'budget', text: '예산은 어느 정도로 생각하시나요?', options: ['FLEX', 'BASIC', '가성비'] },
  6: { key: 'transportation', text: '어떤 이동 수단을 이용하실 건가요?', options: ['자차', '대중교통', '렌트카'] },
  7: { key: 'ratio', text: '현지인 맛집과 관광지 비율을 어떻게 할까요?' },
  8: { key: 'spotTypes', text: '어떤 종류의 장소를 방문하고 싶으세요? (중복 선택 가능)', options: ['자연', '도시', '역사/유적', '체험/액티비티', '맛집/카페'] },
  9: { key: 'summary', text: '좋아요! 모든 정보를 모았어요. 선택하신 내용을 바탕으로 최고의 여행 코스를 추천해드릴게요!' },
};

const ChatView: React.FC = () => {
  const [step, setStep] = useState(2);
  const [stepHistory, setStepHistory] = useState<number[]>([2]);
  const [preferences, setPreferences] = useState<TravelPreferences>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const initialMessagesSent = useRef(false);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [durationError, setDurationError] = useState<boolean>(false);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDurationError(diffDays > 4 || diffDays < 0);
    } else {
      setDurationError(false);
    }
  }, [startDate, endDate]);

  const addBotMessage = (text: string, delay = 700) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(m => [...m, { from: 'tpin', text }]);
      setIsTyping(false);
    }, delay);
  };

  useEffect(() => {
    if (!initialMessagesSent.current) {
      initialMessagesSent.current = true;
      setMessages([{ from: 'tpin', text: '안녕하세요! 당신의 취향을 완성하는 여행을 도와줄 Tpin (티핀)이예요!' }]);
      addBotMessage(questions[2].text, 1000);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!startDate) setStartDate(getTodayDate());
  }, [startDate]);

  const handleBack = () => {
    if (stepHistory.length <= 1) return;
    const newStepHistory = [...stepHistory];
    const currentStep = newStepHistory.pop();
    const prevStep = newStepHistory[newStepHistory.length - 1];
    setStep(prevStep);
    setStepHistory(newStepHistory);
    const lastUserMessageIndex = messages.map(m => m.from).lastIndexOf('user');
    if (lastUserMessageIndex !== -1) setMessages(messages.slice(0, lastUserMessageIndex));
    const keyToReset = questions[currentStep as number]?.key;
    if (keyToReset) {
      const next = { ...preferences } as any;
      delete next[keyToReset];
      setPreferences(next);
    }
  };

  const handleSingleChoice = (key: keyof TravelPreferences, value: string | number) => {
    setPreferences(prev => ({ ...prev, [key]: value as any }));
    setMessages(m => [...m, { from: 'user', text: String(value) }]);
    const nextStep = Math.floor(step) + 1;
    setStep(nextStep);
    setStepHistory([...stepHistory, nextStep]);
    const nextQuestion = questions[nextStep];
    if (nextQuestion && nextQuestion.key !== 'summary') addBotMessage(nextQuestion.text, 300);
  };

  const handleMultiChoice = (key: keyof TravelPreferences, value: string) => {
    const currentValues = (preferences[key] as string[]) || [];
    const newValues = currentValues.includes(value) ? currentValues.filter(v => v !== value) : [...currentValues, value];
    setPreferences(prev => ({ ...prev, [key]: newValues }));
  };

  const renderOptions = () => {
    if (step > 9) return null;
    const currentQuestion = questions[step];
    if (!currentQuestion || isTyping) return null;

    const showBackButton = stepHistory.length > 1;
    const optionsContainer = (children: React.ReactNode) => (
      <div className="flex items-start justify-center p-2 space-x-2">
        {showBackButton && <Button onClick={handleBack} variant="outline" className="whitespace-nowrap mt-2">뒤로가기</Button>}
        <div className="flex-grow h-full">{children}</div>
      </div>
    );

    if (step === 2) {
      const handleConfirmDuration = () => {
        if (startDate && endDate && !durationError) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const nights = diffDays === 0 ? 0 : diffDays;
          handleSingleChoice(currentQuestion.key as keyof TravelPreferences, `${nights}박 ${nights + 1}일`);
        }
      };

      return optionsContainer(
        <div className="p-2 flex flex-col gap-2 w-full">
          <div className="flex gap-2">
            <input
              type="date"
              className={`flex-1 rounded-xl border ${durationError ? 'border-red-500' : 'border-slate-300'} bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3B6AFF]`}
              onChange={(e) => {
                setStartDate(e.currentTarget.value);
                if (!endDate || new Date(endDate) < new Date(e.currentTarget.value)) setEndDate(e.currentTarget.value);
              }}
              value={startDate}
            />
            <input
              type="date"
              className={`flex-1 rounded-xl border ${durationError ? 'border-red-500' : 'border-slate-300'} bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3B6AFF]`}
              onChange={(e) => setEndDate(e.currentTarget.value)}
              value={endDate}
              min={startDate}
            />
          </div>
          <p className={`text-sm text-center ${durationError ? 'text-red-500' : 'text-slate-500'}`}>최대 연박 : 4박 5일</p>
          <Button onClick={handleConfirmDuration} disabled={!startDate || !endDate || durationError} className="w-full mt-2">확인</Button>
        </div>
      );
    }

    if (currentQuestion.options) {
      const isMulti = currentQuestion.key === 'purpose' || currentQuestion.key === 'spotTypes';
      const optionsContent = (
        <div className="flex flex-wrap justify-center p-2">
          {currentQuestion.options.map((option: string) => (
            <ChoiceButton
              key={option}
              onClick={() => isMulti ? handleMultiChoice(currentQuestion.key as keyof TravelPreferences, option) : handleSingleChoice(currentQuestion.key as keyof TravelPreferences, option)}
              selected={isMulti ? ((preferences[currentQuestion.key] as string[] | undefined)?.includes(option) ?? false) : preferences[currentQuestion.key] === option}
            >
              {option}
            </ChoiceButton>
          ))}
          {isMulti && <Button onClick={() => { setStep(s => s + 1); setStepHistory([...stepHistory, step + 1]); const nq = questions[step + 1]; if (nq && nq.key !== 'summary') addBotMessage(nq.text, 200); }} className="w-full mt-2">선택 완료</Button>}
        </div>
      );
      return optionsContainer(optionsContent);
    }

    if (currentQuestion.key === 'date') {
      return optionsContainer(
        <div className="p-2 flex gap-2">
          <input
            type="date"
            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3B6AFF]"
            onChange={(e) => { if (e.currentTarget.value) handleSingleChoice(currentQuestion.key as keyof TravelPreferences, e.currentTarget.value); }}
          />
        </div>
      );
    }

    if (currentQuestion.key === 'ratio') {
      const ratio = preferences.ratio ?? 50;
      return optionsContainer(
        <div className="p-4 w-full max-w-xs mx-auto">
          <div className="flex items-center justify-between text-sm text-ink-500">
            <span>현지인</span>
            <span>관광객</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={ratio}
            onChange={(e) => setPreferences(p => ({ ...p, ratio: parseInt(e.target.value, 10) }))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer my-2"
          />
          <div className="text-center text-lg font-bold text-navy">{100 - ratio}% : {ratio}%</div>
          <Button onClick={() => handleSingleChoice(currentQuestion.key as keyof TravelPreferences, `${100 - ratio}% : ${ratio}%`)} className="w-full mt-4">확인</Button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b pb-3">
        <h2 className="text-lg font-bold text-navy">AI 여행 플래너</h2>
        <span className="text-sm text-ink-500">Tastetrip</span>
      </div>
      <div className="flex-1 h-[50vh] sm:h-[60vh] overflow-y-auto pr-2">
        {messages.map((m, i) => {
          const showAvatar = m.from === 'tpin' && (i === 0 || messages[i - 1].from !== 'tpin');
          return <ChatBubble key={i} from={m.from} text={m.text} showAvatar={showAvatar} />;
        })}
        {isTyping && <ChatBubble from="tpin" text="..." showAvatar={messages[messages.length - 1]?.from !== 'tpin'} />}
        <div ref={chatEndRef} />
      </div>
      <div className="mt-4 pt-3 border-t">
        {renderOptions()}
      </div>
    </div>
  );
};

export default ChatView;


