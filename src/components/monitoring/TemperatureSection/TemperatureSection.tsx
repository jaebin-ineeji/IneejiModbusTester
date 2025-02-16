import React from 'react';
import { TemperatureData } from '../../../types/monitoring';
import { Card, CardContent } from '../../ui/card';

interface TemperatureSectionProps {
  data: TemperatureData[];
}

export const TemperatureSection: React.FC<TemperatureSectionProps> = ({ data }) => {
  return (
    <div className="flex flex-col gap-2 p-4 border border-gray-200">
      <h2 className="m-0 p-2 bg-green-800 text-white font-bold">TEMPERATURE RECORDER</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-2">
        {data.map((item) => (
          <Card key={item.id} className="bg-gray-50">
            <CardContent className="p-4 flex justify-between items-center">
              <span className="font-bold">{item.name}</span>
              <span className="text-green-800 font-bold">
                {item.value.toFixed(1)} {item.unit}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 