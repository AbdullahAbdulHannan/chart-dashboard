import React from 'react';
import { Info, TrendingUp } from 'lucide-react';

interface LayoutProps {
  activeTab: 'overview' | 'comparison'|'post';
  setActiveTab: (tab: 'overview' | 'comparison'|'post') => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, children }) => {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-48">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Dashboard</h2>
              <ul className="space-y-2">
                <li
                  className={`flex items-center gap-2 font-medium px-4 py-2 cursor-pointer rounded ${
                    activeTab === 'overview' ? 'bg-purple-100 text-purple-600' : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  <Info />
                  Overview
                </li>
                <li
                  className={`flex items-center gap-2 font-medium px-4 py-2 cursor-pointer rounded ${
                    activeTab === 'comparison' ? 'bg-purple-100 text-purple-600' : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab('comparison')}
                >
                  <TrendingUp />
                  Comparison
                </li>
                <li
                  className={`flex items-center gap-2 font-medium px-4 py-2 cursor-pointer rounded ${
                    activeTab === 'post' ? 'bg-purple-100 text-purple-600' : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab('post')}
                >
                  <TrendingUp />
                  Post
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};