// import { mockOilData, mockOxygenData } from '../mocks/monitoringData';
// // import { OilData, OxygenData } from '../types/monitoring';

// // Mock API delay
// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// export const fetchOilData = async (): Promise<OilData[]> => {
//   await delay(500); // 실제 API 호출처럼 보이도록 지연 추가
//   return mockOilData;
// };

// export const fetchOxygenData = async (): Promise<OxygenData[]> => {
//   await delay(500);
//   return mockOxygenData;
// };

// export const fetchTemperatureData = async (): Promise<TemperatureData[]> => {
//   await delay(500);
//   return mockTemperatureData;
// };

// export const fetchStatusData = async (): Promise<StatusData[]> => {
//   await delay(500);
//   return mockStatusData;
// };

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface MachineTag {
  tag_type: string;
  logical_register: string;
  real_register: string;
  permission: 'Read' | 'ReadWrite';
}

interface MachineConfig {
  ip: string;
  port: number;
  slave: number;
  tags: {
    [key: string]: MachineTag;
  };
}

const BASE_URL = 'http://localhost:4444';

export const machineApi = {
  async getMachineList(): Promise<string[]> {
    const response = await fetch(`${BASE_URL}/machine`);
    const data: ApiResponse<string[]> = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data.data;
  },

  async getMachineConfig(machineName: string): Promise<MachineConfig> {
    const response = await fetch(`${BASE_URL}/machine/${machineName}`);
    const data: ApiResponse<MachineConfig> = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data.data;
  }
}; 