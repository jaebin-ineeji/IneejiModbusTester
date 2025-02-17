import { fetchOilData, fetchOxygenData } from '@/services/api';
import { OilData, OxygenData } from '@/types/monitoring';
import { useEffect, useState } from 'react';

interface MonitoringData {
  oilData: OilData[];
  oxygenData: OxygenData[];
  // temperatureData: TemperatureData[];
  // statusData: StatusData[];
  error: Error | null;
  isLoading: boolean;
}

const POLLING_INTERVAL = 1000; // 1초마다 업데이트

export const useMonitoringData = (): MonitoringData => {
  const [oilData, setOilData] = useState<OilData[]>([]);
  const [oxygenData, setOxygenData] = useState<OxygenData[]>([]);
  // const [temperatureData, setTemperatureData] = useState<TemperatureData[]>([]);
  // const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [oil, oxygen] = await Promise.all([
          fetchOilData(),
          fetchOxygenData(),
          // fetchTemperatureData(),
          // fetchStatusData(),
        ]);

        if (mounted) {
          setOilData(oil);
          setOxygenData(oxygen);
          // setTemperatureData(temperature);
          // setStatusData(status);
          setError(null);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('An error occurred'));
          setIsLoading(false);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, POLLING_INTERVAL);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return {
    oilData,
    oxygenData,
    // temperatureData,
    // statusData,
    error,
    isLoading,
  };
}; 