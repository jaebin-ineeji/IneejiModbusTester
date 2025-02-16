import React from 'react';
import { OxygenData } from '../../../types/monitoring';
import { MonitoringBox } from '../../common/MonitoringBox';

interface OxygenSectionProps {
  data: OxygenData[];
}

export const OxygenSection: React.FC<OxygenSectionProps> = ({ data }) => {
  const leftSideData = data.filter(item => item.position.endsWith('L'));
  const rightSideData = data.filter(item => item.position.endsWith('R'));

  return (
    <div className="flex flex-col gap-2 p-4">
      <h2 className="m-0 p-2 bg-purple-900 text-white font-bold">OXYGEN MONITORING</h2>
      <div className="flex flex-wrap gap-2">
        <div className="border-2 border-red-500 p-2 flex flex-wrap gap-2">
          {leftSideData.map((item) => (
            <MonitoringBox
              key={item.position}
              title={`OXY ${item.position}`}
              backgroundColor="#F0E6FF"
              {...item}
            />
          ))}
        </div>
        <div className="border-2 border-blue-500 p-2 flex flex-wrap gap-2">
          {rightSideData.map((item) => (
            <MonitoringBox
              key={item.position}
              title={`OXY ${item.position}`}
              backgroundColor="#F0E6FF"
              {...item}
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 