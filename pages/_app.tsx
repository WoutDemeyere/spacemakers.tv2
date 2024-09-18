import { useState, useEffect } from 'react';

import '@mantine/core/styles.css';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider, createTheme } from '@mantine/core';
import { theme } from '../theme';
import { siteConfig } from '../config/site-config';
import HeaderMenu from '../components/HeaderMenu/HeaderMenu';

import '@mantine/notifications/styles.css';
import '../styles/globals.css';


export default function App ({ Component, pageProps }: AppProps) {
  const [projects, setProjects] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetch(`/api/getSiteData`)
      .then(response => response.json())
      .then(data => {
        setProjects(data["data"]);
        setTags(data['tags']);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      })
  }, []);


  return (
    <MantineProvider theme={theme}>
      <Head>
        <title>{siteConfig.name}</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <HeaderMenu />
      <Component {...pageProps} projects={projects} tags={tags} />
    </MantineProvider>
  );
}
