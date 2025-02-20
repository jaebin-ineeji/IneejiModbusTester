import { MachineConfig as IMachineConfig, Permission, TagConfig, TagType } from '@/types/monitoring';
import { useEffect, useRef } from 'react';

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.scrollBehavior = 'smooth';
      scrollContainerRef.current.scrollTop = 0;
      // 스크롤 동작이 끝난 후 기본값으로 복원
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.style.scrollBehavior = 'auto';
        }
      }, 300);
    }
  }, [selectedMachine]);

  if (!selectedMachine) {
    return (
      <div className="h-full flex items-center justify-center bg-white p-4 rounded-lg shadow">
        <div className="text-center text-gray-500">기계를 선택해주세요.</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white p-4 rounded-lg shadow">
      <div className="shrink-0 flex justify-between items-center mb-6 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-2 h-12 bg-blue-500 rounded-full"></div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{selectedMachine}</h2>
            <p className="text-sm text-gray-500 mt-0.5">기계 설정 및 태그 관리</p>
          </div>
        </div>
        <button
          onClick={onAddTag}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          태그 추가
        </button>
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto min-h-0">
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
                        <span className={`px-2 py-0.5 text-xs rounded-full flex items-center gap-1 ${
                          tagConfig.tag_type === TagType.ANALOG 
                            ? 'bg-purple-50 text-purple-600' 
                            : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {tagConfig.tag_type === TagType.ANALOG ? (
                            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          )}
                          {tagConfig.tag_type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">레지스터:</span>
                          <div className="flex items-center gap-1">
                            <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono text-xs">
                              {tagConfig.logical_register}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono text-xs">
                              {tagConfig.real_register}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">권한:</span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            tagConfig.permission === Permission.READ
                              ? 'bg-blue-50 text-blue-600'
                              : 'bg-amber-50 text-amber-600'
                          }`}>
                            {tagConfig.permission === Permission.READ ? (
                              <div className="flex items-center gap-1">
                                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                                읽기 전용
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                읽기/쓰기
                              </div>
                            )}
                          </span>
                        </div>
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