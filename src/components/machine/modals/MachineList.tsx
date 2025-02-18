import { useState } from "react";
import { ImSpinner } from "react-icons/im";
import { IoMdSearch } from "react-icons/io";
import { IoClose, IoSettingsOutline } from "react-icons/io5";
import { MachineConfig } from "../../../types/monitoring";

interface MachineListProps {
  availableMachines: string[];
  selectedMachines: string[];
  machineTagsMap: Record<string, { config?: MachineConfig; selectedTags: string[] }>;
  onToggleMachine: (machine: string) => void;
  onToggleTag: (machine: string, tag: string) => void;
  loading?: boolean;
}

export function MachineList({
  availableMachines,
  selectedMachines,
  machineTagsMap,
  onToggleMachine,
  onToggleTag,
  loading = false
}: MachineListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMachineForTags, setSelectedMachineForTags] = useState<string | null>(null);
  
  const filteredMachines = availableMachines.filter(machine =>
    machine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 태그 설명
  const tagDescriptions: Record<string, string> = {
    RM: '원격/수동 모드',
    AM: '자동/수동 모드',
    PV: '현재 값',
    SV: '설정 값',
    MV: '출력 값'
  };

  return (
    <div className="flex gap-6 w-full">
      <div className="w-1/2 flex flex-col max-h-[calc(75vh-8rem)]">
        <h4 className="font-medium mb-2 flex-shrink-0">기계 목록</h4>
        
        {/* 검색 입력창 */}
        <div className="relative mb-4 flex-shrink-0">
          <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="기계 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* 기계 목록 */}
        <div className="overflow-y-auto flex-1 min-h-0">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <ImSpinner className="animate-spin text-2xl text-blue-500" />
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMachines.map(machine => {
                const isSelected = selectedMachines.includes(machine);
                const machineData = machineTagsMap[machine];
                const selectedTagCount = isSelected ? (machineData?.selectedTags?.length || 0) : 0;
                const isConfiguring = machine === selectedMachineForTags;
                
                return (
                  <div
                    key={machine}
                    className={`
                      flex items-center justify-between p-2 rounded-lg border transition-colors cursor-pointer
                      ${isSelected 
                        ? isConfiguring
                          ? 'bg-blue-100 border-blue-300'
                          : 'bg-blue-50 border-blue-200'
                        : 'border-gray-200 hover:bg-gray-50'}
                    `}
                    onClick={() => onToggleMachine(machine)}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        readOnly
                      />
                      <span className="text-sm text-gray-700">{machine}</span>
                    </div>
                    {isSelected && (
                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <span className="text-xs text-gray-500">
                          {selectedTagCount}개 태그 선택됨
                        </span>
                        <button
                          onClick={() => setSelectedMachineForTags(isConfiguring ? null : machine)}
                          className={`
                            p-1 rounded-lg transition-colors
                            ${isConfiguring
                              ? 'text-blue-600 bg-blue-200 hover:bg-blue-300'
                              : 'text-gray-400 hover:text-gray-600 hover:bg-blue-100'}
                          `}
                          title="태그 설정"
                        >
                          <IoSettingsOutline size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {filteredMachines.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-2 text-sm text-gray-500 flex-shrink-0">
          선택된 기계: {selectedMachines.length}개
        </div>
      </div>

      {/* 태그 설정 패널 */}
      {selectedMachineForTags && (
        <div className="w-1/2 flex flex-col max-h-[calc(75vh-8rem)]">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">{selectedMachineForTags} 태그 설정</h4>
            <button
              onClick={() => setSelectedMachineForTags(null)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
            >
              <IoClose size={20} />
            </button>
          </div>
          
          <div className="overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(machineTagsMap[selectedMachineForTags]?.config?.tags || {})
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([tag, config]) => {
                  const isSelected = machineTagsMap[selectedMachineForTags]?.selectedTags?.includes(tag);
                  
                  return (
                    <div
                      key={tag}
                      className={`
                        flex items-center p-3 rounded-lg border transition-colors cursor-pointer
                        ${isSelected
                          ? 'border-blue-200 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'}
                      `}
                      onClick={() => onToggleTag(selectedMachineForTags, tag)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        readOnly
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">{tag}</span>
                          {tagDescriptions[tag] && (
                            <div className="group relative">
                              <IoSettingsOutline className="text-gray-400 w-4 h-4" />
                              <div className="absolute bottom-2 -right-20 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                {tagDescriptions[tag]}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {config.permission}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 