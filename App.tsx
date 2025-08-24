import React, { useState, useCallback, useEffect } from 'react';
import { DestinationInfo, ItineraryPlan } from './types';
import { generateItinerary } from './services/geminiService';
import { mockDestinationData } from './data/mockData';

import HomeView from './components/HomeView';
import WaitingView from './components/WaitingView';
import ItineraryCard from './components/ItineraryCard';
import Feedback from './components/Feedback';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import AdminView from './components/AdminView';
import { Spinner } from './components/ui/Spinner';
import BottomNav from './components/ui/BottomNav';
import SocialLogin from './components/SocialLogin';
import ChatView from './components/ChatView';

 type AppState = 'chatting' | 'form' | 'waiting' | 'result' | 'admin' | 'login';

type Provider = 'google' | 'kakao' | 'apple';

type AuthRecord = { v: 1; provider: Provider; issuedAt: number };

const AUTH_KEY = 'tt_auth';
const AUTH_DAYS = 30;
const AUTH_MS = AUTH_DAYS * 24 * 60 * 60 * 1000;

const getAuth = (): AuthRecord | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthRecord;
    if (!parsed || typeof parsed.issuedAt !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
};

const isAuthenticated = () => {
  const rec = getAuth();
  if (!rec) return false;
  const fresh = Date.now() - rec.issuedAt < AUTH_MS;
  if (!fresh) {
    localStorage.removeItem(AUTH_KEY);
  }
  return fresh;
};

function getInitialAppStateFromUrl(): AppState {
  try {
    const url = new URL(window.location.href);
    const viewParam = url.searchParams.get('view');
    const path = url.pathname;
    if (path.endsWith('/login')) return 'login';
    if (path.endsWith('/chatting')) return 'chatting';
    switch (viewParam) {
      case 'admin':
        return 'admin';
      case 'form':
        return 'form';
      case 'waiting':
        return 'waiting';
      case 'result':
        return 'result';
      case 'login':
        return 'login';
      case 'home':
      case 'chatting':
        return 'chatting';
      default:
        return 'login';
    }
  } catch {
    return 'login';
  }
}

function App() {
  const [appState, setAppState] = useState<AppState>(getInitialAppStateFromUrl());
  const [destinationData, setDestinationData] = useState<DestinationInfo[]>(mockDestinationData);
  const isNeo = true;
  const [openSettings, setOpenSettings] = useState(false);
  
  // Auth guard: always redirect to login if not fresh auth
  useEffect(() => {
    if (!isAuthenticated() && appState !== 'login') {
      setAppState('login');
      if (window.location.pathname !== '/login') {
        window.history.replaceState(null, '', '/login');
      }
    }
  }, [appState]);
  
  // Form State
  const [destination, setDestination] = useState('군산');
  const [dates, setDates] = useState('1박 2일');
  const [interests, setInterests] = useState('조용한 골목길 산책과 감성 카페를 좋아해요. 사진 찍는 걸 즐깁니다.');
  
  // Result State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryPlan | null>(null);

  const handleAddDestination = (newDestination: DestinationInfo) => {
    setDestinationData(prevData => [...prevData, newDestination]);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (destinationData.length === 0) {
      setError("죄송합니다. 현재 추천 가능한 여행지 데이터가 없습니다.");
      return;
    }

    if (destination.trim().length < 2) {
      setError("여행지를 2글자 이상 입력해주세요.");
      return;
    }
    if (dates.trim().length < 2) {
      setError("여행 기간을 정확히 입력해주세요. (예: 1박 2일)");
      return;
    }
    if (interests.trim().length < 10) {
      setError("취향을 10글자 이상 자세히 알려주세요. 좋은 코스를 만드는 데 도움이 됩니다.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setItinerary(null);
    setAppState('waiting');

    try {
      const result = await generateItinerary(destination, dates, interests, destinationData);
      setItinerary(result);
    } catch (err) {
      const typedError = err as Error;
      setError(typedError.message || '알 수 없는 오류로 추천 코스 생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [destination, dates, interests, destinationData]);
  
  const handleFeedback = (feedback: string) => {
      console.log("Feedback received:", feedback);
  };

  const handleReset = () => {
    setAppState('form');
    setItinerary(null);
    setError(null);
  }

  const renderContent = () => {
    switch (appState) {
      case 'chatting':
        return <ChatView onBack={() => setAppState('login')} />;
      case 'login':
        return (
          <SocialLogin
            onLoggedIn={(provider) => {
              const rec: AuthRecord = { v: 1, provider, issuedAt: Date.now() };
              localStorage.setItem(AUTH_KEY, JSON.stringify(rec));
              setAppState('chatting');
              if (window.location.pathname !== '/chatting') {
                window.history.pushState(null, '', '/chatting');
              }
            }}
            isNeo={isNeo}
          />
        );
      case 'form':
        return (
          <Card className={`${isNeo ? 'neo' : ''} bg-white/90 backdrop-blur-sm animate-fade-in`}>
            <CardHeader>
              <CardTitle>어떤 여행을 꿈꾸시나요?</CardTitle>
              <CardDescription>
                당신의 취향을 알려주시면, 현지 전문가가 직접 최고의 여행을 설계해 드립니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="destination" className="block text-sm font-medium text-slate-700 mb-1">어디로 떠나시나요?</label>
                    <Input id="destination" type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="예: 군산, 제주도, 강릉" required />
                  </div>
                  <div>
                    <label htmlFor="dates" className="block text-sm font-medium text-slate-700 mb-1">얼마나 머무르시나요?</label>
                    <Input id="dates" type="text" value={dates} onChange={(e) => setDates(e.target.value)} placeholder="예: 2박 3일, 당일치기" required />
                  </div>
                  <div>
                    <label htmlFor="interests" className="block text-sm font-medium text-slate-700 mb-1">어떤 스타일을 좋아하세요?</label>
                    <Input id="interests" type="text" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="예: 조용한 바닷가 카페, 현지인 맛집, 액티비티는 조금만" required />
                  </div>
                </div>
                {error && <p className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-md text-sm">{error}</p>}
                <div className="flex justify-end pt-6">
                  <Button type="submit" disabled={isLoading} size="lg" variant={isNeo ? 'neo' : 'primary'}>
                    {isLoading ? <Spinner /> : '나만의 여행 코스 추천받기'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        );
      case 'waiting':
        return (
          <WaitingView isLoading={isLoading} onFinish={() => setAppState('result')} destination={destination} isNeo={isNeo} />
        );
      case 'result':
        if (error) {
          return (
            <Card className="bg-white text-center animate-fade-in">
              <CardHeader>
                <CardTitle className="text-red-600">오류 발생</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-dark">{error}</p>
                <Button onClick={handleReset}>다시 시도하기</Button>
              </CardContent>
            </Card>
          );
        }
        if (itinerary) {
          return (
            <div className="space-y-10 animate-fade-in">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-text-dark tracking-tight">{itinerary.tripTitle}</h2>
                <p className="mt-3 text-lg text-accent font-semibold">{itinerary.tripSlogan}</p>
                <p className="mt-1 text-md text-text-light">{itinerary.destination} 여행</p>
              </div>
              {itinerary.dailyPlans.sort((a, b) => a.day - b.day).map(dayPlan => (
                <ItineraryCard key={dayPlan.day} dayPlan={dayPlan} neo={isNeo} />
              ))}
              <Feedback onFeedbackSubmit={handleFeedback} />
              <div className="text-center pt-6">
                <Button onClick={handleReset} variant="outline" size="lg">새로운 코스 추천받기</Button>
              </div>
            </div>
          );
        }
        return null;
      case 'admin':
        return <AdminView onGoBack={() => setAppState('chatting')} destinationData={destinationData} onAddDestination={handleAddDestination} />;
      default:
        return <HomeView onStart={() => setAppState('form')} />;
    }
  }

  const isLogin = appState === 'login';

  const GearIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-ink-700">
      <path d="M19.14 12.94a7.79 7.79 0 0 0 .06-1l1.71-1.33-1.62-2.8-2 .37a8 8 0 0 0-.86-.5l-.31-2h-3.24l-.31 2c-.29.14-.58.31-.86.5l-2-.37-1.62 2.8 1.71 1.33a7.79 7.79 0 0 0-.06 1l-1.71 1.33 1.62 2.8 2-.37c.28.19.57.36.86.5l.31 2h3.24l.31-2c.29-.14.58-.31.86-.5l2 .37 1.62-2.8-1.71-1.33ZM12 15.5A3.5 3.5 0 1 1 15.5 12 3.51 3.51 0 0 1 12 15.5Z" fill="currentColor"/>
    </svg>
  );

  return (
    <div className={`min-h-screen font-sans ${isNeo ? 'bg-[radial-gradient(130%_100%_at_0%_0%,#F8D5FF_0%,transparent_55%),radial-gradient(120%_90%_at_100%_100%,#B9E0FF_0%,transparent_55%),radial-gradient(90%_70%_at_50%_50%,#F0F5FF_0%,#E6EEFF_60%)]' : 'bg-slate-50'} ${isLogin ? 'overflow-hidden' : ''}`}>
      {!isNeo && (
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1511225142247-13a839b8915b?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 z-0"></div>
      )}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header always visible */}
        <header className="py-8">
          <div className="container mx-auto px-4 flex flex-col items-center">
            <div className="flex items-center space-x-3">
              <div className={`h-9 w-9 rounded-2xl shadow-lg ${isNeo ? 'bg-gradient-to-br from-[#3B82F6] via-[#60A5FA] to-[#A78BFA]' : 'bg-orange-500'}`} />
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tighter">Tastetrip</h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">내 취향을 완성하는 여행</p>
          </div>
        </header>

        <main className={`${isLogin ? 'flex-1 flex items-center justify-center' : ''} container mx-auto p-6 sm:p-8 lg:p-10 max-w-6xl w-full`}>
          {renderContent()}
        </main>

        <footer className="text-center p-8 text-slate-500 text-sm mt-10">
          <p>© 2025 Tastetrip</p>
          <div className="flex items-center gap-3 justify-center">
            <Button variant="ghost" size="sm" onClick={() => setAppState('admin')} className="text-slate-500">Admin</Button>
            <Button variant="ghost" size="sm" onClick={() => setAppState('login')} className="text-slate-500">Login</Button>
          </div>
        </footer>
        {isNeo && appState !== 'login' && (
          <BottomNav
            active={appState}
            onGoHome={() => setAppState('chatting')}
            onStartForm={() => setAppState('form')}
            onOpenAdmin={() => setAppState('admin')}
          />
        )}
      </div>

      {/* Full-screen settings panel */}
      {openSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpenSettings(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-md mx-auto border border-slate-200 shadow-lg overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <h3 className="text-navy font-bold">설정</h3>
              <button onClick={() => setOpenSettings(false)} className="text-ink-500 hover:underline text-sm">닫기</button>
            </div>
            <div className="divide-y">
              <button className="w-full text-left px-5 py-4 hover:bg-slate-50">내정보 수정</button>
              <button className="w-full text-left px-5 py-4 hover:bg-slate-50">FAQ/문의</button>
              <button className="w-full text-left px-5 py-4 hover:bg-slate-50">설정</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
