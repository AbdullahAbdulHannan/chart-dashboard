import React from 'react';
import { Listbox } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';

interface ComparisonFiltersProps {
  selectedPlatforms: string[];
  setSelectedPlatforms: (platforms: string[]) => void;
  selectedCharts: string[];
  setSelectedCharts: (charts: string[]) => void;
  availablePlatforms: { id: string; name: string }[];
}

export function ComparisonFilters({ 
  selectedPlatforms, 
  setSelectedPlatforms, 
  selectedCharts, 
  setSelectedCharts,
  availablePlatforms 
}: ComparisonFiltersProps) {
  const chartOptions = [
    { id: 'audience', label: 'Audience Growth' },
    { id: 'followers', label: 'Platform Followers' },
    { id: 'actions', label: 'Actions On Post' }
  ];

  return (
    <div className="flex gap-4 mb-8">
      <div className="relative w-64">
        <Listbox
          value={selectedPlatforms}
          onChange={setSelectedPlatforms}
          multiple
        >
          <Listbox.Button className="w-full flex items-center justify-between bg-[#7BD5E1] text-white px-4 py-2 rounded-md">
            <span>Select Platform</span>
            <ChevronDown className="h-4 w-4" />
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 w-full bg-white rounded-md shadow-lg py-1 z-10">
            {availablePlatforms.map((platform) => (
              <Listbox.Option
                key={platform.id}
                value={platform.id}
                as="div"
                className="px-4 py-2 cursor-pointer hover:bg-gray-50"
              >
                {({ selected }) => (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border rounded flex items-center justify-center">
                      {selected && <Check className="w-3 h-3 text-[#7BD5E1]" />}
                    </div>
                    <span className={selected ? 'text-[#7BD5E1]' : 'text-gray-900'}>
                      {platform.name}
                    </span>
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      </div>

      <div className="relative w-64">
        <Listbox
          value={selectedCharts}
          onChange={setSelectedCharts}
          multiple
        >
          <Listbox.Button className="w-full flex items-center justify-between bg-[#7BD5E1] text-white px-4 py-2 rounded-md">
            <span>Select Charts</span>
            <ChevronDown className="h-4 w-4" />
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 w-full bg-white rounded-md shadow-lg py-1 z-10">
            {chartOptions.map((option) => (
              <Listbox.Option
                key={option.id}
                value={option.id}
                as="div"
                className="px-4 py-2 cursor-pointer hover:bg-gray-50"
              >
                {({ selected }) => (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border rounded flex items-center justify-center">
                      {selected && <Check className="w-3 h-3 text-[#7BD5E1]" />}
                    </div>
                    <span className={selected ? 'text-[#7BD5E1]' : 'text-gray-900'}>
                      {option.label}
                    </span>
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      </div>
    </div>
  );
}