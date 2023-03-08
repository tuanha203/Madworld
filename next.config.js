/** @type {import('next').NextConfig} */
// const { i18n } = require('./next-i18next.config');
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  // i18n,
  images: {
    domains: [
      'ipfs.io',
      'cdn.madworld-market.sotatek.works',
      'dze4pgew5aq5e.cloudfront.net',
      'i.picsum.photos',
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  cssModules: true,
  async rewrites() {
    return [
      // Rewrite everything else to use `pages/index`
      {
        source: '/create',
        destination: '/create',
      },
      {
        source: '/:cid',
        destination: '/collection/:cid',
      },
  
    ];
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/create/single',
  //       destination: '/404',
  //       permanent: true,
  //     },
  //     {
  //       source: '/create/multiple',
  //       destination: '/404',
  //       permanent: true,
  //     },
  //     {
  //       source: '/resources',
  //       destination: '/404',
  //       permanent: true,
  //     },
  //   ]
  // },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;
