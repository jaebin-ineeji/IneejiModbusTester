import { useEffect } from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { MachineManager } from './components/MachineManager';
import { MonitoringGrid } from './components/monitoring/MonitoringGrid';
import { useWebSocket } from './hooks/useWebSocket';
import { Settings } from './pages/Settings';
import { machineApi } from './services/api';
import { useMachineStore } from './store/machine';
import { MonitoringRequest } from './types/monitoring';

function MonitoringPage() {
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
        
        if (selectedMachines.length > 0 && Object.keys(machineTagsMap).length > 0) {
          await loadSavedMachineConfigs();
          loadSavedMonitoringRequest();
        } else {
          await loadDefaultMachines(machines);
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
    const defaultMachines = machines.filter(m => 
      m.startsWith('OIL_') || m === 'CRW_TEMP' || m === 'ID_FAN'
    );
    setSelectedMachines(defaultMachines);
    
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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">기계 모니터링 시스템</h1>
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isConnected ? '연결됨' : '연결 끊김'}
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
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <MonitoringGrid
        selectedMachines={selectedMachines}
        data={data}
        isConnected={isConnected}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MonitoringPage />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
