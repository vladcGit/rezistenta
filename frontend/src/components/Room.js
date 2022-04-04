import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate, useParams } from 'react-router-dom';
import Appbar from './Appbar';
import axios from 'axios';
import { w3cwebsocket } from 'websocket';

export default function Room() {
  const SERVER = process.env.REACT_APP_SERVER_NAME;
  const navigate = useNavigate();

  const { id } = useParams();
  const [room, setRoom] = useState(null);

  const handleStartGame = async () => {
    await axios.get(`${SERVER}/room/${id}/start`);
    navigate(`/room/${id}/game`);
  };

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
      // console.log(JSON.parse(message.data));
      const data = JSON.parse(message.data);
      setRoom(data);
      if (data.is_started) navigate(`/room/${id}/game`);
    };
    return () => clearInterval(timer);
  }, [id, navigate]);

  /*
  useEffect(() => {
    // varianta cu sse care nu merge pentru ca nu se actualizeaza obiectul trimis
    
    // const source = new EventSource(`${SERVER}/room/${id}/events`);

    // source.addEventListener('open', () => {
    //   console.log('SSE opened!');
    // });

    // source.addEventListener('message', (e) => {
    //   const data = JSON.parse(e.data);

    //   const players = data.Players.sort(
    //     (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    //   );
    //   console.log(players);

    //   const timestamp = new Date(players[0].createdAt || '');

    //   let diferentaTimp;

    //   if (!lastUpdate) diferentaTimp = 100;
    //   else diferentaTimp = timestamp.getTime() - lastUpdate.getTime();

    //   if (diferentaTimp > 0) {
    //     console.log(data);
    //     setRoom(data);
    //     setLastUpdate(timestamp);
    //   }
    // });

    // source.addEventListener('error', (e) => {
    //   console.error('Error: ', e);
    // });

    // return () => {
    //   source.close();
    // };
    
    // const requestInterval = 2000;

    // const timer = setInterval(() => {
    //   axios.get(`${SERVER}/room/${id}`).then((res) => {
    //     setRoom(res.data);
    //   });
    // }, requestInterval);

    // return () => clearInterval(timer);
  }, [SERVER, id]);
*/

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
        }}
      >
        <Typography variant='h3' mb='30px'>
          Share the code with your friends and when you are ready press start
        </Typography>
        <Typography variant='h3' mb='30px'>
          The code is: {id}
        </Typography>
        <Button variant='contained' color='primary' onClick={handleStartGame}>
          Start
        </Button>
        <Container sx={{ py: 8 }} maxWidth='md'>
          {/* End hero unit */}
          <Grid container spacing={4}>
            {room &&
              room.Players.map((player) => (
                <Grid item key={player.id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    variant='outlined'
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant='h5' component='h2'>
                        {player.name}
                      </Typography>
                      <Typography>{player.index_order}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Container>
      </Paper>
    </Box>
  );
}
