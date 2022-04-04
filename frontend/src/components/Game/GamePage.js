import { Box, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { w3cwebsocket } from 'websocket';
import Appbar from '../Appbar';
import Players from './Players';

export default function GamePage() {
  const { id } = useParams();

  const [room, setRoom] = useState(null);
  const [user, setUser] = useState(null);
  const [spies, setSpies] = useState([]);

  //websocket
  useEffect(() => {
    const client = new w3cwebsocket('ws://localhost:3001/', 'echo-protocol');
    let timer;
    client.onopen = () => {
      console.log('WebSocket Client Connected');
      timer = setInterval(() => {
        client.send(JSON.stringify({ id }));
      }, 2000);
    };
    client.onmessage = (message) => {
      //   console.log(JSON.parse(message.data));
      setRoom(JSON.parse(message.data));
    };
    return () => clearInterval(timer);
  }, [id]);

  //get user
  useEffect(() => {
    if (!user && room) {
      const { name } = JSON.parse(localStorage.getItem('data'));
      const _user = room.Players.filter((player) => player.name === name)[0];
      setUser(_user);
      const _spies = room.Players.filter((player) => player.is_spy);
      setSpies(_spies);
    }
  }, [room, user]);
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        minHeight: '100vh',
      }}
    >
      <Appbar />
      <Paper
        sx={{
          marginTop: '5vh',
          position: 'absolute',
          left: 0,
          right: 0,
          marginLeft: 'auto',
          marginRight: 'auto',
          minHeight: '300px',
          minWidth: '60vw',
          maxWidth: '80vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: user
            ? user.is_spy
              ? 'error.dark'
              : 'primary.main'
            : 'inherit',
        }}
      >
        {user && (
          <Typography variant='h3' mb='30px'>
            You are a{' '}
            {user.is_spy
              ? `spy, with ${spies
                  .filter((spy) => spy.name !== user.name)
                  .map((spy) => spy.name)
                  .join(', ')}`
              : 'resistance member'}
          </Typography>
        )}
        <Players room={room} />
      </Paper>
    </Box>
  );
}
