import React, { useEffect, useRef, useState } from 'react';
import {
  Container,
  SimpleGrid,
  Button,
  Text,
  Flex,
  Center,
  Popover,
} from '@mantine/core';
import { GetServerSideProps } from 'next';
import { IconHelp } from '@tabler/icons-react';

import styles from './spacetree.module.css';
import { FooterSocial } from '@/components/FooterSocial/FooterSocial';

import { v4 as uuidv4 } from 'uuid';

const textStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  letterSpacing: '0.5px',
};

type ClipButton = {
  text: string;
  layerIndex: number;
  clipIndex: number;
};

const HelpPopover = () => {
  return (
    <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <IconHelp size={28} color="#000000" />
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="xs">Control the lights of our unique light tree!</Text>
      </Popover.Dropdown>
    </Popover>
  );
};

const SpaceTree = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [gyroData, setGyroData] = useState<{
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
  }>({ alpha: null, beta: null, gamma: null });

  const [isGyroEnabled, setIsGyroEnabled] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [buttonColor, setButtonColor] = useState('white');
  const [timer, setTimer] = useState<number>(0);

  const userIdRef = useRef<string>(uuidv4());
  const socketRef = useRef<WebSocket | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  const GYRO_DURATION = 30; // in seconds
  const COOLDOWN_DURATION = 10; // in seconds

  useEffect(() => {
    const container = document.getElementById('space-tree-container');
    if (container) {
      container.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }

    // Initialize WebSocket
    if (typeof window !== 'undefined') {
      const socket = new WebSocket(
        'wss://spacetree-websocket-server-hidden-river-825.fly.dev'
      );

      socket.onopen = () => {
        console.log('WebSocket connection established.');
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      socketRef.current = socket;

      // Check for existing gyro or cooldown state
      const gyroEnabledUntil = localStorage.getItem('gyroEnabledUntil');
      const gyroCooldownUntil = localStorage.getItem('gyroCooldownUntil');
      const now = Date.now();

      if (gyroEnabledUntil && parseInt(gyroEnabledUntil) > now) {
        const remainingTime = Math.ceil(
          (parseInt(gyroEnabledUntil) - now) / 1000
        );
        setIsGyroEnabled(true);
        setButtonColor('green');
        setTimer(remainingTime);
        addDeviceOrientationListener();

        // Set timeout to disable gyro when time is up
        setTimeout(() => {
          setIsDisabled(false); // Reset isDisabled here
          setButtonColor('red');
          window.removeEventListener('deviceorientation', handleOrientation);
          localStorage.removeItem('gyroEnabledUntil');
          startCooldown();
        }, parseInt(gyroEnabledUntil) - now);

        startTimer();
      } else if (gyroCooldownUntil && parseInt(gyroCooldownUntil) > now) {
        const remainingTime = Math.ceil(
          (parseInt(gyroCooldownUntil) - now) / 1000
        );
        setIsCooldown(true);
        setButtonColor('red');
        setTimer(remainingTime);

        // Set timeout to end cooldown
        setTimeout(() => {
          setIsGyroEnabled(false);
          setIsCooldown(false);
          setButtonColor('white');
          setTimer(0);
          localStorage.removeItem('gyroCooldownUntil');
        }, parseInt(gyroCooldownUntil) - now);

        startTimer();
      }

      // Cleanup function
      return () => {
        if (socketRef.current) {
          socketRef.current.close();
        }
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
        }
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    }
  }, []);

  const askPermission = () => {
    if (
      typeof DeviceMotionEvent !== 'undefined' &&
      typeof (DeviceMotionEvent as any).requestPermission === 'function'
    ) {
      (DeviceMotionEvent as any)
        .requestPermission()
        .then((response: any) => {
          if (response === 'granted') {
            addDeviceOrientationListener();
          } else {
            alert('Zonder toestemming kan deze functie niet worden gebruikt.');
          }
        })
        .catch((error: any) => {
          console.error(error);
          alert('Er is een fout opgetreden bij het aanvragen van toestemming.');
        });
    } else {
      // For devices that do not require permission or do not support it
      addDeviceOrientationListener();
    }
  };

  const addDeviceOrientationListener = () => {
    window.addEventListener('deviceorientation', handleOrientation);
  };

  const startGyro = () => {
    askPermission();
    setIsGyroEnabled(true);
    setButtonColor('green');
    setIsDisabled(true);

    executeRequest({ text: 'GYRO ENABLED', layerIndex: 3, clipIndex: 10 });

    const gyroEndTime = Date.now() + GYRO_DURATION * 1000;
    localStorage.setItem('gyroEnabledUntil', gyroEndTime.toString());

    setTimer(GYRO_DURATION);
    startTimer();

    setTimeout(() => {
      setIsGyroEnabled(false);
      setButtonColor('red');
      window.removeEventListener('deviceorientation', handleOrientation);
      localStorage.removeItem('gyroEnabledUntil');
      startCooldown();
    }, GYRO_DURATION * 1000);
  };

  const startCooldown = () => {
    setIsCooldown(true);
    setButtonColor('red');

    const cooldownEndTime = Date.now() + COOLDOWN_DURATION * 1000;
    localStorage.setItem('gyroCooldownUntil', cooldownEndTime.toString());

    setTimer(COOLDOWN_DURATION);
    startTimer();

    setTimeout(() => {
      setButtonColor('white');
      setTimer(0);
      setIsGyroEnabled(false);
      setIsCooldown(false);
      localStorage.removeItem('gyroCooldownUntil');
    }, COOLDOWN_DURATION * 1000);
  };

  const startTimer = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
    intervalIdRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 1) {
          return prevTimer - 1;
        } else {
          if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
          }
          return 0;
        }
      });
    }, 1000);
  };

  // Function to handle orientation data
  const handleOrientation = (event: DeviceOrientationEvent) => {
    const { alpha, beta, gamma } = event;
    const data = {
      alpha,
      beta,
      gamma,
      userId: userIdRef.current,
    };
    setGyroData({ alpha, beta, gamma });

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    }
  };

  // Rest of your code...

  const buttons: ClipButton[] = [
    { text: 'WARM', layerIndex: 3, clipIndex: 1 },
    { text: 'SEA', layerIndex: 3, clipIndex: 2 },
    { text: 'RED', layerIndex: 3, clipIndex: 3 },
    { text: 'LINE X', layerIndex: 3, clipIndex: 4 },
    { text: 'SNOW', layerIndex: 3, clipIndex: 5 },
    { text: 'PARTY', layerIndex: 3, clipIndex: 6 },
    { text: 'LINE', layerIndex: 3, clipIndex: 7 },
    { text: 'GRADIENT', layerIndex: 3, clipIndex: 8 },
    { text: 'COLD', layerIndex: 3, clipIndex: 9 },
  ];

  const executeRequest = (button: ClipButton) => {
    const url = new URL('/api/triggerClip', window.location.origin);
    url.searchParams.set('layerIndex', button.layerIndex.toString());
    url.searchParams.set('clipIndex', button.clipIndex.toString());

    fetch(url.toString(), {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `API call returned ${response.status}: ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log('API call successful:', data);
      })
      .catch((error) => {
        console.error('Error executing API call:', error);
      });
  };

  return (
    <React.Fragment>
      <Container
        id="space-tree-container"
        size="lg"
        style={{
          padding: 0,
          maxWidth: '100%',
          margin: '0',
          height: '100vh',
          backgroundColor: 'black',
        }}
      >
        {/* Header */}
        <Flex justify="space-between" align="flex-start" direction="column">
          <Flex
            direction="row"
            justify="space-between"
            align="center"
            style={{
              backgroundColor: 'white',
              color: 'black',
              paddingLeft: '15px',
              paddingRight: '15px',
              width: '100%',
            }}
          >
            <Text style={{ ...textStyle, fontSize: '22px' }}>— SPACETREE</Text>
            <HelpPopover />
          </Flex>
        </Flex>

        {/* Button Grid */}
        <Center style={{ marginTop: '20px', width: '100%' }}>
          <Flex direction="column" style={{ width: '100%' }}>
            <SimpleGrid
              cols={3}
              spacing="lg"
              style={{
                padding: '20px',
                backgroundColor: 'black',
                color: 'white',
                width: '100%',
              }}
            >
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  onClick={() => executeRequest(button)}
                  className={styles.spaceTreeButton}
                >
                  {button.text}
                </Button>
              ))}
            </SimpleGrid>

            <Button
              onClick={() => {
                if (!isCooldown && !isGyroEnabled) {
                  startGyro();
                }
              }}
              // disabled={isDisabled || isCooldown || isGyroEnabled}
              className={styles.spaceTreeButton}
              style={{
                width: '100%',
                marginTop: '10px',
                backgroundColor: buttonColor,
                color: buttonColor === 'white' ? 'black' : 'white',
                borderRadius: 0,
                padding: '20px',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              {isGyroEnabled
                ? `GYRO ENABLED (${timer}s)`
                : isCooldown
                ? `COOLDOWN (${timer}s)`
                : 'GSM ROTATIE'}
            </Button>
          </Flex>
        </Center>
      </Container>
      <FooterSocial />
    </React.Fragment>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const title = 'Space Tree';
  const description = 'Interactive navigation tree for Spacemakers projects';

  return {
    props: {
      title,
      description,
    },
  };
};

export default SpaceTree;