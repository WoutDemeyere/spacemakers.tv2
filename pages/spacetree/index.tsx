import React, { useEffect, useRef, useState } from 'react';
import {
  Container,
  SimpleGrid,
  Button,
  Text,
  Flex,
  Center,
  Popover,
  Switch,
} from '@mantine/core';
import { GetServerSideProps } from 'next';
import { IconHelp } from '@tabler/icons-react';

import styles from './spacetree.module.css';
import { FooterSocial } from '@/components/FooterSocial/FooterSocial';


import { useRouter } from 'next/router';
import ShakeDetector from 'shake-detector';
import GyroControl from '@/components/GyroControl';
import ShakeControl from '@/components/ShakeControl';
// import SpaceTreeCanvas from '@/components/Canvas/index';

import dynamic from 'next/dynamic';

const SpaceTreeCanvas = dynamic(() => import('@/components/Canvas/index'), {
  ssr: false,
});


const textStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  letterSpacing: '0.5px',
};

export type ClipButton = {
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

  const router = useRouter();
  const { dev } = router.query;

  // useEffect(() => {
  //   const container = document.getElementById('space-tree-container');
  //   if (container) {
  //     container.scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'start',
  //     });
  //   }
  // }, []);


  // Function to handle orientation data

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
                <GyroControl executeRequest={executeRequest} />
                <ShakeControl executeRequest={executeRequest} />
                <SpaceTreeCanvas executeRequest={executeRequest}/>
              </>
            )}
          </Flex>
        </Center>
      </Container>
      <FooterSocial volcke={true} />
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
