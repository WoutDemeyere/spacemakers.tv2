import React, { useEffect, useRef, useState } from 'react';
import {
  Container,
  SimpleGrid,
  Button,
  Text,
  Flex,
  Center,
  Popover,
  Stack,
  Switch,
} from '@mantine/core';
import { GetServerSideProps } from 'next';
import { IconHelp } from '@tabler/icons-react';

import styles from './spacetree.module.css';
import { FooterSocial } from '@/components/FooterSocial/FooterSocial';

import { v4 as uuidv4 } from 'uuid';

import { useRouter } from 'next/router';
import ShakeDetector from 'shake-detector';



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
  const [permissionGranted, setPermissionGranted] = useState(false);


  const userIdRef = useRef<string>(uuidv4());
  const socketRef = useRef<WebSocket | null>(null);

  const router = useRouter();
  const { dev } = router.query;

  const [isGyroEnabled, setIsGyroEnabled] = useState(false);
  const [isShakeEnabled, setIsShakeEnabled] = useState(false);

  useEffect(() => {
    const container = document.getElementById('space-tree-container');
    if (container) {
      container.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const initWebSocket = () => {
    // Initialize WebSocket
    if (typeof window !== 'undefined') {
      const socket = new WebSocket('wss://spacetree-websocket-server-hidden-river-825.fly.dev');

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

  useEffect(() => {
    if (isGyroEnabled) {
      initWebSocket();
      askPermission();
      executeRequest({ text: 'GYRO ENABLED', layerIndex: 3, clipIndex: 10 });
    } else {
      if (socketRef.current) {
        socketRef.current.close();
      }
    }
  }, [isGyroEnabled]);

  useEffect(() => {
    console.log('isShakeEnabled', isShakeEnabled);
    if (isShakeEnabled) {
      askPermission();
    }
  }, [isShakeEnabled]);

  const initShake = () => {
    const options = {
      threshold: 10,
      debounceDelay: 1500,
    };

    const shakeDetector = new ShakeDetector(options).confirmPermissionGranted().subscribe(onShake).start();
    setIsShakeEnabled(shakeDetector !== null);
  }

  const onShake = () => {
    console.log('shake event');
    if (isShakeEnabled) {
      executeRequest({ text: 'SHAKE', layerIndex: 4, clipIndex: 1 });
    }
  }

  const askPermission = () => {

    // if (permissionGranted) {
    //   // Permission already granted, no need to ask again
    //   return;
    // }

    if (
      typeof DeviceMotionEvent !== 'undefined' &&
      typeof (DeviceMotionEvent as any).requestPermission === 'function'
    ) {
      (DeviceMotionEvent as any)
        .requestPermission()
        .then((response: any) => {
          console.log('permission response', response);
          if (response === 'granted') {
            initShake();
            setPermissionGranted(true); // Update state to reflect permission granted

            window.addEventListener('deviceorientation', handleOrientation);
          } else {
            alert('Zonder toestemming kan deze functie niet worden gebruikt, herstart de browser om opnieuw te proberen.');
          }
        })
        .catch((error: any) => {
          console.error(error);
          alert('Er is een fout opgetreden bij het aanvragen van toestemming.');
        });
    } else {
      // For devices that do not require permission or do not support it
      setPermissionGranted(true);
      initShake();
      window.addEventListener('deviceorientation', handleOrientation);
    }
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

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    }
  };

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
            `PI call returned ${response.status}: ${response.statusText}`
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

  const buttonClick = (button: ClipButton) => {
    executeRequest(button);
    setIsGyroEnabled(false);
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
                  onClick={() => buttonClick(button)}
                  className={styles.spaceTreeButton}
                >
                  {button.text}
                </Button>
              ))}
            </SimpleGrid>

            {dev === 'space' && (
              <>
                <Button
                  onClick={() => setIsGyroEnabled(!isGyroEnabled)}
                  className={styles.spaceTreeButton}
                  style={{
                    width: '100%',
                    marginTop: '10px',
                    backgroundColor: isGyroEnabled ? 'green' : 'white',
                    color: isGyroEnabled ? 'white' : 'black',
                    borderRadius: 0,
                    padding: isGyroEnabled ? '5px' : '20px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                  }}
                >
                  {isGyroEnabled ? (
                    <Stack>
                      <Text fw={700}>GSM ROTATIE ACTIEF</Text>
                      <Text fw={400} size="xs">Druk nogmaals om te stoppen</Text>
                    </Stack>
                  ) : (<Text fw={700}>GSM ROTATIE</Text>)}
                </Button>

                <Switch
                  color='blue'
                  style={{ margin: '15px', color: 'white' }}
                  label="ENABLE SHAKE TO TRIGGER"
                  checked={isShakeEnabled}
                  onChange={() => setIsShakeEnabled(!isShakeEnabled)}
                />
              </>

            )}


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
