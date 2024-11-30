import { Head, Html, Main, NextScript } from 'next/document';
import { ColorSchemeScript } from '@mantine/core';

import { GoogleAnalytics } from '@next/third-parties/google'


export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <ColorSchemeScript />
      </Head>
      <body>
        <Main />
        <NextScript />
        <GoogleAnalytics gaId="G-ZJRZBZBZHT" />
      </body>
    </Html>
  );
}
