import { MachineConfig as IMachineConfig, TagConfig } from '@/types/monitoring';

interface MachineConfigProps {
  selectedMachine: string;
  machineConfig: IMachineConfig | null;
  onDeleteMachine: () => void;
  onAddTag: () => void;
  onEditTag: (tagName: string, tagConfig: TagConfig) => void;
  onDeleteTag: (tagName: string) => void;
}

export function MachineConfig({
  selectedMachine,
  machineConfig,
  onDeleteMachine,
  onAddTag,
  onEditTag,
  onDeleteTag,
}: MachineConfigProps) {
  if (!selectedMachine) {
    return (
      <div className="h-full flex items-center justify-center bg-white p-4 rounded-lg shadow">
        <div className="text-center text-gray-500">기계를 선택해주세요.</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white p-4 rounded-lg shadow">
      <div className="shrink-0 flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">{selectedMachine} 설정</h2>
        <div className="space-x-2">
          <button
            onClick={onAddTag}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            태그 추가
          </button>
          <button
            onClick={onDeleteMachine}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            기계 삭제
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="space-y-4">
          {machineConfig && (
            <div className="p-4 bg-gray-50 rounded">
              <h3 className="font-medium mb-2">기본 정보</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-gray-600">IP:</span> {machineConfig.ip}
                </div>
                <div>
                  <span className="text-gray-600">Port:</span> {machineConfig.port}
                </div>
                <div>
                  <span className="text-gray-600">Slave:</span> {machineConfig.slave}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-medium">태그 목록</h3>
            <div className="space-y-2">
              {machineConfig &&
                Object.entries(machineConfig.tags).map(([tagName, tagConfig]) => (
                  <div
                    key={tagName}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <span className="font-medium">{tagName}</span>
                      <div className="text-sm text-gray-600">
                        {tagConfig.tag_type} | {tagConfig.logical_register} |{' '}
                        {tagConfig.real_register} | {tagConfig.permission}
                      </div>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => onEditTag(tagName, tagConfig)}
                        className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => onDeleteTag(tagName)}
                        className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 