import { MachineData } from '@/types/monitoring';
import { create } from 'zustand';

interface ModalStore {
  isControlModalOpen: boolean;
  selectedMachine: string | null;
  machineData: MachineData | null;
  openControlModal: (machineName: string, data: MachineData) => void;
  closeControlModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isControlModalOpen: false,
  selectedMachine: null,
  machineData: null,
  openControlModal: (machineName, data) => 
    set({ 
      isControlModalOpen: true, 
      selectedMachine: machineName,
      machineData: data 
    }),
  closeControlModal: () => 
    set({ 
      isControlModalOpen: false, 
      selectedMachine: null,
      machineData: null 
    }),
})); 