import { Permission, TagType } from '@/types/monitoring';
import { useEffect, useState } from 'react';

interface TagFormData {
  name: string;
  tag_type: TagType;
  logical_register: string;
  real_register: string;
  permission: Permission;
}

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TagFormData) => void;
  editMode?: boolean;
  initialData?: TagFormData;
}

export function TagModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editMode = false,
  initialData
}: TagModalProps) {
  const [formData, setFormData] = useState<TagFormData>({
    name: '',
    tag_type: TagType.ANALOG,
    logical_register: '',
    real_register: '',
    permission: Permission.READ,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }

    return () => {
      setFormData({
        name: '',
        tag_type: TagType.ANALOG,
        logical_register: '',
        real_register: '',
        permission: Permission.READ,
      });
    };
  }, [initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[500px]">
        <h2 className="text-lg font-medium mb-4">
          {editMode ? '태그 수정' : '태그 추가'}
        </h2>
        <div className="space-y-4">
          {!editMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                태그 이름
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              태그 타입
            </label>
            <select
              value={formData.tag_type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tag_type: e.target.value as TagType,
                })
              }
              className="w-full px-3 py-2 border rounded"
            >
              {Object.values(TagType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              논리 레지스터
            </label>
            <input
              type="text"
              value={formData.logical_register}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  logical_register: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              실제 레지스터
            </label>
            <input
              type="text"
              value={formData.real_register}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  real_register: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              권한
            </label>
            <select
              value={formData.permission}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  permission: e.target.value as Permission,
                })
              }
              className="w-full px-3 py-2 border rounded"
            >
              {Object.values(Permission).map((permission) => (
                <option key={permission} value={permission}>
                  {permission}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            취소
          </button>
          <button
            onClick={() => onSubmit(formData)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {editMode ? '수정' : '추가'}
          </button>
        </div>
      </div>
    </div>
  );
} 