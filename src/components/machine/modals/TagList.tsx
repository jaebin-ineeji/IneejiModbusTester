import { IoMdInformationCircleOutline } from 'react-icons/io';
import { MachineConfig } from '../../../types/monitoring';

interface TagListProps {
  selectedMachines: string[];
  machineTagsMap: Record<string, { config?: MachineConfig; selectedTags: string[] }>;
  onToggleTag: (machine: string, tag: string) => void;
}

export function TagList({
  selectedMachines,
  machineTagsMap,
  onToggleTag
}: TagListProps) {
  // 태그 설명
  const tagDescriptions: Record<string, string> = {
    RM: '원격/수동 모드',
    AM: '자동/수동 모드',
    PV: '현재 값',
    SV: '설정 값',
    RT: '잔여 시간',
    MV: '출력 값'
  };

  const handleCheckboxClick = (e: React.MouseEvent, machine: string, tag: string) => {
    e.stopPropagation();
    onToggleTag(machine, tag);
  };

  return (
    <div className="flex-1 overflow-hidden px-4 flex flex-col max-h-[calc(80vh-8rem)]">
      <h4 className="font-medium mb-4 flex-shrink-0">태그 설정</h4>
      
      {selectedMachines.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          기계를 선택하면 태그 목록이 표시됩니다.
        </div>
      ) : (
        <div className="space-y-6 overflow-y-auto flex-1 min-h-0 pr-2">
          {selectedMachines.map(machine => {
            const machineData = machineTagsMap[machine];
            if (!machineData?.config) return null;

            const selectedTags = machineData.selectedTags || [];
            const sortedTags = Object.entries(machineData.config.tags)
              .sort(([a], [b]) => a.localeCompare(b));

            return (
              <div key={machine} className="bg-white rounded-lg p-4 shadow-sm border">
                <h5 className="font-medium text-gray-800 mb-3">{machine}</h5>
                <div className="grid grid-cols-2 gap-3">
                  {sortedTags.map(([tag, config]) => (
                    <div
                      key={tag}
                      className={`
                        flex items-center p-2 rounded-lg border transition-colors
                        ${selectedTags.includes(tag)
                          ? 'border-blue-200 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'}
                      `}
                      onClick={() => onToggleTag(machine, tag)}
                    >
                      <input
                        type="checkbox"
                        id={`${machine}-${tag}`}
                        checked={selectedTags.includes(tag)}
                        onClick={(e) => handleCheckboxClick(e, machine, tag)}
                        onChange={() => {}}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-2 flex-1">
                        <label
                          htmlFor={`${machine}-${tag}`}
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {tag}
                        </label>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <span>{config.permission}</span>
                          {tagDescriptions[tag] && (
                            <div className="group relative">
                              <IoMdInformationCircleOutline className="text-gray-400" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                {tagDescriptions[tag]}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 