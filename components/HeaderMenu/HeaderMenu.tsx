import React from 'react';

import { useRouter } from "next/router";


import { LinkType } from '../../types/types';
import { Menu, Group, Space, Burger, Container, Drawer, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';


import classes from './HeaderMenu.module.css';
import Link from 'next/link';


const links: LinkType[] = [
  { link: '/', label: 'HOME' },
  { link: '/work', label: 'WORK' },
  { link: '/about', label: 'ABOUT' },
  { link: '/contact', label: 'CONTACT' },
];

const HeaderMenu = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const router = useRouter();

  const goHome = () => {
    router.push("/");
  };

  const items = links.map((link) => {
    const menuItems = link.links?.map((item: LinkType) => (
      <Menu.Item key={item.link}>{item.label}</Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu key={link.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
          <Menu.Target>
            <a
              href={link.link}
              className={classes.link}
              onClick={(event) => event.preventDefault()}
            />
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <Link
        key={link.label}
        href={link.link}
        className={classes.link}
        passHref
      >
        {link.label}
      </Link>
    );
  });

  const itemsMobile = links.map((link) => {
    return (

      <Link
        onClick={toggle}
        key={link.label}
        href={link.link}
        className={`${classes.link} ${classes.linkLarge}`} // Added linkLarge class
        passHref
      >
        {link.label}
      </Link>
    );
  });

  return (
    <header className={classes.header}>
      <Container size="md">
        <div className={classes.inner}>
          <div className={classes.logoContainer}>
            <img
              className={classes.header__logo}
              src="/gifs/spcmkrs_logo.gif"
              alt="logo"
              onClick={goHome}
            />
          </div>
          <Group gap={5} visibleFrom="sm" className={classes.linksContainer}>
            {items}
          </Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </div>
      </Container>
      <Drawer
        opened={opened}
        onClose={toggle}
        padding="md"
        size="100%"
        position="right"
      >
        <Flex direction="column" gap="md" w="100%" justify="center" align="center">
          {itemsMobile}
        </Flex>
      </Drawer>
    </header>
  );
};

export default HeaderMenu;
