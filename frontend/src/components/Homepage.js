import React, { useState } from 'react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Appbar from './Appbar';

export default function Homepage() {
  const SERVER = process.env.REACT_APP_SERVER_NAME;
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const handleCreateRoom = async () => {
    const resRoom = await axios.post(`${SERVER}/room/new`);
    const { id } = resRoom.data;
    await axios.post(
      `${SERVER}/room/${id}/player/new`,
      { name },
      { headers: { 'Content-Type': 'application/json' } }
    );
    navigate(`/room/${id}`);
  };

  const handleJoinRoom = async () => {
    await axios.post(
      `${SERVER}/room/${code}/player/new`,
      { name },
      { headers: { 'Content-Type': 'application/json' } }
    );
    navigate(`/room/${code}`);
  };

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
          marginTop: '10vh',
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
        }}
      >
        <Typography variant='h3' mb='30px'>
          First enter your name:
        </Typography>
        <TextField
          placeholder='your name...'
          sx={{ marginBottom: '30px', minWidth: '200px' }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Typography variant='h3' mb='30px' mt='30px'>
          then create a new game...
        </Typography>
        <Button variant='contained' color='primary' onClick={handleCreateRoom}>
          Create
        </Button>
        <Typography variant='h3' mb='30px' mt='60px'>
          ...or join an existing game
        </Typography>
        <TextField
          placeholder='code...'
          type='number'
          value={code}
          onChange={(e) => setCode(e.target.value)}
          sx={{ marginBottom: '30px' }}
        />
        <Button variant='contained' color='secondary' onClick={handleJoinRoom}>
          Join
        </Button>
      </Paper>
    </Box>
  );
}
