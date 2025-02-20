import { MachineConfig, TagConfig } from '@/types/monitoring';
import axios, { AxiosInstance, AxiosResponse } from 'axios';


// axios 인스턴스 생성
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: 'http://localhost:4444',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 응답 인터셉터
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    },
    (error) => {
      const message = error.response?.data?.message || error.message || '알 수 없는 오류가 발생했습니다.';
      throw new Error(message);
    }
  );

  return instance;
};

const api = createAxiosInstance();

export const machineApi = {
  // 기계 목록 조회
  async getMachineList(): Promise<string[]> {
    return api.get('/machine');
  },

  // 기계 설정 조회
  async getMachineConfig(machineName: string): Promise<MachineConfig> {
    return api.get(`/machine/${machineName}`);
  },

  // 기계 추가
  async addMachine(machineName: string, config: MachineConfig): Promise<void> {
    return api.post(`/machine/${machineName}`, config);
  },

  // 기계 삭제
  async deleteMachine(machineName: string): Promise<void> {
    return api.delete(`/machine/${machineName}`);
  },

  // 기계 태그 추가
  async addMachineTag(
    machineName: string,
    tagName: string,
    config: TagConfig
  ): Promise<void> {
    const params = new URLSearchParams({ tag_name: tagName });
    return api.post(
      `/machine/${machineName}/tags?${params.toString()}`,
      config
    );
  },

  // 기계 태그 수정
  async updateMachineTag(
    machineName: string,
    tagName: string,
    config: TagConfig
  ): Promise<void> {
    return api.put(
      `/machine/${machineName}/tags/${tagName}`,
      config
    );
  },

  // 기계 태그 삭제
  async deleteMachineTag(machineName: string, tagName: string): Promise<void> {
    return api.delete(`/machine/${machineName}/tags/${tagName}`);
  },
}; 