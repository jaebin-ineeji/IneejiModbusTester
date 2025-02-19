import { TagValue } from '@/components/monitoring/TagValue';
import { useMachineStore } from '@/store/machine';
import { MachineData } from '@/types/monitoring';
import { getBackgroundColor } from '@/utils/machineUtils';
import { ImSpinner } from "react-icons/im";

interface MonitoringBoxProps {
  machineName: string;
  machineData: MachineData;
  isConnected: boolean;
}


export const MonitoringBox = ({ machineName, machineData, isConnected }: MonitoringBoxProps) => {
  const { machineTagsMap } = useMachineStore();
  const selectedTags = machineTagsMap[machineName]?.selectedTags || [];

  return (
    <div className="border-2 border-black p-2 rounded-lg bg-gray-50 shadow-md">
      <div className={`${getBackgroundColor(machineName)} text-white px-2 py-1 text-lg flex justify-between items-center`}>
        <span>{machineName}</span>
        {isConnected ? (
          <span className="w-2 h-2 rounded-full bg-[#5df642]"></span>
        ) : (
          <span className="w-2 h-2 rounded-full bg-red-400"></span>
        )}
      </div>
      <div className="text-sm mt-1">
        {isConnected ? selectedTags.map(tag => (
          <TagValue key={tag} tag={tag} value={machineData[tag]} />
        )) : (
          <div className="text-gray-500 flex justify-center items-center">
            <ImSpinner className="animate-spin text-2xl m-2" />
          </div>
        )}
      </div>
    </div>
  );
}; 