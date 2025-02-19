import { webSocketService } from '@/services/websocket';
import { MonitoringRequest, WebSocketResponse } from '@/types/monitoring';
import { create } from 'zustand';

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
    if (!webSocketService.getConnectionCount()) {  // 이미 연결되어 있지 않을 때만
      webSocketService.connect();
      
      // 기존 리스너 제거
      const connectionCleanup = webSocketService.onConnectionChange((isConnected) => {
        set({ isConnected });
      });
      
      const messageCleanup = webSocketService.subscribe((data) => {
        set({ monitoringData: data, error: null });
      });
  
      // cleanup 함수 반환
      return () => {
        connectionCleanup();
        messageCleanup();
      };
    }
  },
  disconnect: () => {
    webSocketService.disconnect();
  },
  reconnect: () => {
    webSocketService.reconnect();
  },
  sendMessage: (message) => {
    webSocketService.sendMessage(message);
  },
})); 