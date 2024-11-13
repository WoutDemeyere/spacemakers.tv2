import localFont from 'next/font/local';

export const basierSquare = localFont({
  src: [
    {
      path: 'fonts/basiersquare-bold-webfont.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: 'fonts/basiersquare-bolditalic-webfont.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: 'fonts/basiersquare-medium-webfont.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: 'fonts/basiersquare-mediumitalic-webfont.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: 'fonts/basiersquare-regular-webfont.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: 'fonts/basiersquare-regularitalic-webfont.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: 'fonts/basiersquare-semibold-webfont.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: 'fonts/basiersquare-semibolditalic-webfont.woff2',
      weight: '600',
      style: 'italic',
    },
  ],
});