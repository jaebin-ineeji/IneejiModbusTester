export interface MonitoringData {
  pv: number;
  sv: number;
  rt: number;
  mv: number;
}

export interface ControlMode {
  rl: 'LOCAL' | 'REMOTE';
  am: 'AUTO' | 'MANUAL';
}

export type Position = '1L' | '2L' | '3L' | '4L' | '5L' | '1R' | '2R' | '3R' | '4R';

export interface OilData extends MonitoringData, ControlMode {
  position: Position;
}

export interface OxygenData extends MonitoringData, ControlMode {
  position: Position;
}

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