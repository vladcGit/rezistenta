import {
  Container,
  createStyles,
  Divider,
  Text,
  Grid,
  Card,
  Group,
  useMantineTheme,
  Button,
  Loader,
  Accordion,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import Mission from './Mission';
import Players from './Players';

const BREAKPOINT = '@media (max-width: 755px)';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    boxSizing: 'border-box',
    overflowX: 'hidden',
    minHeight: '100vh',
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },

  inner: {
    position: 'relative',
    width: '100vw',
    maxWidth: '100vw',
    textAlign: 'center',
    paddingTop: 50,
    paddingBottom: 120,

    [BREAKPOINT]: {
      paddingBottom: 80,
      paddingTop: 50,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    margin: '50px',
    fontSize: 60,
    fontWeight: 900,
    lineHeight: 1.1,
    padding: 0,
    color: theme.white,

    [BREAKPOINT]: {
      fontSize: 42,
      lineHeight: 1.2,
    },
  },

  subtitle: {
    margin: theme.spacing.xl,
    fontSize: 45,
    color: theme.white,

    [BREAKPOINT]: {
      fontSize: 25,
    },
  },

  description: {
    margin: theme.spacing.lg,
    fontSize: 35,
    color: theme.white,

    [BREAKPOINT]: {
      fontSize: 18,
    },
  },
}));

export default function GamePage() {
  const { id } = useParams();

  const [socket, setsocket] = useState(null);
  const [room, setRoom] = useState(null);
  const [user, setUser] = useState(null);
  const [spies, setSpies] = useState([]);
  const [selectat, setSelectat] = useState([]);
  const [mission, setMission] = useState(null);

  const [loadingCreateMission, setLoadingCreateMission] = useState(false);
  const [loadingVotePlayers, setLoadingVotePlayers] = useState(false);
  const [loadingVoteMission, setLoadingVoteMission] = useState(false);

  const { classes } = useStyles();
  const { colors } = useMantineTheme();

  useEffect(() => {
    const fetchRoom = async () => {
      const res = await axios.get(`/api/room/${id}`);
      setRoom(res.data);
      if (res.data?.Missions.length > 0) {
        const copie = [...res.data.Missions];
        copie.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMission(copie[0]);
        // console.log(copie[0]);
      } else setMission(null);
    };
    fetchRoom();

    const newSocket = io('/', {
      query: { id },
    });
    setsocket(newSocket);
    return () => newSocket.disconnect();
  }, [id]);

  //websocket

  const sendUpdate = () => {
    socket.emit('update', JSON.stringify({ id }));
  };

  useEffect(() => {
    if (!socket) return;
    socket.emit('update', JSON.stringify({ id }));
    socket.on('room', (message) => {
      const data = JSON.parse(message);
      console.log(data);
      setRoom(data);
      if (data?.Missions.length > 0) {
        const copie = [...data.Missions];
        copie.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMission(copie[0]);
        // console.log(copie[0]);
      } else setMission(null);
    });
    return () => socket.disconnect();
  }, [socket, id]);

  //get user
  useEffect(() => {
    if (room) {
      const { name } = JSON.parse(localStorage.getItem('data'));
      const _user = room.Players.filter((player) => player.name === name)[0];
      setUser(_user);
      const _spies = room.Players.filter((player) => player.is_spy);
      setSpies(_spies);
    }
    // console.log(room);
  }, [room, user]);

  useEffect(() => {
    if (!mission || !user) return;

    if (!mission.Votes?.map((v) => v.PlayerId).includes(user.id))
      setLoadingVotePlayers(false);
  }, [mission, user]);

  const PropunerePlecare = () => {
    const necesarJucatori = [
      [2, 3, 2, 3, 3],
      [2, 3, 4, 3, 4],
      [2, 3, 3, 4, 4],
      [3, 4, 4, 5, 5],
      [3, 4, 4, 5, 5],
      [3, 4, 4, 5, 5],
    ];
    const misiuniPrecedente = room.Missions.filter(
      (m) => m.is_starting === 1
    ).length;
    const numarJucatori =
      necesarJucatori[room.Players.length - 5][misiuniPrecedente];

    const createMission = async () => {
      setLoadingCreateMission(true);
      await axios.post(`/api/mission/room/${room.id}`, {
        players: selectat,
        id_creator: user.id,
      });
      sendUpdate();
    };

    return (
      <>
        <h2 className={classes.subtitle}>Start mission</h2>
        <h3 className={classes.description}>
          Select {numarJucatori} players for the mission
        </h3>
        <Container my='sm'>
          <Grid>
            {room.Players.map((player) => (
              <Grid.Col xs={4} key={player.id}>
                <Card
                  shadow='sm'
                  p='xl'
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: selectat.includes(player.id)
                      ? colors.gray[7]
                      : '',
                  }}
                  onClick={() => {
                    if (selectat.includes(player.id)) {
                      //sterge player
                      const copie = [...selectat];
                      copie.splice(copie.indexOf(player.id), 1);
                      setSelectat(copie);
                    } else if (selectat.length < numarJucatori) {
                      //adauga player
                      const copie = [...selectat];
                      copie.push(player.id);
                      setSelectat(copie);
                    } else
                      showNotification({
                        title: 'Error',
                        message: 'Too many players selected',
                        color: 'red',
                      });
                  }}
                >
                  <Group position='center'>
                    <Text size='md'>
                      {player.name}
                      {player.is_lider && ' (Lider)'}
                    </Text>
                  </Group>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
          <Button
            size='lg'
            disabled={numarJucatori > selectat.length}
            my='30px'
            loading={loadingCreateMission}
            onClick={createMission}
          >
            Start voting
          </Button>
        </Container>
      </>
    );
  };

  const VotPlecare = () => {
    const voteazaPlecare = async (result) => {
      setLoadingVotePlayers(true);
      await axios.post(`/api/mission/vote`, {
        result,
        PlayerId: user.id,
        MissionId: mission.id,
      });
      sendUpdate();
      setLoadingCreateMission(false);
      setLoadingVoteMission(false);
    };

    return (
      <>
        {mission && (
          <>
            <h2 className={classes.subtitle}>
              Vote if the mission starts or not
            </h2>
            <h3 className={classes.description}>
              The players that will go are{' '}
              {mission.Players.map((m) => m.name).join(', ')}
            </h3>
            <Container>
              <Button
                variant='filled'
                color='blue'
                size='lg'
                m={10}
                onClick={() => voteazaPlecare(true)}
                loading={loadingVotePlayers}
              >
                Accept
              </Button>
              <Button
                variant='filled'
                color='red'
                size='lg'
                m={10}
                onClick={() => voteazaPlecare(false)}
                loading={loadingVotePlayers}
              >
                Refuse
              </Button>
            </Container>
          </>
        )}
      </>
    );
  };

  const PlecareFaraTine = () => {
    React.useState(() => {}, []);
    return (
      <Container>
        <Text size='xl'>Wait for the result of the mission</Text>
        <Loader size='xl' />
      </Container>
    );
  };

  const Plecare = () => {
    const sendResultOfMission = async (result) => {
      setLoadingVoteMission(true);
      await axios.post(`/api/mission/result/${mission.id}`, { result });
      sendUpdate();
    };
    return (
      <Container>
        <h2 className={classes.description}>
          Vote for the result of the mission
        </h2>
        {console.log(mission.Players.map((p) => p.id))}
        {console.log(user.id)}
        <Button
          m='xl'
          size='lg'
          loading={loadingVoteMission}
          onClick={() => sendResultOfMission(true)}
        >
          Success
        </Button>

        {spies.map((s) => s.id).includes(user.id) && (
          <Button
            m='xl'
            size='lg'
            color='red'
            loading={loadingVoteMission}
            onClick={() => sendResultOfMission(false)}
          >
            Fail
          </Button>
        )}
      </Container>
    );
  };

  function JocTerminat() {
    return (
      <Container
        className={classes.inner}
        my='xl'
        p='xl'
        style={{
          backgroundColor: room.result ? colors.blue[9] : colors.red[9],
          borderRadius: '20px',
        }}
      >
        {room.result ? (
          <Text className={classes.title}>The resistance won</Text>
        ) : (
          <Text className={classes.title}>The spies won</Text>
        )}

        <Text className={classes.subtitle}>The spies were:</Text>
        {room.Players.filter((p) => p.is_spy).map((player) => (
          <Text
            className={classes.subtitle}
            m='md'
            component='span'
            key={player.id}
          >
            {player.name}
          </Text>
        ))}
      </Container>
    );
  }

  return (
    <div className={classes.wrapper}>
      {user && room && !room.is_finished && (
        <Container
          className={classes.inner}
          // sx={{ backgroundColor: user.is_spy ? colors.red[6] : colors.blue[9] }}
        >
          <h1 className={classes.title}>
            You are a{' '}
            {user.is_spy ? (
              <Text
                component='span'
                variant='gradient'
                gradient={{ from: colors.red[9], to: colors.red[8] }}
                inherit
              >
                spy, with{' '}
                {spies
                  .filter((spy) => spy.name !== user.name)
                  .map((spy) => spy.name)
                  .join(', ')}
              </Text>
            ) : (
              <Text
                component='span'
                variant='gradient'
                gradient={{ from: 'blue', to: 'cyan' }}
                inherit
              >
                resistance member
              </Text>
            )}
          </h1>
          <Players room={room} userId={user.id} />
          <Divider my='xl' />
          <Accordion multiple>
            {room.Missions?.length > 0 &&
              room.Missions.filter(
                (m) =>
                  m.id_creator !== room.Players.filter((p) => p.is_lider)[0].id
              )
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                .map((misiune, index) => (
                  <Accordion.Item
                    label={
                      misiune.is_starting === 1
                        ? `Mission ${
                            room.Missions.filter((m) => m.is_starting === 1)
                              .sort(
                                (a, b) =>
                                  new Date(a.createdAt) - new Date(b.createdAt)
                              )
                              .map((m) => m.id)
                              .indexOf(misiune.id) + 1
                          }`
                        : 'Mission not started'
                    }
                    key={misiune.id}
                  >
                    <Mission mission={misiune} players={room.Players} />
                  </Accordion.Item>
                ))}
          </Accordion>
          {user.is_lider &&
            mission?.id_creator !== user.id &&
            mission?.is_starting !== -1 && <PropunerePlecare />}

          {mission?.is_starting === -1 && <VotPlecare />}
          {mission &&
            mission.is_starting === 1 &&
            mission.is_success === -1 &&
            (mission.Players.map((p) => p.id).includes(user.id) ? (
              <Plecare />
            ) : (
              <PlecareFaraTine />
            ))}
        </Container>
      )}
      {user && room && room.is_finished && JocTerminat()}
    </div>
  );
}
