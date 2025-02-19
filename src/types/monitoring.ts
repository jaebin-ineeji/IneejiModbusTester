export interface MachineData {
  PV: number;
  SV: number;
  RT: number;
  MV: number;
  RM: 'LOCAL' | 'REMOTE';
  AM: 'AUTO' | 'MANUAL';
  [key: string]: number | string;
}

export type TagValue = string | number;

export interface MonitoringData {
  [key: string]: MachineData;
}

export interface MonitoringRequest {
  [key: string]: string[];
}

export enum TagType {
  ANALOG = "Analog",
  DIGITAL = "Digital",
  DIGITAL_AM = "DigitalAM",
  DIGITAL_RM = "DigitalRM"
}

export enum Permission {
  READ = "Read",
  READ_WRITE = "ReadWrite"
}

export interface TagConfig {
  tag_type: TagType;
  logical_register: string;
  real_register: string;
  permission: Permission;
}

export interface MachineConfig {
  ip: string;
  port: number;
  slave: number;
  tags: {
    [key: string]: TagConfig;
  };
}

export interface WebSocketResponse {
  success: boolean;
  message: string;
  data: MonitoringData;
}

export interface MachineTag {
  tag_type: string;
  logical_register: string;
  real_register: string;
  permission: 'Read' | 'ReadWrite';
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

export type MachineSection = 'main' | 'left' | 'right' | 'others';

export interface MachineLayout {
  main: string[];
  left: string[];
  right: string[];
  others: string[];
}

export interface MachinePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MachinePositions {
  [key: string]: MachinePosition;
} 