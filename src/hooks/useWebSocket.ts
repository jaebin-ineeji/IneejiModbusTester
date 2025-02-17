import { useEffect, useState } from 'react';
import { webSocketService } from '../services/websocket';
import { MonitoringData, MonitoringRequest, WebSocketResponse } from '../types/monitoring';

export const useWebSocket = (initialRequest?: MonitoringRequest) => {
  const [data, setData] = useState<MonitoringData>({});
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 웹소켓 연결 시작
    webSocketService.connect();

    // 연결 상태 구독
    const unsubscribeConnection = webSocketService.onConnectionChange((connected: boolean) => {
      setIsConnected(connected);
      if (connected && initialRequest) {
        webSocketService.sendMessage(initialRequest);
      }
    });

    // 메시지 구독
    const unsubscribeMessage = webSocketService.subscribe((response: WebSocketResponse) => {
      if (response.success) {
        setData(response.data);
        setError(null);
      } else {
        setError(response.message);
      }
    });

    // 초기 요청이 있는 경우 전송
    if (initialRequest && Object.keys(initialRequest).length > 0) {
      webSocketService.sendMessage(initialRequest);
    }

    // 정리 함수
    return () => {
      unsubscribeConnection();
      unsubscribeMessage();
    };
  }, []);

  // initialRequest가 변경될 때마다 메시지 전송
  useEffect(() => {
    if (initialRequest && Object.keys(initialRequest).length > 0 && isConnected) {
      webSocketService.sendMessage(initialRequest);
    }
  }, [initialRequest, isConnected]);

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