import React, { useEffect, useState } from 'react';
import { Container, SimpleGrid, Button, Text, Box, Center, Flex, Slider, AlphaSlider, Popover } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { IconHelp } from '@tabler/icons-react';

import styles from './spacetree.module.css';

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
        <Text size="xs">Control the lights of our unique lighttree!</Text>
      </Popover.Dropdown>
    </Popover>
  );
}

const SpaceTree = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    const container = document.getElementById('space-tree-container');
    if (container) {
      container.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  const buttons: ClipButton[] = [
    { text: 'STROBE', layerIndex: 1, clipIndex: 1 },
    { text: 'FIRE', layerIndex: 1, clipIndex: 2 },
    { text: 'SNOW', layerIndex: 1, clipIndex: 3 },
    { text: 'LINE X', layerIndex: 2, clipIndex: 1 },
    { text: 'LINE Y', layerIndex: 2, clipIndex: 2 },
    { text: 'LINE Z', layerIndex: 2, clipIndex: 3 },
    { text: 'RED HUE', layerIndex: 3, clipIndex: 1 },
    { text: 'CHASE', layerIndex: 3, clipIndex: 2 },
    { text: 'PARTY', layerIndex: 3, clipIndex: 3 },
  ];

  const executeRequest = (button: ClipButton) => {
    const url = new URL('/api/triggerClip', window.location.origin);
    url.searchParams.set('layerIndex', button.layerIndex.toString());
    url.searchParams.set('clipIndex', button.clipIndex.toString());

    fetch(url.toString(), {
      method: 'GET',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`API call returned ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('API call successful:', data);
      })
      .catch(error => {
        console.error('Error executing API call:', error);
      });
  };

  const executeBrightnessRequest = (opacity: number) => {
    console.log('Executing brightness request:', opacity);
    const url = new URL('/api/triggerOpacity', window.location.origin);
    url.searchParams.set('opacity', opacity.toString());

    fetch(url.toString(), {
      method: 'GET',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`API call returned ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('API call successful:', data);
      })
      .catch(error => {
        console.error('Error executing API call:', error);
      });
  };

  return (
    <Container
      id="space-tree-container"
      size="lg"
      style={{ padding: 0, maxWidth: '100%', margin: '0', height: '100vh', backgroundColor: 'black' }}
    >
      {/* Header */}
      <Flex justify="space-between" align="flex-start" direction="column">
        {/* <Box style={{ width: '100%', backgroundColor: 'black', color: 'white', paddingLeft: '15px' }}>
          <Text style={{ ...textStyle }}>SPACEMAKERS</Text>
        </Box> */}
        <Flex direction="row" justify="space-between" align="center" style={{ backgroundColor: 'white', color: 'black', paddingLeft: '15px', paddingRight: '15px', width: '100%' }}>
          <Text style={{ ...textStyle, fontSize: '22px' }}>— SPACETREE</Text>
          <HelpPopover />
        </Flex>
      </Flex>

      {/* Button Grid */}
      <Center style={{ marginTop: '20px', width: '100%' }}>
        <Flex direction="column" style={{ width: '100%' }}>
          <SimpleGrid cols={3} spacing="lg" style={{ padding: '20px', backgroundColor: 'black', color: 'white', width: '100%' }}>
            {buttons.map((button, index) => (
              <Button
                key={index}
                onClick={() => executeRequest(button)}
                disabled={isDisabled}
                className={styles.spaceTreeButton}
              >
                {button.text}
              </Button>
            ))}
          </SimpleGrid>


          <Flex direction="column" style={{ backgroundColor: 'black', color: 'black', padding: '30px', width: '100%' }}>
            <Text style={{ color: 'white', fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>BRIGHTNESS</Text>
            <Slider color="grey" value={sliderValue} onChange={setSliderValue} onChangeEnd={(value) => executeBrightnessRequest(value)} max={1} min={0} step={0.01} inverted />
          </Flex>
        </Flex>
      </Center>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const title = "Space Tree";
  const description = "Interactive navigation tree for Spacemakers projects";

  return {
    props: {
      title,
      description,
    },
  };
};

export default SpaceTree;