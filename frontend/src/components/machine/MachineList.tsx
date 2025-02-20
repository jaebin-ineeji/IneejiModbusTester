interface MachineListProps {
  machines: string[];
  selectedMachine: string;
  onSelectMachine: (machine: string) => void;
  onAddMachine: () => void;
  onDeleteMachine: () => void;
  onImportConfig: () => void;
}

export function MachineList({
  machines,
  selectedMachine,
  onSelectMachine,
  onAddMachine,
  onDeleteMachine,
  onImportConfig,
}: MachineListProps) {
  return (
    <div className="h-full flex flex-col bg-white p-4 rounded-lg shadow">
      <div className="shrink-0 flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">기계 목록</h2>
        <div className="flex gap-2">
          <button
            onClick={onImportConfig}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            설정 가져오기
          </button>
          <button
            onClick={onAddMachine}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            추가
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="space-y-2 py-1">
          {machines.map(machine => (
            <div
              key={machine}
              className={`p-3 rounded-lg border flex items-center justify-between ${
                selectedMachine === machine
                  ? 'bg-blue-50 border-blue-200'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div
                className="flex-1 cursor-pointer"
                onClick={() => onSelectMachine(machine)}
              >
                {machine}
              </div>
              {selectedMachine === machine && (
                <button
                  onClick={onDeleteMachine}
                  className="ml-2 px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded border-2 border-red-300"
                >
                  삭제
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 