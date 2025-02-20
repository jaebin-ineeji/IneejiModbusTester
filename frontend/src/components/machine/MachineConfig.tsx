import { MachineConfig as IMachineConfig, TagConfig } from '@/types/monitoring';

interface MachineConfigProps {
  selectedMachine: string;
  machineConfig: IMachineConfig | null;
  onAddTag: () => void;
  onEditTag: (tagName: string, tagConfig: TagConfig) => void;
  onDeleteTag: (tagName: string) => void;
}

export function MachineConfig({
  selectedMachine,
  machineConfig,
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
        <button
          onClick={onAddTag}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          태그 추가
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="space-y-4">
          {machineConfig && (
            <div className="sticky top-0 z-0 bg-white pb-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-2">{selectedMachine} 기본 정보</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <span className="text-gray-600 block text-sm mb-1">IP 주소</span>
                    <span className="font-medium">{machineConfig.ip}</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <span className="text-gray-600 block text-sm mb-1">포트</span>
                    <span className="font-medium">{machineConfig.port}</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <span className="text-gray-600 block text-sm mb-1">슬레이브</span>
                    <span className="font-medium">{machineConfig.slave}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-medium text-lg">태그 목록</h3>
            <div className="grid gap-3">
              {machineConfig &&
                Object.entries(machineConfig.tags).map(([tagName, tagConfig]) => (
                  <div
                    key={tagName}
                    className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-colors shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-blue-600">{tagName}</span>
                        <span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full">
                          {tagConfig.tag_type}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 space-x-2">
                        <span>논리 레지스터: {tagConfig.logical_register}</span>
                        <span>•</span>
                        <span>실제 레지스터: {tagConfig.real_register}</span>
                        <span>•</span>
                        <span>권한: {tagConfig.permission}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEditTag(tagName, tagConfig)}
                        className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => onDeleteTag(tagName)}
                        className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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