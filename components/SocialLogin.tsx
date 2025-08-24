import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';

interface SocialLoginProps {
  onLoggedIn: (provider: 'google' | 'kakao' | 'apple') => void;
  isNeo?: boolean;
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" className="mr-2">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6 29.3 4 24 4 16 4 9.1 8.6 6.3 14.7z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16.1 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6 29.3 4 24 4 16 4 9.1 8.6 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-4.9C29.2 35.8 26.8 36 24 36c-5.2 0-9.6-3.4-11.2-8.1l-6.6 5.1C9.1 39.4 16 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.3-3.9 5.8-7.5 6.7l6.2 4.9C36.2 37.4 40 31.2 40 24c0-1.3-.1-2.3-.4-3.5z"/>
  </svg>
);

const KakaoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="mr-2" fill="currentColor">
    <path d="M12 3C7.03 3 3 6.134 3 10c0 2.31 1.5 4.351 3.79 5.565L6 21l4.02-3.012c.64.1 1.3.154 1.98.154 4.97 0 9-3.134 9-7s-4.03-8-9-8z" />
  </svg>
);

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="mr-2" fill="currentColor">
    <path d="M16.365 1.43c0 1.14-.456 2.206-1.193 3.008-.77.836-2.04 1.48-3.148 1.39-.146-1.07.43-2.2 1.19-2.98.78-.8 2.13-1.4 3.15-1.42zM20.76 17.1c-.56 1.29-1.24 2.57-2.23 3.7-.84.96-1.82 1.98-3.16 2-1.33.02-1.76-.64-3.27-.64-1.5 0-1.98.62-3.3.66-1.34.04-2.36-1.04-3.2-2-1.74-1.98-3.08-4.96-2.4-7.64.56-2.2 2.2-3.9 4.26-3.94 1.33-.02 2.57.72 3.27.72.7 0 2.26-.88 3.81-.75 1.3.06 2.49.56 3.35 1.44-2.94 1.61-2.47 5.83.45 6.6-.28.75-.61 1.47-1.04 2.15z"/>
  </svg>
);

type Provider = 'google' | 'kakao' | 'apple';

const SocialButton: React.FC<{
  onClick: () => void;
  className: string;
  children: React.ReactNode;
}> = ({ onClick, className, children }) => (
  <button
    onClick={onClick}
    className={`w-full rounded-2xl px-4 py-3 font-semibold flex items-center justify-center shadow-sm transition hover:brightness-105 ${className}`}
  >
    {children}
  </button>
);

const CONSENT_KEY = 'tt_consents';

type Consents = {
  terms: boolean;
  privacy: boolean;
  marketingEmail: boolean;
  marketingPush: boolean;
};

const defaultConsents: Consents = {
  terms: false,
  privacy: false,
  marketingEmail: false,
  marketingPush: false,
};

const SocialLogin: React.FC<SocialLoginProps> = ({ onLoggedIn, isNeo = true }) => {
  const last = (() => {
    try {
      const raw = localStorage.getItem('tt_auth');
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { provider?: 'google' | 'kakao' | 'apple'; issuedAt?: number };
      return parsed?.provider || null;
    } catch {
      return null;
    }
  })();

  const providerLabel: Record<'google'|'kakao'|'apple', string> = {
    google: 'Google',
    kakao: 'Kakao',
    apple: 'Apple',
  };

  const ProviderSmallIcon: React.FC<{ p: Provider }> = ({ p }) => (
    <span className="inline-flex items-center mr-2">
      {p === 'google' && <GoogleIcon />}
      {p === 'kakao' && <KakaoIcon />}
      {p === 'apple' && <AppleIcon />}
    </span>
  );

  const [consents, setConsents] = React.useState<Consents>(() => {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      return raw ? { ...defaultConsents, ...JSON.parse(raw) } as Consents : defaultConsents;
    } catch {
      return defaultConsents;
    }
  });
  const [showConsent, setShowConsent] = React.useState(false);
  const [detail, setDetail] = React.useState<null | 'terms' | 'privacy' | 'marketing'>(null);
  const [pendingProvider, setPendingProvider] = React.useState<Provider | null>(null);

  const saveConsents = (next: Consents) => {
    setConsents(next);
    localStorage.setItem(CONSENT_KEY, JSON.stringify(next));
  };

  const canProceed = consents.terms && consents.privacy;

  const startLogin = (provider: Provider) => {
    if (consents.terms && consents.privacy) {
      onLoggedIn(provider);
      return;
    }
    setPendingProvider(provider);
    setShowConsent(true);
  };

  const confirmConsents = () => {
    if (!canProceed || !pendingProvider) return;
    saveConsents(consents);
    setShowConsent(false);
    onLoggedIn(pendingProvider);
    setPendingProvider(null);
  };

  return (
    <div className="max-w-xl mx-auto">
      <Card className={`${isNeo ? 'neo' : ''} bg-white/80 backdrop-blur-md`}> 
        <CardHeader>
          <CardTitle className="text-2xl text-navy">SNS 로그인 / 회원가입</CardTitle>
          <CardDescription className="text-base mt-2">지금 1초 로그인하고, 현지인 추천 여행코스로 현지 문화를 즐기세요!</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 sm:gap-7 py-6">
          {/* Example itinerary preview as travel timeline for Gunsan */}
          <div className="relative rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 p-5 shadow-[0_8px_24px_rgba(30,42,74,0.06)]">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-primary ring-1 ring-primary/20 bg-gradient-to-r from-[#3B6AFF]/10 to-[#6FD6FF]/10">Gunsan Local Picks</span>
              <span className="text-xs text-ink-500">Day 1 · 1박 2일</span>
            </div>
            <div className="mt-4 border-l-2 border-lightBlue pl-4 space-y-3 text-sm text-ink-700">
              <div className="relative">
                <span className="absolute -left-[9px] top-1.5 h-3 w-3 rounded-full bg-gradient-to-r from-[#3B6AFF] to-[#6FD6FF] ring-2 ring-white shadow-[0_0_10px_rgba(59,106,255,0.4)]"></span>
                <span className="text-ink-500 mr-2">10:00</span>
                <span className="font-semibold text-navy">은파호수공원 산책</span>
                <span className="ml-2 text-ink-500">물빛다리</span>
              </div>
              <div className="relative">
                <span className="absolute -left-[9px] top-1.5 h-3 w-3 rounded-full bg-gradient-to-r from-[#3B6AFF] to-[#6FD6FF] ring-2 ring-white shadow-[0_0_10px_rgba(59,106,255,0.4)]"></span>
                <span className="text-ink-500 mr-2">12:30</span>
                <span className="font-semibold text-navy">이성당 브런치</span>
                <span className="ml-2 text-ink-500">앙금빵/야채빵</span>
              </div>
              <div className="relative">
                <span className="absolute -left-[9px] top-1.5 h-3 w-3 rounded-full bg-gradient-to-r from-[#3B6AFF] to-[#6FD6FF] ring-2 ring-white shadow-[0_0_10px_rgba(59,106,255,0.4)]"></span>
                <span className="text-ink-500 mr-2">14:00</span>
                <span className="font-semibold text-navy">경암동 철길마을</span>
                <span className="ml-2 text-ink-500">레트로 포토 스폿</span>
              </div>
              {/* Blurred from 16:00 */}
              <div className="relative blur-sm">
                <span className="absolute -left-[9px] top-1.5 h-3 w-3 rounded-full bg-gradient-to-r from-[#3B6AFF] to-[#6FD6FF] ring-2 ring-white"></span>
                <span className="text-ink-500 mr-2">16:00</span>
                <span className="font-semibold text-navy">초원사진관</span>
                <span className="ml-2 text-ink-500">8월의 크리스마스</span>
              </div>
              <div className="relative blur-sm">
                <span className="absolute -left-[9px] top-1.5 h-3 w-3 rounded-full bg-gradient-to-r from-[#3B6AFF] to-[#6FD6FF] ring-2 ring-white"></span>
                <span className="text-ink-500 mr-2">18:30</span>
                <span className="font-semibold text-navy">근대역사박물관 야경</span>
                <span className="ml-2 text-ink-500">산책</span>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-3 text-center">
              <span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold text-primary bg-white/80 backdrop-blur-md ring-1 ring-white/60 shadow-sm">더보기 ㅣ 1초 로그인 후, 바로 확인하세요!</span>
            </div>
          </div>

          {/* Divider with comfy padding */}
          <div className="my-6">
            <div className="h-px bg-gradient-to-r from-transparent via-lightBlue to-transparent" />
          </div>

          {/* Recent provider centered under divider */}
          {last && (
            <div className="-mb-2 text-center text-xs text-ink-500 flex items-center justify-center">
              <span>최근 로그인 : </span>
              <ProviderSmallIcon p={last} />
              <span className="font-semibold">{providerLabel[last]}</span>
            </div>
          )}

          {/* Social buttons (consent via modal) */}
          <div className="flex flex-col gap-4 sm:gap-5 mt-2">
            <div className="block sm:hidden">
              <SocialButton onClick={() => startLogin('apple')} className="bg-black text-white">
                <AppleIcon /> Apple로 로그인
              </SocialButton>
            </div>
            <SocialButton onClick={() => startLogin('google')} className="bg-white text-slate-800 border border-slate-300">
              <GoogleIcon /> Google로 로그인
            </SocialButton>
            <SocialButton onClick={() => startLogin('kakao')} className="bg-[#FEE500] text-black">
              <KakaoIcon /> Kakao로 로그인
            </SocialButton>
          </div>
        </CardContent>
      </Card>

      {/* Consent Modal */}
      {showConsent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowConsent(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-md mx-auto border border-slate-200 shadow-lg overflow-hidden">
            {!detail && (
              <div className="p-5">
                <h3 className="text-lg font-bold text-navy">약관 동의</h3>
                <p className="text-sm text-ink-500 mt-1">서비스 이용을 위해 필수 항목에 동의해주세요.</p>

                <div className="mt-4 space-y-3 text-sm">
                  <label className="flex items-start gap-2">
                    <input type="checkbox" checked={consents.terms} onChange={(e) => saveConsents({ ...consents, terms: e.target.checked })} className="mt-1" />
                    <span className="flex-1">서비스 이용약관 (필수) <button onClick={() => setDetail('terms')} className="text-primary underline ml-2">상세</button></span>
                  </label>
                  <label className="flex items-start gap-2">
                    <input type="checkbox" checked={consents.privacy} onChange={(e) => saveConsents({ ...consents, privacy: e.target.checked })} className="mt-1" />
                    <span className="flex-1">개인정보 수집·이용 동의 (필수) <button onClick={() => setDetail('privacy')} className="text-primary underline ml-2">상세</button></span>
                  </label>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">마케팅 수신동의 (선택)</span>
                      <button onClick={() => setDetail('marketing')} className="text-primary underline">상세</button>
                    </div>
                    <label className="flex items-center gap-2 mt-2">
                      <input type="checkbox" checked={consents.marketingEmail} onChange={(e) => saveConsents({ ...consents, marketingEmail: e.target.checked })} />
                      <span>이메일</span>
                    </label>
                    <label className="flex items-center gap-2 mt-1">
                      <input type="checkbox" checked={consents.marketingPush} onChange={(e) => saveConsents({ ...consents, marketingPush: e.target.checked })} />
                      <span>푸시알림</span>
                    </label>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <button onClick={() => setShowConsent(false)} className="flex-1 rounded-xl border border-slate-300 px-4 py-2">취소</button>
                  <button onClick={confirmConsents} disabled={!canProceed} className={`flex-1 rounded-xl px-4 py-2 text-white ${canProceed ? 'bg-[#3B6AFF]' : 'bg-slate-400'} font-semibold`}>
                    동의하고 계속
                  </button>
                </div>
              </div>
            )}

            {detail && (
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-navy">{detail === 'terms' ? '서비스 이용약관' : detail === 'privacy' ? '개인정보 수집·이용 동의' : '마케팅 수신동의'}</h3>
                  <button onClick={() => setDetail(null)} className="text-ink-500 text-sm underline">닫기</button>
                </div>
                <div className="mt-3 h-64 overflow-auto text-sm text-ink-700 space-y-3">
                  <p>이곳에 {detail === 'terms' ? '서비스 이용약관' : detail === 'privacy' ? '개인정보 처리방침' : '마케팅 수신'} 상세 내용을 표시할 수 있습니다. 외부 링크로 이동하려면 아래 버튼을 사용하세요.</p>
                  <p>샘플 문구: 서비스 제공 목적, 수집 항목, 보관 기간, 철회 방법 등 법적 고지사항을 명확히 안내합니다.</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <a href={detail === 'terms' ? '/terms' : detail === 'privacy' ? '/privacy' : '/marketing'} target="_blank" rel="noreferrer" className="text-primary underline">자세히 보기(새 창)</a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialLogin;


