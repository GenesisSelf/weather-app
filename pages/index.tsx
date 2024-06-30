import React from 'react';
import Head from 'next/head';
import WeatherApp from './WeatherApp';
import { NextPage } from 'next';

interface IndexProps {
  priv: string; // Assuming priv is your API key
}

const Home: NextPage<IndexProps> = ({ priv }) => {
  return (
    <div>
      <Head>
        <title>Weather App</title>
        <meta name="description" content="Weather app description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <WeatherApp priv={priv} />
      </main>
    </div>
  );
};
Home.getInitialProps = async () => {
  const apiKey = process.env.APIKEY || '';

  return {
    priv: apiKey,
  };
};
export default Home;