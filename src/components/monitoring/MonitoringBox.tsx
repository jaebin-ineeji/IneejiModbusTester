import { useMachineStore } from '../../store/machine';
import { MachineData } from '../../types/monitoring';
import { getBackgroundColor } from '../../utils/machineUtils';

interface MonitoringBoxProps {
  machineName: string;
  machineData: MachineData;
  isConnected: boolean;
}

type TagValue = string | number;

interface TagHandler {
  format: (value: TagValue) => string;
  color: (value: TagValue) => string;
}

export const MonitoringBox = ({ machineName, machineData, isConnected }: MonitoringBoxProps) => {
  const { machineTagsMap } = useMachineStore();
  const selectedTags = machineTagsMap[machineName]?.selectedTags || [];

  const getTagHandler = (tag: string): TagHandler => {
    switch (tag) {
      case 'RM':
        return {
          format: (v) => String(v),
          color: (v) => v === 'LOCAL' ? 'text-green-600' : 'text-yellow-600'
        };
      case 'AM':
        return {
          format: (v) => String(v),
          color: () => 'text-blue-600'
        };
      case 'RT':
        return {
          format: (v) => typeof v === 'number' ? v.toFixed(2) : String(v),
          color: () => 'text-black'
        };
      case 'MV':
        return {
          format: (v) => typeof v === 'number' ? v.toFixed(0) : String(v),
          color: () => 'text-orange-500'
        };
      default:
        return {
          format: (v) => typeof v === 'number' ? v.toFixed(0) : String(v),
          color: () => 'text-black'
        };
    }
  };

  const renderValue = (tag: string) => {
    const value = machineData[tag];

    if (value === undefined || value === null) {
      return (
        <div key={tag} className="flex justify-between">
          <span>{tag}:</span>
          <span className="text-red-500">loading...</span>
        </div>
      );
    }

    const handler = getTagHandler(tag);
    const formattedValue = handler.format(value);
    const color = handler.color(value);

    return (
      <div key={tag} className="flex justify-between">
        <span>{tag}:</span>
        <span className={color}>{formattedValue}</span>
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
        {selectedTags.map(tag => renderValue(tag))}
      </div>
    </div>
  );
}; 