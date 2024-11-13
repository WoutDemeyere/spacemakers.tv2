import { Container, Group, ActionIcon, rem, Text } from '@mantine/core';
import { IconBrandInstagram, IconBrandFacebook, IconBrandLinkedin } from '@tabler/icons-react';
import classes from './FooterSocial.module.css';
import LogoWithText from '../LogoWithText/LogoWithText';

export function FooterSocial() {
  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <LogoWithText text="SPACEMAKERS" />
        <Group gap={0} className={classes.links} wrap="nowrap">
          <a href="https://www.instagram.com/spacemakers_/" target="_blank" rel="noopener noreferrer">
            <ActionIcon size="lg" color="gray" variant="subtle">
              <IconBrandInstagram className={classes.icon} />
            </ActionIcon>
          </a>
          <a href="https://www.facebook.com/spacemakers.tv/" target="_blank" rel="noopener noreferrer">
            <ActionIcon size="lg" color="gray" variant="subtle">
              <IconBrandFacebook className={classes.icon} />
            </ActionIcon>
          </a>
          <a href="https://www.linkedin.com/company/spacemakerstv/" target="_blank" rel="noopener noreferrer">
            <ActionIcon size="lg" color="gray" variant="subtle">
              <IconBrandLinkedin className={classes.icon} />
            </ActionIcon>
          </a>
        </Group>
      </Container>
    </div>
  );
}