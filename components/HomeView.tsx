import React from 'react';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';

interface HomeViewProps {
  onStart: () => void;
  isNeo?: boolean;
}

const HomeView: React.FC<HomeViewProps> = ({ onStart, isNeo = false }) => {
  return (
    <div className={`relative text-center flex flex-col items-center justify-center py-16 sm:py-24 animate-fade-in ${isNeo ? '' : ''}`}>
      <div className={`${isNeo ? 'bg-white/40 backdrop-blur-xl p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-white/30' : 'bg-white p-8 rounded-2xl shadow-sm border border-slate-200'}`}>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tighter">
          <span className="block">묻고, 기다리고, 떠나자!</span>
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-slate-600">
          Tastetrip은 현지인의 시선과 AI의 섬세함으로 당신의 취향을 완성하는 여행을 선물합니다.
        </p>
        <div className="mt-10">
          <Button onClick={onStart} size="lg" variant={isNeo ? 'neo' : 'primary'} className={`text-xl px-10 py-4 ${isNeo ? '' : ''}`}>
            나만의 여행 코스 추천받기
          </Button>
        </div>
        <p className="mt-6 text-sm text-slate-500">
          단 몇 분 만에 당신을 위한 특별한 여정이 시작됩니다.
        </p>
      </div>
    </div>
  );
};

export default HomeView;
