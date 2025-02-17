import { MachineConfig } from '../../../types/monitoring';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-[800px] max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">기계 및 태그 설정</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="flex gap-4 flex-1 min-h-0">
          {/* 기계 목록 */}
          <div className="w-1/3 border-r pr-4 overflow-y-auto">
            <h4 className="font-medium mb-2">기계 목록</h4>
            {availableMachines.map(machine => (
              <div
                key={machine}
                className="flex items-center space-x-2 py-2"
              >
                <input
                  type="checkbox"
                  id={machine}
                  checked={selectedMachines.includes(machine)}
                  onChange={() => onToggleMachine(machine)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={machine} className="text-sm text-gray-700">
                  {machine}
                </label>
              </div>
            ))}
          </div>

          {/* 태그 목록 */}
          <div className="flex-1 overflow-y-auto">
            <h4 className="font-medium mb-2">태그 설정</h4>
            {selectedMachines.map(machine => {
              const machineData = machineTagsMap[machine];
              if (!machineData?.config) return null;

              const selectedTags = machineData.selectedTags || [];

              return (
                <div key={machine} className="mb-4">
                  <h5 className="font-medium text-sm text-gray-700 mb-2">{machine}</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(machineData.config.tags).map(([tag, config]) => (
                      <div key={tag} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`${machine}-${tag}`}
                          checked={selectedTags.includes(tag)}
                          onChange={() => onToggleTag(machine, tag)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={`${machine}-${tag}`} className="text-sm text-gray-700">
                          {tag} ({config.permission})
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            취소
          </button>
          <button
            onClick={onApply}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            적용
          </button>
        </div>
      </div>
    </div>
  );
} 