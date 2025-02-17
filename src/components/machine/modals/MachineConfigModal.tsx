import { IoClose } from 'react-icons/io5';
import { MachineConfig } from '../../../types/monitoring';
import { MachineList } from './MachineList';

interface MachineConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableMachines: string[];
  selectedMachines: string[];
  machineTagsMap: Record<string, { config?: MachineConfig; selectedTags: string[] }>;
  onToggleMachine: (machine: string) => void;
  onToggleTag: (machine: string, tag: string) => void;
  onApply: () => void;
}

export function MachineConfigModal({
  isOpen,
  onClose,
  availableMachines,
  selectedMachines,
  machineTagsMap,
  onToggleMachine,
  onToggleTag,
  onApply,
}: MachineConfigModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[1000px] max-h-[80vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-medium">기계 및 태그 설정</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>
        
        {/* 본문 */}
        <div className="flex-1 min-h-0 p-6">
          <MachineList
            availableMachines={availableMachines}
            selectedMachines={selectedMachines}
            machineTagsMap={machineTagsMap}
            onToggleMachine={onToggleMachine}
            onToggleTag={onToggleTag}
          />
        </div>

        {/* 푸터 */}
        <div className="border-t px-6 py-4 flex justify-end gap-2 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            onClick={onApply}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            적용
          </button>
        </div>
      </div>
    </div>
  );
} 