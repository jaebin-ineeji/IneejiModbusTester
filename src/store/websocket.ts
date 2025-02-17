import { create } from 'zustand';
import { webSocketService } from '../services/websocket';
import { MonitoringRequest, WebSocketResponse } from '../types/monitoring';

interface WebSocketStore {
  isConnected: boolean;
  monitoringData: WebSocketResponse | null;
  error: string | null;
  setIsConnected: (isConnected: boolean) => void;
  setMonitoringData: (data: WebSocketResponse) => void;
  setError: (error: string | null) => void;
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
  sendMessage: (message: MonitoringRequest) => void;
}

export const useWebSocketStore = create<WebSocketStore>((set) => ({
  isConnected: false,
  monitoringData: null,
  error: null,
  setIsConnected: (isConnected) => set({ isConnected }),
  setMonitoringData: (data) => set({ monitoringData: data }),
  setError: (error) => set({ error }),
  connect: () => {
    webSocketService.connect();
    webSocketService.onConnectionChange((isConnected) => {
      set({ isConnected });
    });
    webSocketService.subscribe((data) => {
      set({ monitoringData: data, error: null });
    });
  },
  disconnect: () => {
    webSocketService.disconnect();
  },
  reconnect: () => {
    webSocketService.disconnect();
    webSocketService.connect();
  },
  sendMessage: (message) => {
    webSocketService.sendMessage(message);
  },
})); 