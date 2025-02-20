import DongwonLogo from '@/assets/dongwon_logo.jpg';
import { MachineManager } from '@/components/MachineManager';
import { MonitoringGrid } from '@/components/monitoring/MonitoringGrid';
import { ControlModal } from '@/components/monitoring/modals/ControlModal';
import { machineApi } from '@/services/api';
import { useMachineStore } from '@/store/machine';
import { useModalStore } from '@/store/modal';
import { useWebSocketStore } from '@/store/websocket';
import { MonitoringRequest } from '@/types/monitoring';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function MonitoringPage() {
  const { 
    selectedMachines,
    monitoringRequest,
    machineTagsMap,
    setSelectedMachines,
    updateMonitoringRequest,
    updateMachineConfig,
    updateMachinePositions,
    isLayoutMode,
    setIsLayoutMode,
  } = useMachineStore();
  
  const { isConnected, connect, reconnect, monitoringData, error, sendMessage } = useWebSocketStore();
  const { isControlModalOpen, selectedMachine, machineData, closeControlModal } = useModalStore();

  useEffect(() => {
    connect();
    return () => {
      // 컴포넌트가 언마운트될 때는 연결을 끊지 않습니다.
      // 전역 상태로 관리되므로 다른 페이지에서도 연결 상태를 유지합니다.
    };
  }, [connect]);

  // 모니터링 요청이 변경될 때마다 웹소켓으로 전송
  useEffect(() => {
    if (isConnected && Object.keys(monitoringRequest).length > 0) {
      sendMessage(monitoringRequest);
    }
  }, [monitoringRequest, isConnected, sendMessage]);

  useEffect(() => {
    const fetchInitialMachines = async () => {
      try {        
        if (selectedMachines.length > 0 && Object.keys(machineTagsMap).length > 0) {
          await loadSavedMachineConfigs();
          loadSavedMonitoringRequest();
        } 
        else {
          await loadDefaultMachines(selectedMachines);
        }
      } catch (error) {
        console.error('초기 기계 목록을 가져오는데 실패했습니다:', error);
      }
    };

    fetchInitialMachines();
  }, []);

  const loadSavedMachineConfigs = async () => {
    const configPromises = selectedMachines.map(async (machine) => {
      if (!machineTagsMap[machine]?.config) {
        try {
          const config = await machineApi.getMachineConfig(machine);
          updateMachineConfig(machine, config);
        } catch (error) {
          console.error(`${machine} 설정을 가져오는데 실패했습니다:`, error);
        }
      }
    });
    
    await Promise.all(configPromises);
  };

  const loadSavedMonitoringRequest = () => {
    if (Object.keys(monitoringRequest).length === 0) {
      const newRequest: MonitoringRequest = {};
      Object.entries(machineTagsMap).forEach(([machine, { selectedTags }]) => {
        newRequest[machine] = selectedTags;
      });
      updateMonitoringRequest(newRequest);
    }
  };

  const loadDefaultMachines = async (machines: string[]) => {
    const defaultMachines = machines;
    setSelectedMachines(defaultMachines);
    
    // 기본 위치 설정
    const defaultPositions: Record<string, { x: number; y: number; width: number; height: number }> = {};
    defaultMachines.forEach((machine, index) => {
      // 그리드 형태로 초기 배치
      const row = Math.floor(index / 10);
      const col = index % 10;
      defaultPositions[machine] = {
        x: col * 170, // 여백 포함 너비
        y: row * 170, // 여백 포함 높이
        width: 150,
        height: 150
      };
    });
    updateMachinePositions(defaultPositions);
    
    const configPromises = defaultMachines.map(async (machine) => {
      try {
        const config = await machineApi.getMachineConfig(machine);
        updateMachineConfig(machine, config);
      } catch (error) {
        console.error(`${machine} 설정을 가져오는데 실패했습니다:`, error);
      }
    });
    
    await Promise.all(configPromises);
    
    const newRequest: MonitoringRequest = {};
    defaultMachines.forEach(machine => {
      if (machineTagsMap[machine]) {
        newRequest[machine] = machineTagsMap[machine].selectedTags;
      }
    });
    updateMonitoringRequest(newRequest);
  };

  const handleMonitoringRequestChange = (newRequest: MonitoringRequest) => {
    updateMonitoringRequest(newRequest);
    setSelectedMachines(Object.keys(newRequest));
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex justify-between items-center p-4">
        <img src={DongwonLogo} alt="동원시스템즈 로고" className="h-10" />
        <h1 className="text-2xl font-bold tracking-tight font-spoqa">동원시스템즈 유리 용해로 제어 테스트</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isConnected ? '연결됨' : '연결 끊김'}
            </div>
            {!isConnected && (
              <button
                onClick={reconnect}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                재연결
              </button>
            )}
          </div>
          <Link
            to="/settings"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            설정
          </Link>
          <MachineManager
            onMachinesChange={handleMonitoringRequestChange}
          />
          <button
            onClick={() => setIsLayoutMode(!isLayoutMode)}
            className={`px-4 py-2 ${isLayoutMode ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded hover:bg-blue-600`}
          >
            {isLayoutMode ? '레이아웃 수정 완료' : '레이아웃 수정'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex-1">
        <MonitoringGrid
          data={monitoringData?.data || {}}
          isConnected={isConnected}
          isLayoutMode={isLayoutMode}
        />
      </div>

      {isControlModalOpen && selectedMachine && machineData && (
        <ControlModal
          isOpen={true}
          onClose={closeControlModal}
          machineName={selectedMachine}
          machineData={machineData}
        />
      )}
    </div>
  );
} 