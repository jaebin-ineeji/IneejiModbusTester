export interface MachineData {
  PV: number;
  SV: number;
  RT: number;
  MV: number;
  RM: 'LOCAL' | 'REMOTE';
  AM: 'AUTO' | 'MANUAL';
}

export interface MonitoringData {
  [key: string]: MachineData;
}

export interface WebSocketResponse {
  success: boolean;
  message: string;
  data: MonitoringData;
}

export interface MonitoringRequest {
  [key: string]: string[];
}

export interface MachineTag {
  tag_type: string;
  logical_register: string;
  real_register: string;
  permission: 'Read' | 'ReadWrite';
}

export interface MachineConfig {
  ip: string;
  port: number;
  slave: number;
  tags: {
    [key: string]: MachineTag;
  };
}

export interface ControlMode {
  rm: 'LOCAL' | 'REMOTE';
  am: 'AUTO' | 'MANUAL';
}

export type Position = '1L' | '2L' | '3L' | '4L' | '5L' | '1R' | '2R' | '3R' | '4R';

export interface TemperatureData {
  id: string;
  name: string;
  value: number;
  unit: '℃';
}

export interface StatusData {
  id: string;
  name: string;
  value: number;
  unit: string;
} 