import { TagValue } from '@/components/monitoring/TagValue';
import { useMachineStore } from '@/store/machine';
import { MachineData } from '@/types/monitoring';
import { getBackgroundColor } from '@/utils/machineUtils';
interface MonitoringBoxProps {
  machineName: string;
  machineData: MachineData;
  isConnected: boolean;
}


export const MonitoringBox = ({ machineName, machineData, isConnected }: MonitoringBoxProps) => {
  const { machineTagsMap } = useMachineStore();
  const selectedTags = machineTagsMap[machineName]?.selectedTags || [];

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
        {selectedTags.map(tag => (
          <TagValue key={tag} tag={tag} value={machineData[tag]} />
        ))}
      </div>
    </div>
  );
}; 