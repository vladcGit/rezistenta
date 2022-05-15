import React from 'react';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './Homepage';
import Room from './Room';
import GamePage from './Game/GamePage';
// import Appbar from './Appbar';

export default function App() {
  return (
    <MantineProvider
      theme={{ colorScheme: 'dark' }}
      withGlobalStyles
      withNormalizeCSS
    >
      <>
        {/* <Appbar links={[{ link: '/', label: 'Home' }]} /> */}
        <BrowserRouter>
          <Routes>
            <Route exact path='/' element={<Homepage />} />
            <Route exact path='/room/:id' element={<Room />} />
            <Route exact path='/room/:id/game' element={<GamePage />} />
          </Routes>
        </BrowserRouter>
      </>
    </MantineProvider>
  );
}
