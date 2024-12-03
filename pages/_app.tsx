import { useState, useEffect } from "react";

import "@mantine/core/styles.css";

import type { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { theme } from "../theme";
import { siteConfig } from "../config/site-config";
import HeaderMenu from "../components/HeaderMenu/HeaderMenu";

import "@mantine/notifications/styles.css";
import "../styles/globals.css";
import Script from "next/dist/client/script";

export default function App ({
  Component,
  pageProps,
}: AppProps & { title?: string; description?: string }) {
  const [projects, setProjects] = useState([]);
  const [tags, setTags] = useState([]);

  // useEffect(() => {
  // 	let isMounted = true;

  // 	fetch(`/api/getSiteData`)
  // 		.then((response) => response.json())
  // 		.then((data) => {
  // 			if (isMounted) {
  // 				setProjects(data["data"]);
  // 				setTags(data["tags"]);
  // 			}
  // 		})
  // 		.catch((error) => {
  // 			console.error("Error fetching data:", error);
  // 		});

  // 	return () => {
  // 		isMounted = false;
  // 	};
  // }, []);

  return (
    <MantineProvider theme={theme}>
      <Head>
        <title>{pageProps.title || siteConfig.name}</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />

        <meta
          name="description"
          content={pageProps.description || siteConfig.description}
        />
        <meta name="keywords" content={siteConfig.keywords} />

        <meta
          property="og:title"
          content={pageProps.title || siteConfig.name}
        />
        <meta
          property="og:description"
          content={pageProps.description || siteConfig.description}
        />
        <meta property="og:image" content="https://spacemakers.tv/logo.jpg" />
        <meta name="twitter:card" content="summary_large_image" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Spacemakers.TV",
            url: "https://spacemakers.tv",
            logo: "https://spacemakers.tv/logo.jpg",
            sameAs: [
              "https://www.facebook.com/spacemakerstv",
              "https://www.instagram.com/spacemakers_/",
              "https://www.linkedin.com/company/spacemakerstv",
            ],
          })}
        </script>
      </Head>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX');
        `}
      </Script>
      <HeaderMenu />
      <Component {...pageProps} projects={projects} tags={tags} />
    </MantineProvider>
  );
}
