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
    let isMounted = true;

    fetch(`/api/getSiteData`)
      .then(response => response.json())
      .then(data => {
        if (isMounted) {
          setProjects(data["data"]);
          setTags(data['tags']);
        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });

    return () => {
      isMounted = false;
    };
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

        <meta name="description" content={siteConfig.description} />
        <meta name="keywords" content={siteConfig.keywords} />

        <meta property="og:title" content={siteConfig.name} />
        <meta property="og:description" content={siteConfig.description} />
        <meta property="og:image" content="https://spacemakers.tv/logo.jpg" />
        <meta name="twitter:card" content="summary_large_image" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Spacemakers.TV",
            "url": "https://spacemakers.tv",
            "logo": "https://spacemakers.tv/logo.jpg",
            "sameAs": [
              "https://www.facebook.com/spacemakerstv",
              "https://www.instagram.com/spacemakers_/",
              "https://www.linkedin.com/company/spacemakerstv"
            ]
          })}
        </script>
      </Head>
      <HeaderMenu />
      <Component {...pageProps} projects={projects} tags={tags} />
    </MantineProvider>
  );
}
