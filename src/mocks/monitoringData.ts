import { OilData, OxygenData, Position, StatusData, TemperatureData } from '../types/monitoring';

export const mockOilData: OilData[] = [
  { position: '1L' as Position, pv: 90.1, sv: 90.0, rt: 1.00, mv: 31.1, rl: 'LOCAL', am: 'AUTO' },
  { position: '2L' as Position, pv: 89.9, sv: 90.0, rt: 1.00, mv: 40.3, rl: 'LOCAL', am: 'AUTO' },
  { position: '3L' as Position, pv: 94.2, sv: 95.0, rt: 1.00, mv: 45.6, rl: 'LOCAL', am: 'AUTO' },
  { position: '4L' as Position, pv: 94.2, sv: 95.0, rt: 1.00, mv: 40.3, rl: 'LOCAL', am: 'AUTO' },
  { position: '5L' as Position, pv: 89.5, sv: 90.0, rt: 1.00, mv: 47.9, rl: 'LOCAL', am: 'AUTO' },
  { position: '1R' as Position, pv: 95.0, sv: 95.0, rt: 1.00, mv: 37.7, rl: 'LOCAL', am: 'AUTO' },
  { position: '2R' as Position, pv: 90.2, sv: 90.0, rt: 1.00, mv: 40.1, rl: 'LOCAL', am: 'AUTO' },
  { position: '3R' as Position, pv: 95.0, sv: 95.0, rt: 1.00, mv: 47.5, rl: 'LOCAL', am: 'AUTO' },
  { position: '4R' as Position, pv: 90.6, sv: 90.0, rt: 1.00, mv: 37.8, rl: 'LOCAL', am: 'AUTO' },
];

export const mockOxygenData: OxygenData[] = [
  { position: '1L' as Position, pv: 188.7, sv: 190.0, rt: 1.00, mv: 45.3, rl: 'LOCAL', am: 'AUTO' },
  { position: '2L' as Position, pv: 215.4, sv: 215.0, rt: 1.00, mv: 51.1, rl: 'LOCAL', am: 'AUTO' },
  { position: '3L' as Position, pv: 225.5, sv: 225.0, rt: 1.00, mv: 45.1, rl: 'LOCAL', am: 'AUTO' },
  { position: '4L' as Position, pv: 225.3, sv: 225.0, rt: 1.00, mv: 48.7, rl: 'LOCAL', am: 'AUTO' },
  { position: '5L' as Position, pv: 214.1, sv: 215.0, rt: 1.00, mv: 50.3, rl: 'LOCAL', am: 'AUTO' },
  { position: '1R' as Position, pv: 225.2, sv: 225.0, rt: 1.00, mv: 53.5, rl: 'LOCAL', am: 'AUTO' },
  { position: '2R' as Position, pv: 215.3, sv: 215.0, rt: 1.00, mv: 47.2, rl: 'LOCAL', am: 'AUTO' },
  { position: '3R' as Position, pv: 225.7, sv: 225.0, rt: 1.00, mv: 55.0, rl: 'LOCAL', am: 'AUTO' },
  { position: '4R' as Position, pv: 214.2, sv: 215.0, rt: 1.00, mv: 53.7, rl: 'LOCAL', am: 'AUTO' },
];

export const mockTemperatureData: TemperatureData[] = [
  { id: '1', name: 'ARCH #1', value: 0.0, unit: '℃' },
  { id: '2', name: 'ARCH #2', value: 1488.1, unit: '℃' },
  { id: '3', name: 'ARCH #3', value: 1550.7, unit: '℃' },
  { id: '4', name: 'ARCH #4', value: 1548.3, unit: '℃' },
  { id: '5', name: 'THROAT #5', value: 1060.3, unit: '℃' },
  { id: '6', name: 'PORT ARCH R #6', value: 0.0, unit: '℃' },
  { id: '7', name: 'PORT ARCH R #7', value: 1323.3, unit: '℃' },
  { id: '8', name: 'MELTER BT #8', value: 908.2, unit: '℃' },
];

export const mockStatusData: StatusData[] = [
  { id: '1', name: '유량', value: 2197.00, unit: 'Nm³/hr' },
  { id: '2', name: '압력', value: 1.16, unit: 'Barg' },
  { id: '3', name: '온도', value: 91.89, unit: '%' },
]; 