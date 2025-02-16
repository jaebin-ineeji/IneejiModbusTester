import React from 'react';
import { ControlMode, MonitoringData } from '../../types/monitoring';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface MonitoringBoxProps extends MonitoringData, Partial<ControlMode> {
  title: string;
  backgroundColor?: string;
}

export const MonitoringBox: React.FC<MonitoringBoxProps> = ({
  title,
  backgroundColor,
  pv,
  sv,
  rt,
  mv,
  rl,
  am
}) => {
  return (
    <Card className={`min-w-[200px] ${backgroundColor ? `bg-[${backgroundColor}]` : ''}`}>
      <CardHeader className="bg-gray-800 text-white py-2 px-4">
        <CardTitle className="text-sm font-bold text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {rl && am && (
          <>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">R/L:</span>
              <span className={`text-sm font-medium ${rl === 'LOCAL' ? 'text-green-600' : 'text-orange-500'}`}>
                {rl}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">A/M:</span>
              <span className={`text-sm font-medium ${am === 'AUTO' ? 'text-blue-600' : 'text-red-500'}`}>
                {am}
              </span>
            </div>
          </>
        )}
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">PV:</span>
          <span className="text-sm">{pv.toFixed(1)}</span>
        </div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">SV:</span>
          <span className="text-sm">{sv.toFixed(1)}</span>
        </div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">RT:</span>
          <span className="text-sm">{rt.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">MV:</span>
          <span className="text-sm">{mv.toFixed(1)}</span>
        </div>
      </CardContent>
    </Card>
  );
}; 