import { TagValue } from '@/components/monitoring/TagValue';
import { useMachineStore } from '@/store/machine';
import { useModalStore } from '@/store/modal';
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
  const { openControlModal, selectedMachine } = useModalStore();
  const selectedTags = machineTagsMap[machineName]?.selectedTags || [];

  const handleBoxClick = () => {
    if (isConnected) {
      openControlModal(machineName, machineData);
    }
  };

  const isSelected = selectedMachine === machineName;

  return (
    <div 
      className={`relative border-2 border-black p-2 rounded-lg bg-gray-50 shadow-md cursor-pointer hover:shadow-lg transition-all duration-500 ${
        selectedMachine ? (isSelected ? 'z-[99] opacity-100 border-4 scale-105 border-black' : 'opacity-30') : 'opacity-100'
      }`}
      onClick={handleBoxClick}
    >
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