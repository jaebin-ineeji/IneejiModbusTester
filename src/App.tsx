import { useEffect } from 'react';
import './App.css';
import { MachineManager } from './components/MachineManager';
import { useWebSocket } from './hooks/useWebSocket';
import { machineApi } from './services/api';
import { useMachineStore } from './store/machine';
import { MonitoringRequest } from './types/monitoring';

function App() {
  const { 
    selectedMachines,
    monitoringRequest,
    machineTagsMap,
    setSelectedMachines,
    updateMonitoringRequest,
    updateMachineConfig,
  } = useMachineStore();
  
  const { data, error, isConnected } = useWebSocket(monitoringRequest);

  useEffect(() => {
    const fetchInitialMachines = async () => {
      try {
        const machines = await machineApi.getMachineList();
        
        // 저장된 기계 정보가 있는 경우
        if (selectedMachines.length > 0 && Object.keys(machineTagsMap).length > 0) {
          // 저장된 기계들의 설정 정보 다시 불러오기
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
          
          // 저장된 모니터링 요청이 있다면 그대로 사용
          if (Object.keys(monitoringRequest).length === 0) {
            const newRequest: MonitoringRequest = {};
            Object.entries(machineTagsMap).forEach(([machine, { selectedTags }]) => {
              newRequest[machine] = selectedTags;
            });
            updateMonitoringRequest(newRequest);
          }
        } else {
          // 기본적으로 OIL과 관련된 기계들만 선택
          const defaultMachines = machines.filter(m => 
            m.startsWith('OIL_') || m === 'CRW_TEMP' || m === 'ID_FAN'
          );
          setSelectedMachines(defaultMachines);
          
          // 기본 선택된 기계들의 설정 가져오기
          const configPromises = defaultMachines.map(async (machine) => {
            try {
              const config = await machineApi.getMachineConfig(machine);
              updateMachineConfig(machine, config);
            } catch (error) {
              console.error(`${machine} 설정을 가져오는데 실패했습니다:`, error);
            }
          });
          
          await Promise.all(configPromises);
          
          // 기본 태그로 모니터링 요청 생성
          const newRequest: MonitoringRequest = {};
          defaultMachines.forEach(machine => {
            if (machineTagsMap[machine]) {
              newRequest[machine] = machineTagsMap[machine].selectedTags;
            }
          });
          updateMonitoringRequest(newRequest);
        }
      } catch (error) {
        console.error('초기 기계 목록을 가져오는데 실패했습니다:', error);
      }
    };

    fetchInitialMachines();
  }, []);

  const handleMonitoringRequestChange = (newRequest: MonitoringRequest) => {
    updateMonitoringRequest(newRequest);
    setSelectedMachines(Object.keys(newRequest));
  };

  const renderMachineBox = (machineName: string) => {
    const machineData = data[machineName];
    if (!machineData) return null;

    const getBackgroundColor = () => {
      if (machineName.includes('OIL_MAIN')) return 'bg-gray-800';
      if (machineName.includes('CRW_TEMP')) return 'bg-green-600';
      if (machineName.includes('ID_FAN')) return 'bg-blue-600';
      if (machineName.match(/OIL_[1-5]L/)) return 'bg-red-600';
      if (machineName.match(/OIL_[1-4]R/)) return 'bg-blue-800';
      if (machineName.startsWith('OXY_')) return 'bg-purple-600';
      return 'bg-gray-600';
    };

    const renderValue = (label: string, value: number | string | undefined | null, color: string = 'text-black', format: (v: number) => string = v => v?.toFixed(1)) => {
      if (value === undefined || value === null) {
        return (
          <div className="flex justify-between">
            <span>{label}:</span>
            <span className="text-red-500">태그 없음</span>
          </div>
        );
      }
      return (
        <div className="flex justify-between">
          <span>{label}:</span>
          <span className={color}>{typeof value === 'number' ? format(value) : value}</span>
        </div>
      );
    };

    return (
      <div className="border border-gray-300 p-2">
        <div className={`${getBackgroundColor()} text-white px-2 py-1 text-sm flex justify-between items-center`}>
          <span>{machineName}</span>
          {isConnected ? (
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
          ) : (
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
          )}
        </div>
        <div className="text-sm mt-1">
          {renderValue('R/L', machineData.RM, machineData.RM === 'LOCAL' ? 'text-green-600' : 'text-yellow-600')}
          {renderValue('A/M', machineData.AM, 'text-blue-600')}
          {renderValue('PV', machineData.PV)}
          {renderValue('SV', machineData.SV)}
          {renderValue('RT', machineData.RT, 'text-black', v => v?.toFixed(2))}
          {renderValue('MV', machineData.MV, 'text-orange-500')}
        </div>
      </div>
    );
  };

  const renderMachineGrid = () => {
    const oilMain = selectedMachines.find(m => m === 'OIL_MAIN');
    const oilLeft = selectedMachines.filter(m => m.match(/OIL_[1-5]L/)).sort();
    const oilRight = selectedMachines.filter(m => m.match(/OIL_[1-4]R/)).sort();
    const others = selectedMachines.filter(m => 
      !m.startsWith('OIL_') || (m.startsWith('OIL_') && !m.match(/OIL_(MAIN|[1-5]L|[1-4]R)/))
    );

    return (
      <div className="grid grid-cols-12 gap-2">
        {/* Left Section */}
        {oilMain && (
          <div className="col-span-3">
            {renderMachineBox(oilMain)}
          </div>
        )}

        {/* Middle Left Section */}
        {oilLeft.length > 0 && (
          <div className="col-span-3">
            <div className="grid grid-cols-1 gap-2">
              {oilLeft.map(name => (
                <div key={name}>{renderMachineBox(name)}</div>
              ))}
            </div>
          </div>
        )}

        {/* Middle Right Section */}
        {oilRight.length > 0 && (
          <div className="col-span-3">
            <div className="grid grid-cols-1 gap-2">
              {oilRight.map(name => (
                <div key={name}>{renderMachineBox(name)}</div>
              ))}
            </div>
          </div>
        )}

        {/* Right Section */}
        {others.length > 0 && (
          <div className="col-span-3">
            <div className="grid grid-cols-1 gap-2">
              {others.map(name => (
                <div key={name}>{renderMachineBox(name)}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">기계 모니터링 시스템</h1>
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isConnected ? '연결됨' : '연결 끊김'}
          </div>
          <MachineManager
            onMachinesChange={handleMonitoringRequestChange}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {renderMachineGrid()}
    </div>
  );
}

export default App;
