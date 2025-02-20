import { ConfirmModal } from '@/components/common/ConfirmModal';
import { MachineConfig as MachineConfigComponent } from '@/components/machine/MachineConfig';
import { MachineList } from '@/components/machine/MachineList';
import { AddMachineModal } from '@/components/machine/modals/AddMachineModal';
import { TagModal } from '@/components/machine/modals/TagModal';
import { useApiOperation } from '@/hooks/useApiOperation';
import { useMachineSettings } from '@/hooks/useMachineSettings';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import { Permission, TagType } from '@/types/monitoring';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

interface MachineFormData {
  name: string;
  ip: string;
  port: number;
  slave: number;
}

interface TagFormData {
  name: string;
  tag_type: TagType;
  logical_register: string;
  real_register: string;
  permission: Permission;
}

export function Settings() {
  const {
    machines,
    selectedMachine,
    machineConfig,
    error,
    setSelectedMachine,
    fetchMachines,
    fetchMachineConfig,
    addMachine,
    deleteMachine,
    addTag,
    updateTag,
    deleteTag,
  } = useMachineSettings();

  const { showToast } = useToast();
  const { modalState, openModal, closeModal } = useModal();
  const { handleOperation } = useApiOperation();

  useEffect(() => {
    fetchMachines();
  }, [fetchMachines]);

  useEffect(() => {
    if (selectedMachine) {
      fetchMachineConfig();
    }
  }, [selectedMachine, fetchMachineConfig]);

  useEffect(() => {
    if (error) {
      showToast(error, 'error');
    }
  }, [error, showToast]);

  const handleAddMachine = (formData: MachineFormData) => {
    handleOperation(
      () => addMachine(formData),
      '기계가 추가되었습니다.',
      () => closeModal('addMachine')
    );
  };

  const handleAddTag = (formData: TagFormData) => {
    handleOperation(
      () =>
        addTag(formData.name, {
          tag_type: formData.tag_type,
          logical_register: formData.logical_register,
          real_register: formData.real_register,
          permission: formData.permission,
        }),
      '태그가 추가되었습니다.',
      () => closeModal('tagModal')
    );
  };

  const handleUpdateTag = (formData: TagFormData) => {
    openModal('confirm', {
      title: '태그 수정',
      message: '정말로 이 태그를 수정하시겠습니까?',
      onConfirm: () => {
        handleOperation(
          () =>
            updateTag(modalState.tagModal.selectedTag, {
              tag_type: formData.tag_type,
              logical_register: formData.logical_register,
              real_register: formData.real_register,
              permission: formData.permission,
            }),
          '태그가 수정되었습니다.',
          () => {
            closeModal('tagModal');
            closeModal('confirm');
          }
        );
      },
    });
  };

  const handleDeleteTag = (tagName: string) => {
    openModal('confirm', {
      title: '태그 삭제',
      message: '정말로 이 태그를 삭제하시겠습니까?',
      onConfirm: () => {
        handleOperation(
          () => deleteTag(tagName),
          '태그가 삭제되었습니다.',
          () => closeModal('confirm')
        );
      },
    });
  };

  const handleDeleteMachine = () => {
    openModal('confirm', {
      title: '기계 삭제',
      message: '정말로 이 기계를 삭제하시겠습니까? 모든 태그 정보가 함께 삭제됩니다.',
      onConfirm: () => {
        handleOperation(
          () => deleteMachine(),
          '기계가 삭제되었습니다.',
          () => closeModal('confirm')
        );
      },
    });
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-100">
      <div className="flex justify-between items-center p-4 bg-white border-b shadow-sm">
        <h1 className="text-xl font-bold">기계 설정</h1>
        <Link
          to="/"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          모니터링으로 돌아가기
        </Link>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 p-6 min-h-0 bg-gray-50">
        <div className="col-span-4 h-full min-h-0">
          <MachineList
            machines={machines}
            selectedMachine={selectedMachine}
            onSelectMachine={setSelectedMachine}
            onAddMachine={() => openModal('addMachine')}
            onDeleteMachine={handleDeleteMachine}
          />
        </div>

        <div className="col-span-8 h-full min-h-0">
          <MachineConfigComponent
            selectedMachine={selectedMachine}
            machineConfig={machineConfig}
            onAddTag={() => openModal('tagModal')}
            onEditTag={(tagName, tagConfig) =>
              openModal('tagModal', { selectedTag: tagName, editingTagConfig: tagConfig })
            }
            onDeleteTag={handleDeleteTag}
          />
        </div>
      </div>

      <AddMachineModal
        isOpen={modalState.addMachine.isOpen}
        onClose={() => closeModal('addMachine')}
        onAdd={handleAddMachine}
      />

      <TagModal
        isOpen={modalState.tagModal.isOpen}
        onClose={() => closeModal('tagModal')}
        onSubmit={modalState.tagModal.editingTagConfig ? handleUpdateTag : handleAddTag}
        editMode={!!modalState.tagModal.editingTagConfig}
        initialData={
          modalState.tagModal.editingTagConfig
            ? {
                name: modalState.tagModal.selectedTag,
                ...modalState.tagModal.editingTagConfig,
              }
            : undefined
        }
      />

      <ConfirmModal
        isOpen={modalState.confirm.isOpen}
        title={modalState.confirm.title}
        message={modalState.confirm.message}
        onConfirm={modalState.confirm.onConfirm}
        onCancel={() => closeModal('confirm')}
      />
    </div>
  );
} 