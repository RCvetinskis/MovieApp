import { useEffect, useState } from "react";

const useWebSocket = (url: string, onMessageCallback: (data: any) => void) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      onMessageCallback(data);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [url]);

  return { isConnected };
};

export default useWebSocket;
