import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MachineConfig, MachinePosition, MachinePositions, MonitoringRequest } from '../types/monitoring';

interface MachineStore {
  selectedMachines: string[];
  machineTagsMap: Record<string, { selectedTags: string[]; config?: MachineConfig }>;
  monitoringRequest: MonitoringRequest;
  machinePositions: MachinePositions;
  isLayoutMode: boolean;
  setSelectedMachines: (machines: string[]) => void;
  updateMachineConfig: (machine: string, config: MachineConfig) => void;
  updateSelectedTags: (machine: string, tags: string[]) => void;
  removeMachine: (machine: string) => void;
  updateMonitoringRequest: (request: MonitoringRequest) => void;
  updateMachinePosition: (machine: string, position: MachinePosition) => void;
  updateMachinePositions: (positions: MachinePositions) => void;
  setIsLayoutMode: (isLayoutMode: boolean) => void;
}

export const useMachineStore = create<MachineStore>()(
  persist(
    (set) => ({
      selectedMachines: [],
      machineTagsMap: {},
      monitoringRequest: {},
      machinePositions: {},
      isLayoutMode: false,

      setSelectedMachines: (machines) => set({ selectedMachines: machines }),
      
      updateMachineConfig: (machine, config) =>
        set((state) => ({
          machineTagsMap: {
            ...state.machineTagsMap,
            [machine]: {
              ...state.machineTagsMap[machine],
              config,
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
          const { [machine]: _, ...rest } = state.machineTagsMap;
          const { [machine]: __, ...restPositions } = state.machinePositions;
          return {
            machineTagsMap: rest,
            machinePositions: restPositions,
            selectedMachines: state.selectedMachines.filter((m: string) => m !== machine),
          };
        }),
      
      updateMonitoringRequest: (request) =>
        set({ monitoringRequest: request }),
      
      updateMachinePosition: (machine, position) =>
        set((state) => ({
          machinePositions: {
            ...state.machinePositions,
            [machine]: position,
          },
        })),

      updateMachinePositions: (positions) =>
        set((state) => ({
          machinePositions: {
            ...state.machinePositions,
            ...positions,
          },
        })),

      setIsLayoutMode: (isLayoutMode) => set({ isLayoutMode }),
    }),
    {
      name: 'machine-storage',
    }
  )
); 