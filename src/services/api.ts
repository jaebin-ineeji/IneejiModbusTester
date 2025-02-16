import { OilData, OxygenData, StatusData, TemperatureData } from '../types/monitoring';

const API_BASE_URL = 'http://localhost:4444/';

export const fetchOilData = async (): Promise<OilData[]> => {
  const response = await fetch(`${API_BASE_URL}/machine/oil`);
  if (!response.ok) {
    throw new Error('Failed to fetch oil data');
  }
  return response.json();
};

export const fetchOxygenData = async (): Promise<OxygenData[]> => {
  const response = await fetch(`${API_BASE_URL}/machine/oxygen`);
  if (!response.ok) {
    throw new Error('Failed to fetch oxygen data');
  }
  return response.json();
};

export const fetchTemperatureData = async (): Promise<TemperatureData[]> => {
  const response = await fetch(`${API_BASE_URL}/machine/temperature`);
  if (!response.ok) {
    throw new Error('Failed to fetch temperature data');
  }
  return response.json();
};

export const fetchStatusData = async (): Promise<StatusData[]> => {
  const response = await fetch(`${API_BASE_URL}/machine/status`);
  if (!response.ok) {
    throw new Error('Failed to fetch status data');
  }
  return response.json();
}; 