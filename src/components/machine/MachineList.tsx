interface MachineListProps {
  machines: string[];
  selectedMachine: string;
  onSelectMachine: (machine: string) => void;
  onAddMachine: () => void;
}

export function MachineList({
  machines,
  selectedMachine,
  onSelectMachine,
  onAddMachine,
}: MachineListProps) {
  return (
    <div className="h-full flex flex-col bg-white p-4 rounded-lg shadow">
      <div className="shrink-0 flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">기계 목록</h2>
        <button
          onClick={onAddMachine}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          추가
        </button>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="space-y-2 py-1">
          {machines.map(machine => (
            <div
              key={machine}
              className={`p-2 rounded cursor-pointer ${
                selectedMachine === machine
                  ? 'bg-blue-100 text-blue-800'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => onSelectMachine(machine)}
            >
              {machine}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 