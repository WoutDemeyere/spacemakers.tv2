import { askPermission } from "@/utils/askDeviceRotationPermission";
import { Stack, Text, Button, rgba, px } from "@mantine/core";
import { useEffect, useState } from "react";

import { useRef } from "react";

import { v4 as uuidv4 } from 'uuid';


interface GyroControlProps {
  executeRequest: (button: { text: string; layerIndex: number; clipIndex: number }) => void;
}

const GyroControl: React.FC<GyroControlProps> = ({ executeRequest }) => {
  const [isGyroEnabled, setIsGyroEnabled] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);


  const userIdRef = useRef<string>(uuidv4());

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);


  useEffect(() => {
    if (isGyroEnabled) {
      askPermission(() => {
        initGyro()
      }, () => {
        alert('Zonder toestemming kan deze functie niet worden gebruikt, herstart de browser om opnieuw te proberen.');
      });
    } else {
      if (socketRef.current) {
        socketRef.current.close();
      }
    }
  }, [isGyroEnabled]);

  const initWebSocket = () => {
    // Initialize WebSocket
    if (typeof window !== 'undefined') {
      // const socket = new WebSocket('wss://spacetree-websocket-server-hidden-river-825.fly.dev');
      const socket = new WebSocket('wss://spacetree-websocket-server-v2.fly.dev');

      socket.onopen = () => {
        console.log('WebSocket connection established.');
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      // socket.onclose = () => {
      //   console.log('WebSocket connection closed.');
      //   if (isGyroEnabled) {
      //     alert('Only one connection at a time is allowed, try again later.')
      //     setIsGyroEnabled(false);
      //     window.removeEventListener('deviceorientation', handleOrientation);
      //   }
      // };

      socketRef.current = socket;
    }
  }

  const initGyro = () => {
    initWebSocket();
    executeRequest({ text: 'GYRO ENABLED', layerIndex: 3, clipIndex: 10 });
    window.addEventListener('deviceorientation', handleOrientation);
  }

  const handleOrientation = (event: DeviceOrientationEvent) => {
    const { alpha, beta, gamma } = event;
    const data = {
      alpha,
      beta,
      gamma,
      userId: userIdRef.current,
      type: 'gyro'
    };

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    }
  };

  return (
    <Button
      onClick={() => setIsGyroEnabled(!isGyroEnabled)}
      style={{
        backgroundColor: isGyroEnabled ? 'green' : 'white',
        color: isGyroEnabled ? 'white' : 'black',
        padding: isGyroEnabled ? '5px' : '20px',
        height: '80px',
        borderRadius: '2px',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
        boxShadow: `0 2px 4px rgba(0, 0, 0, 0.1)`,
      }}
    >
      {isGyroEnabled ? (
        <Stack>
          <Text fw={700}>GSM ROTATIE ACTIEF</Text>
          <Text fw={400} size="xs">Druk nogmaals om te stoppen</Text>
        </Stack>
      ) : (<Text fw={700}>GSM ROTATIE</Text>)}
    </Button>
  );

};

export default GyroControl;
