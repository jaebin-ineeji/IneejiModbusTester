import { MonitoringRequest, WebSocketResponse } from '@/types/monitoring';

type EventMap = {
  message: WebSocketResponse;
  connection: boolean;
};

type MessageCallback = (data: WebSocketResponse) => void;
type ConnectionCallback = (isConnected: boolean) => void;

class EventEmitter {
  private listeners: {
    [K in keyof EventMap]: ((data: EventMap[K]) => void)[];
  } = {
    message: [],
    connection: []
  };

  on<K extends keyof EventMap>(event: K, callback: (data: EventMap[K]) => void) {
    this.listeners[event].push(callback);
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]) {
    this.listeners[event].forEach(callback => callback(data));
  }

  off<K extends keyof EventMap>(event: K, callback: (data: EventMap[K]) => void) {
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback) as typeof this.listeners[K];
  }
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private eventEmitter = new EventEmitter();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 1;
  private reconnectTimeout = 3000;
  private connectionCount = 0;
  private autoReconnect = false;

  constructor(private url: string) {}

  connect() {
    this.connectionCount++;
    
    if (this.connectionCount === 1) {
      this.autoReconnect = true;
      this.initializeConnection();
    }
  }

  private initializeConnection() {
    if (this.ws?.readyState === WebSocket.CONNECTING) {
      return;
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.close();
    }

    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('WebSocket 연결됨');
        this.reconnectAttempts = 0;
        this.eventEmitter.emit('connection', true);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.eventEmitter.emit('message', data);
        } catch (error) {
          console.error('메시지 파싱 에러:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket 연결 끊김');
        this.eventEmitter.emit('connection', false);
        if (this.autoReconnect) {
          this.attemptReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket 에러:', error);
        this.eventEmitter.emit('connection', false);
      };
    } catch (error) {
      console.error('WebSocket 연결 에러:', error);
      this.eventEmitter.emit('connection', false);
      if (this.autoReconnect) {
        this.attemptReconnect();
      }
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.autoReconnect) {
      this.reconnectAttempts++;
      setTimeout(() => this.initializeConnection(), this.reconnectTimeout);
    }
  }

  subscribe(callback: MessageCallback) {
    this.eventEmitter.on('message', callback);
    return () => {
      this.eventEmitter.off('message', callback);
    };
  }

  onConnectionChange(callback: ConnectionCallback) {
    this.eventEmitter.on('connection', callback);
    return () => {
      this.eventEmitter.off('connection', callback);
    };
  }

  sendMessage(message: MonitoringRequest) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket이 연결되지 않았습니다.');
    }
  }

  disconnect() {
    this.connectionCount--;
    
    if (this.connectionCount === 0) {
      this.autoReconnect = false;
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
    }
  }

  reconnect() {
    this.autoReconnect = true;
    this.reconnectAttempts = 0;
    this.initializeConnection();
  }

  // 디버깅 및 테스트용
  getConnectionCount() {
    return this.connectionCount;
  }
}

export const webSocketService = new WebSocketService('ws://localhost:4444/machine/ws'); 