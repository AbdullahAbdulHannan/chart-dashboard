import React from 'react';
import { PlatformData } from '../types';
import { BarChartIcon } from 'lucide-react';

interface PlatformMetricsProps {
  data: PlatformData;
  showGraphs: boolean;
  showNumbers: boolean;
}

export function PlatformMetrics({ data, showGraphs, showNumbers }: PlatformMetricsProps) {
  return (
    <>
    {showNumbers && (
       <div className="p-4">
      <div className="flex items-center gap-8">
        <img src={data.icon} alt={data.name} className="w-6 h-6" />
        
       
          <>
            <div>
              <p className='text-gray-400 font-semibold'>Total Followers</p>
              <p className="text-3xl font-bold text-gray-900">{data.followers.toLocaleString()}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full border-4 border-[#7BD5E1] flex items-center justify-center">
              </div>
            </div>
          </>
          <>
         <div>
              <p className='text-gray-400 font-semibold'>New Following</p>
              <p className="text-3xl font-bold text-gray-900">{data.new_following.toLocaleString()}</p>
            </div>
            <div className="flex-1">
              <svg className="w-32 h-16">
                <path
                  d="M0,32 C21.3333333,32 21.3333333,0 42.6666667,0 C64,0 64,32 85.3333333,32 C106.666667,32 106.666667,0 128,0"
                  fill="none"
                  stroke="#7BD5E1"
                  strokeWidth="2"
                />
              </svg>
            </div>
                <div>
                      <p className='text-gray-400 font-semibold'>Total Views</p>
                      <p className="text-3xl font-bold text-gray-900">{data.views.toLocaleString()}</p>
                    </div>
            
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((_, i) => (
                <div
                  key={i}
                  className="w-2 bg-[#7BD5E1]"
                  style={{ height: `${i * 15 + 8}px` }}
                ></div>
              ))}
            </div>
          </>
          
          </div>
          </div>
        )}
        </>
      );
      }