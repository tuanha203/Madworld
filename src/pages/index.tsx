import HomePage from 'components/templates/homepage';
import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>MADworld NFT Marketplace</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <HomePage />
    </div>
  );
};

export default Home;
