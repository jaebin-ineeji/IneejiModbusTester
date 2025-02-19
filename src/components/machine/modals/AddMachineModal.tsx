import { useState } from 'react';

interface MachineFormData {
  name: string;
  ip: string;
  port: number;
  slave: number;
}

interface AddMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: MachineFormData) => void;
}

export function AddMachineModal({ isOpen, onClose, onAdd }: AddMachineModalProps) {
  const [formData, setFormData] = useState<MachineFormData>({
    name: '',
    ip: '',
    port: 502,
    slave: 1,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[500px]">
        <h2 className="text-lg font-medium mb-4">기계 추가</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기계 이름
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IP 주소
            </label>
            <input
              type="text"
              value={formData.ip}
              onChange={(e) =>
                setFormData({ ...formData, ip: e.target.value })
              }
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Port
            </label>
            <input
              type="number"
              value={formData.port}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  port: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slave
            </label>
            <input
              type="number"
              value={formData.slave}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  slave: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border rounded"
            />
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
            onClick={() => onAdd(formData)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
} 