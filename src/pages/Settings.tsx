import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Toast } from '@/components/common/Toast';
import { MachineConfig as MachineConfigComponent } from '@/components/machine/MachineConfig';
import { MachineList } from '@/components/machine/MachineList';
import { AddMachineModal } from '@/components/machine/modals/AddMachineModal';
import { TagModal } from '@/components/machine/modals/TagModal';
import { useMachineSettings } from '@/hooks/useMachineSettings';
import { useToast } from '@/hooks/useToast';
import { Permission, TagConfig, TagType } from '@/types/monitoring';
import { useEffect, useState } from 'react';
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

  const { toast, showToast, hideToast } = useToast();

  const [isAddingMachine, setIsAddingMachine] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isEditingTag, setIsEditingTag] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [editingTagConfig, setEditingTagConfig] = useState<TagConfig | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

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
  }, [error]);

  const handleAddMachine = async (formData: MachineFormData) => {
    const success = await addMachine(formData);
    if (success) {
      setIsAddingMachine(false);
      showToast('기계가 추가되었습니다.', 'success');
    }
  };

  const handleAddTag = async (formData: TagFormData) => {
    const success = await addTag(formData.name, {
      tag_type: formData.tag_type,
      logical_register: formData.logical_register,
      real_register: formData.real_register,
      permission: formData.permission,
    });
    if (success) {
      setIsAddingTag(false);
      showToast('태그가 추가되었습니다.', 'success');
    }
  };

  const handleUpdateTag = async (formData: TagFormData) => {
    setConfirmModal({
      isOpen: true,
      title: '태그 수정',
      message: '정말로 이 태그를 수정하시겠습니까?',
      onConfirm: async () => {
        const success = await updateTag(selectedTag, {
          tag_type: formData.tag_type,
          logical_register: formData.logical_register,
          real_register: formData.real_register,
          permission: formData.permission,
        });
        if (success) {
          setIsEditingTag(false);
          setSelectedTag('');
          setEditingTagConfig(null);
          showToast('태그가 수정되었습니다.', 'success');
        }
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleDeleteTag = (tagName: string) => {
    setConfirmModal({
      isOpen: true,
      title: '태그 삭제',
      message: '정말로 이 태그를 삭제하시겠습니까?',
      onConfirm: async () => {
        const success = await deleteTag(tagName);
        if (success) {
          showToast('태그가 삭제되었습니다.', 'success');
        }
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleEditTag = (tagName: string, tagConfig: TagConfig) => {
    setSelectedTag(tagName);
    setEditingTagConfig(tagConfig);
    setIsEditingTag(true);
  };

  const handleDeleteMachine = () => {
    setConfirmModal({
      isOpen: true,
      title: '기계 삭제',
      message: '정말로 이 기계를 삭제하시겠습니까? 모든 태그 정보가 함께 삭제됩니다.',
      onConfirm: async () => {
        const success = await deleteMachine();
        if (success) {
          showToast('기계가 삭제되었습니다.', 'success');
        }
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">기계 설정</h1>
        <Link
          to="/"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          모니터링으로 돌아가기
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <MachineList
          machines={machines}
          selectedMachine={selectedMachine}
          onSelectMachine={setSelectedMachine}
          onAddMachine={() => setIsAddingMachine(true)}
        />

        <MachineConfigComponent
          selectedMachine={selectedMachine}
          machineConfig={machineConfig}
          onDeleteMachine={handleDeleteMachine}
          onAddTag={() => setIsAddingTag(true)}
          onEditTag={handleEditTag}
          onDeleteTag={handleDeleteTag}
        />
      </div>

      <AddMachineModal
        isOpen={isAddingMachine}
        onClose={() => setIsAddingMachine(false)}
        onAdd={handleAddMachine}
      />

      <TagModal
        isOpen={isAddingTag || isEditingTag}
        onClose={() => {
          setIsAddingTag(false);
          setIsEditingTag(false);
          setSelectedTag('');
          setEditingTagConfig(null);
        }}
        onSubmit={isEditingTag ? handleUpdateTag : handleAddTag}
        editMode={isEditingTag}
        initialData={
          editingTagConfig
            ? {
                name: selectedTag,
                ...editingTagConfig,
              }
            : undefined
        }
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
} 