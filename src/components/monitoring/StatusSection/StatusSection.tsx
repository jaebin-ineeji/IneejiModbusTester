import React from 'react';
import { StatusData } from '../../../types/monitoring';
import { Card, CardContent } from '../../ui/card';

interface StatusSectionProps {
  data: StatusData[];
}

export const StatusSection: React.FC<StatusSectionProps> = ({ data }) => {
  return (
    <div className="flex flex-col gap-2 p-4 border border-gray-200">
      <h2 className="m-0 p-2 bg-green-600 text-white font-bold">PLANT STATUS</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-2">
        {data.map((item) => (
          <Card key={item.id} className="bg-blue-50">
            <CardContent className="p-4 flex justify-between items-center">
              <span className="font-bold">{item.name}</span>
              <span className="text-green-600 font-bold">
                {item.value.toFixed(2)} {item.unit}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 