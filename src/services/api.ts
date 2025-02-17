import { mockOilData, mockOxygenData } from '../mocks/monitoringData';
import { OilData, OxygenData } from '../types/monitoring';

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchOilData = async (): Promise<OilData[]> => {
  await delay(500); // 실제 API 호출처럼 보이도록 지연 추가
  return mockOilData;
};

export const fetchOxygenData = async (): Promise<OxygenData[]> => {
  await delay(500);
  return mockOxygenData;
};

// export const fetchTemperatureData = async (): Promise<TemperatureData[]> => {
//   await delay(500);
//   return mockTemperatureData;
// };

// export const fetchStatusData = async (): Promise<StatusData[]> => {
//   await delay(500);
//   return mockStatusData;
// }; 