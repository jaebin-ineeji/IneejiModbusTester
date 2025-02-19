import { MachineConfigModal } from '@/components/machine/modals/MachineConfigModal';
import { machineApi } from '@/services/api';
import { useMachineStore } from '@/store/machine';
import { MonitoringRequest } from '@/types/monitoring';
import { useEffect, useState } from 'react';

interface MachineManagerProps {
  onMachinesChange: (request: MonitoringRequest) => void;
}

export function MachineManager({ onMachinesChange }: MachineManagerProps) {
  const [availableMachines, setAvailableMachines] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const {
    selectedMachines,
    machineTagsMap,
    setSelectedMachines,
    updateMachineConfig,
    updateSelectedTags,
    removeMachine,
    updateMonitoringRequest
  } = useMachineStore();

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        setLoading(true);
        const machines = await machineApi.getMachineList();
        setAvailableMachines(machines);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '기계 목록을 가져오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMachines();
    handleApply();
  }, []);

  const handleToggleMachine = async (machine: string) => {
    const isSelected = selectedMachines.includes(machine);
    let newSelectedMachines: string[];
    
    if (isSelected) {
      newSelectedMachines = selectedMachines.filter(m => m !== machine);
      removeMachine(machine);
    } else {
      try {
        const config = await machineApi.getMachineConfig(machine);
        const availableTags = ['RM', 'AM', 'PV', 'SV', 'RT', 'MV'].filter(tag => 
          config.tags[tag]
        );
        newSelectedMachines = [...selectedMachines, machine];
        updateMachineConfig(machine, config, true);
        updateSelectedTags(machine, availableTags);
      } catch (error) {
        console.error(`${machine} 설정을 가져오는데 실패했습니다:`, error);
        return;
      }
    }
    
    setSelectedMachines(newSelectedMachines);
  };

  const handleToggleTag = (machine: string, tag: string) => {
    const machineData = machineTagsMap[machine];
    if (!machineData?.config) return;

    const selectedTags = machineData.selectedTags || [];
    const isSelected = selectedTags.includes(tag);
    const newTags = isSelected
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];

    updateSelectedTags(machine, newTags);
  };

  const handleApply = () => {
    const newRequest: MonitoringRequest = {};
    Object.entries(machineTagsMap).forEach(([machine, { selectedTags }]) => {
      newRequest[machine] = selectedTags;
    });
    updateMonitoringRequest(newRequest);
    onMachinesChange(newRequest);
    setIsOpen(false);
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={loading}
      >
        기계 관리
      </button>

      <MachineConfigModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        availableMachines={availableMachines}
        selectedMachines={selectedMachines}
        machineTagsMap={machineTagsMap}
        onToggleMachine={handleToggleMachine}
        onToggleTag={handleToggleTag}
        onApply={handleApply}
      />
    </div>
  );
} 