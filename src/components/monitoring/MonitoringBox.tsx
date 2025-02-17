import { MachineData } from '../../types/monitoring';
import { getBackgroundColor } from '../../utils/machineUtils';

interface MonitoringBoxProps {
  machineName: string;
  machineData: MachineData;
  isConnected: boolean;
}

export const MonitoringBox = ({ machineName, machineData, isConnected }: MonitoringBoxProps) => {
  const renderValue = (label: string, value: number | string | undefined | null, color: string = 'text-black', format: (v: number) => string = v => v?.toFixed(0)) => {
    if (value === undefined || value === null) {
      return (
        <div className="flex justify-between">
          <span>{label}:</span>
          <span className="text-red-500">태그 없음</span>
        </div>
      );
    }
    return (
      <div className="flex justify-between">
        <span>{label}:</span>
        <span className={color}>{typeof value === 'number' ? format(value) : value}</span>
      </div>
    );
  };

  return (
    <div className="border border-gray-300 p-2">
      <div className={`${getBackgroundColor(machineName)} text-white px-2 py-1 text-sm flex justify-between items-center`}>
        <span>{machineName}</span>
        {isConnected ? (
          <span className="w-2 h-2 rounded-full bg-green-400"></span>
        ) : (
          <span className="w-2 h-2 rounded-full bg-red-400"></span>
        )}
      </div>
      <div className="text-sm mt-1">
        {renderValue('R/L', machineData.RM, machineData.RM === 'LOCAL' ? 'text-green-600' : 'text-yellow-600')}
        {renderValue('A/M', machineData.AM, 'text-blue-600')}
        {renderValue('PV', machineData.PV)}
        {renderValue('SV', machineData.SV)}
        {renderValue('RT', machineData.RT, 'text-black', v => v?.toFixed(2))}
        {renderValue('MV', machineData.MV, 'text-orange-500')}
      </div>
    </div>
  );
}; 