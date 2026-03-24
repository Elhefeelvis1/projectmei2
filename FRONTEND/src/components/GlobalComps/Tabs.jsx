import {React} from 'react';

export default function Tabs({ tabArray, setActive, activeTab }) {
  return (
    <div className="flex overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-6 hide-scrollbar">
      {tabArray.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              isActive 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {Icon && <Icon size={18} />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}