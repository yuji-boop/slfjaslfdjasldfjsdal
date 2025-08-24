import React from 'react';

interface GlobalLandingProps {
  onSelect: (region: string) => void;
}

const regions: { title: string; items: string[] }[] = [
  { title: 'ASIA', items: ['Japan', 'Hong Kong SAR', 'Indonesia', 'Malaysia', 'Philippines', 'Singapore', 'Taiwan, China', 'Thailand', 'Vietnam', 'Korea'] },
  { title: 'NORTH AMERICA', items: ['Canada', 'United States'] },
  { title: 'OCEANIA', items: ['Australia', 'New Zealand'] },
];

const GlobalLanding: React.FC<GlobalLandingProps> = ({ onSelect }) => {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy">GLOBAL TASTETRIP</h1>
        <p className="mt-2 text-ink-500">CHOOSE YOUR LOCATION</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full px-4">
        {regions.map((group) => (
          <div key={group.title} className="rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-navy mb-3">{group.title}</h3>
            <ul className="space-y-2">
              {group.items.map((name) => (
                <li key={name}>
                  <button
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-lightBlue/40 text-ink-700"
                    onClick={() => onSelect(name)}
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlobalLanding;









