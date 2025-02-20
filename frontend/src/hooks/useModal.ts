import { TagConfig } from '@/types/monitoring';
import { useState } from 'react';

interface ModalState {
  addMachine: {
    isOpen: boolean;
  };
  tagModal: {
    isOpen: boolean;
    selectedTag: string;
    editingTagConfig: TagConfig | null;
  };
  confirm: {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  };
}

type ModalType = keyof ModalState;

const initialState: ModalState = {
  addMachine: {
    isOpen: false,
  },
  tagModal: {
    isOpen: false,
    selectedTag: '',
    editingTagConfig: null,
  },
  confirm: {
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  },
};

export function useModal() {
  const [modalState, setModalState] = useState<ModalState>(initialState);

  const openModal = (type: ModalType, data: Partial<ModalState[typeof type]> = {}) => {
    setModalState((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        ...data,
        isOpen: true,
      },
    }));
  };

  const closeModal = (type: ModalType) => {
    setModalState((prev) => ({
      ...prev,
      [type]: {
        ...initialState[type],
      },
    }));
  };

  return {
    modalState,
    openModal,
    closeModal,
  };
} 