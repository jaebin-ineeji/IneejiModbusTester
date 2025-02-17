import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MachineConfig, MonitoringRequest } from '../types/monitoring';

interface MachineTagsMap {
  [machine: string]: {
    config: MachineConfig;
    selectedTags: string[];
  };
}

interface MachineStore {
  selectedMachines: string[];
  machineTagsMap: MachineTagsMap;
  monitoringRequest: MonitoringRequest;
  setSelectedMachines: (machines: string[]) => void;
  setMachineTagsMap: (map: MachineTagsMap) => void;
  updateMachineConfig: (machine: string, config: MachineConfig) => void;
  updateSelectedTags: (machine: string, tags: string[]) => void;
  removeMachine: (machine: string) => void;
  updateMonitoringRequest: (request: MonitoringRequest) => void;
}

export const useMachineStore = create<MachineStore>()(
  persist(
    (set) => ({
      selectedMachines: [],
      machineTagsMap: {},
      monitoringRequest: {},

      setSelectedMachines: (machines) => set({ selectedMachines: machines }),
      
      setMachineTagsMap: (map) => set({ machineTagsMap: map }),
      
      updateMachineConfig: (machine, config) =>
        set((state) => ({
          machineTagsMap: {
            ...state.machineTagsMap,
            [machine]: {
              config,
              selectedTags: state.machineTagsMap[machine]?.selectedTags || ['PV', 'SV', 'RT', 'MV', 'RM', 'AM'],
            },
          },
        })),
      
      updateSelectedTags: (machine, tags) =>
        set((state) => ({
          machineTagsMap: {
            ...state.machineTagsMap,
            [machine]: {
              ...state.machineTagsMap[machine],
              selectedTags: tags,
            },
          },
        })),
      
      removeMachine: (machine) =>
        set((state) => {
          const { [machine]: omitted, ...rest } = state.machineTagsMap; // eslint-disable-line @typescript-eslint/no-unused-vars
          return {
            machineTagsMap: rest,
            selectedMachines: state.selectedMachines.filter((m) => m !== machine),
          };
        }),
      
      updateMonitoringRequest: (request) =>
        set({ monitoringRequest: request }),
    }),
    {
      name: 'machine-storage',
    }
  )
); 