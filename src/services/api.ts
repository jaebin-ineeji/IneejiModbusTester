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

import { MachineConfig, TagConfig } from '@/types/monitoring';

const BASE_URL = 'http://localhost:4444';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const machineApi = {
  // 기계 목록 조회
  async getMachineList(): Promise<string[]> {
    const response = await fetch(`${BASE_URL}/machine`);
    const data: ApiResponse<string[]> = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data.data;
  },

  // 기계 설정 조회
  async getMachineConfig(machineName: string): Promise<MachineConfig> {
    const response = await fetch(`${BASE_URL}/machine/${machineName}`);
    const data: ApiResponse<MachineConfig> = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data.data;
  },

  // 기계 추가
  async addMachine(machineName: string, config: MachineConfig): Promise<void> {
    const response = await fetch(`${BASE_URL}/machine/${machineName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });
    const data: ApiResponse<void> = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
  },

  async deleteMachine(machineName: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/machine/${machineName}`, {
      method: 'DELETE',
    });
    const data: ApiResponse<void> = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
  },

  async addMachineTag(
    machineName: string,
    tagName: string,
    config: TagConfig
  ): Promise<void> {
    const params = new URLSearchParams({ tag_name: tagName });
    const response = await fetch(
      `${BASE_URL}/machine/${machineName}/tags?${params.toString()}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      }
    );
    const data: ApiResponse<void> = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
  },

  async updateMachineTag(
    machineName: string,
    tagName: string,
    config: TagConfig
  ): Promise<void> {
    const response = await fetch(
      `${BASE_URL}/machine/${machineName}/tags/${tagName}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      }
    );
    const data: ApiResponse<void> = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
  },

  async deleteMachineTag(machineName: string, tagName: string): Promise<void> {
    const response = await fetch(
      `${BASE_URL}/machine/${machineName}/tags/${tagName}`,
      {
        method: 'DELETE',
      }
    );
    const data: ApiResponse<void> = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
  },
}; 