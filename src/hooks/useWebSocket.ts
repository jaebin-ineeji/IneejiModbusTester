import { useEffect, useState } from 'react';
import { webSocketService } from '../services/websocket';
import { MonitoringData, MonitoringRequest, WebSocketResponse } from '../types/monitoring';

export const useWebSocket = (initialRequest?: MonitoringRequest) => {
  const [data, setData] = useState<MonitoringData>({});
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    webSocketService.connect();

    const unsubscribeConnection = webSocketService.onConnectionChange((connected: boolean) => {
      setIsConnected(connected);
      if (connected && initialRequest) {
        webSocketService.sendMessage(initialRequest);
      }
    });
    
    const unsubscribeMessage = webSocketService.subscribe((response: WebSocketResponse) => {
      if (response.success) {
        setData(response.data);
        setError(null);
      } else {
        setError(response.message);
      }
    });

    return () => {
      unsubscribeConnection();
      unsubscribeMessage();
      webSocketService.disconnect();
    };
  }, [initialRequest]);

  const updateMonitoringRequest = (request: MonitoringRequest) => {
    webSocketService.sendMessage(request);
  };

  return {
    data,
    isConnected,
    error,
    updateMonitoringRequest,
  };
}; 