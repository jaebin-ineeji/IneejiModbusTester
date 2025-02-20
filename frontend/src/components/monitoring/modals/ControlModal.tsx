import { machineApi } from '@/services/api';
import { useMachineStore } from '@/store/machine';
import { MachineData, Permission, TagType } from '@/types/monitoring';
import { useState } from 'react';

interface ControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  machineName: string;
  machineData: MachineData;
}

export const ControlModal = ({ isOpen, onClose, machineName, machineData }: ControlModalProps) => {
  const { machineTagsMap } = useMachineStore();
  const [controlValues, setControlValues] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const machineConfig = machineTagsMap[machineName]?.config;
  const selectedTags = machineTagsMap[machineName]?.selectedTags || [];

  const writableTags = selectedTags.filter(tag => 
    machineConfig?.tags[tag]?.permission === Permission.READ_WRITE
  );

  const getTagType = (tag: string) => machineConfig?.tags[tag]?.tag_type;

  const getNextValue = (tag: string, currentValue?: string | number) => {
    const tagType = getTagType(tag);
    const value = currentValue ?? machineData[tag];

    switch (tagType) {
      case TagType.DIGITAL_RM:
        return value === 'REMOTE' ? 'LOCAL' : 'REMOTE';
      case TagType.DIGITAL_AM:
        return value === 'AUTO' ? 'MANUAL' : 'AUTO';
      case TagType.DIGITAL:
        return Number(value) === 1 ? '0' : '1';
      default:
        return value.toString();
    }
  };

  const getButtonText = (tag: string) => {
    const tagType = getTagType(tag);
    const currentValue = controlValues[tag] || machineData[tag];

    switch (tagType) {
      case TagType.DIGITAL_RM:
      case TagType.DIGITAL_AM:
        return `${currentValue}`;
      case TagType.DIGITAL:
        return Number(currentValue) === 1 ? 'ON → OFF' : 'OFF → ON';
      default:
        return '';
    }
  };

  const handleValueChange = (tag: string, value: string) => {
    setControlValues(prev => ({
      ...prev,
      [tag]: value
    }));
    setError(null);
  };

  const handleToggleDigital = (tag: string) => {
    const currentValue = controlValues[tag] || machineData[tag];
    const nextValue = getNextValue(tag, currentValue);
    if (controlValues[tag] === nextValue) {
      handleValueChange(tag, '');  // 같은 버튼을 두 번 누르면 취소
    } else {
      handleValueChange(tag, nextValue);
    }
  };

  const renderTagInput = (tag: string) => {
    const tagType = getTagType(tag);
    if (tagType === TagType.DIGITAL || tagType === TagType.DIGITAL_AM || tagType === TagType.DIGITAL_RM) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-gray-600">현재값: {machineData[tag]}</span>
          <button
            className={`px-3 py-1 rounded ${
              !controlValues[tag] || controlValues[tag] === machineData[tag] ? 'bg-gray-500' : 'bg-blue-500'
            } text-white hover:opacity-80`}
            onClick={() => handleToggleDigital(tag)}
            disabled={isSubmitting}
          >
            {getButtonText(tag)}
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <span className="text-gray-600">현재값: {machineData[tag]}</span>
        <input
          type="text"
          className="border rounded px-2 py-1 w-24"
          value={controlValues[tag] || ''}
          onChange={(e) => handleValueChange(tag, e.target.value)}
          placeholder={`${machineData[tag]}`}
          disabled={isSubmitting}
        />
      </div>
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const promises = Object.entries(controlValues).map(async ([tag, value]) => {
        if (machineConfig?.tags[tag]?.permission === Permission.READ_WRITE && value) {
          await machineApi.setTagValue(machineName, tag, value);
        }
      });

      await Promise.all(promises);
      setControlValues({});  // 초기화
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '제어 명령 실패');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">{machineName} 제어</h2>
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {writableTags.length > 0 ? (
          <div className="space-y-4">
            {writableTags.map(tag => (
              <div key={tag} className="flex items-center justify-between">
                <label className="font-medium">{tag}</label>
                {renderTagInput(tag)}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-4">
            제어 가능한 태그가 없습니다.
          </div>
        )}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
            disabled={writableTags.length === 0 || isSubmitting || Object.keys(controlValues).length === 0}
          >
            {isSubmitting ? '처리 중...' : '적용'}
          </button>
        </div>
      </div>
    </div>
  );
}; 