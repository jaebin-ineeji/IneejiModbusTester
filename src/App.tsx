import { OilSection } from '@/components/monitoring/OilSection/OilSection';
import { OxygenSection } from '@/components/monitoring/OxygenSection/OxygenSection';
import { StatusSection } from '@/components/monitoring/StatusSection/StatusSection';
import { TemperatureSection } from '@/components/monitoring/TemperatureSection/TemperatureSection';
import { useMonitoringData } from '@/hooks/useMonitoringData';

function App() {
  const { oilData, oxygenData, temperatureData, statusData, error, isLoading } = useMonitoringData();

  if (error) {
    return (
      <div className="p-5 bg-gray-100 min-h-screen">
        <div className="p-5 m-5 bg-red-50 text-red-800 rounded-lg border border-red-200">
          Error: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-white text-2xl z-50">
          Loading...
        </div>
      )}
      <OilSection data={oilData} />
      <OxygenSection data={oxygenData} />
      <TemperatureSection data={temperatureData} />
      <StatusSection data={statusData} />
    </div>
  );
}

export default App;
