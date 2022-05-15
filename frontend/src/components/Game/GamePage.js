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
} from '@mantine/core';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { w3cwebsocket } from 'websocket';
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

  const [room, setRoom] = useState(null);
  const [user, setUser] = useState(null);
  const [spies, setSpies] = useState([]);
  const [selectat, setSelectat] = useState([]);
  const [mission, setMission] = useState(null);
  const [loadingCreateMission, setLoadingCreateMission] = useState(false);
  const [loadingVoteMission, setLoadingVoteMission] = useState(false);
  const [loadingResultMission, setLoadingResultMission] = useState(false);

  const { classes } = useStyles();
  const { colors } = useMantineTheme();

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
      const data = JSON.parse(message.data);
      setRoom(data);
      if (data.Missions.length > 0) {
        setMission(data.Missions.filter((m) => m.is_success === -1)[0]);
      } else setMission(null);
    };
    return () => clearInterval(timer);
  }, [id]);

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

  const PropunerePlecare = () => {
    const necesarJucatori = [
      [2, 2, 2, 3, 3, 3],
      [3, 3, 3, 4, 4, 4],
      [2, 4, 3, 4, 4, 4],
      [3, 3, 4, 5, 5, 5],
      [3, 4, 4, 5, 5, 5],
    ];
    const misiuniPrecedente = room.Missions.map(
      (m) => m.is_starting === 1
    ).length;
    const numarJucatori =
      necesarJucatori[misiuniPrecedente][room.Players.length - 5];

    const createMission = async () => {
      setLoadingCreateMission(true);
      await axios.post(`/api/mission/room/${room.id}`, {
        players: selectat,
        id_creator: user.id,
      });
      setLoadingCreateMission(false);
    };

    return (
      <>
        <h2 className={classes.subtitle}>Start mission</h2>
        <h3 className={classes.description}>
          Select {numarJucatori} players for the mission
        </h3>
        <Container my='sm'>
          <Grid>
            {room.Players.map((player, index) => (
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
                    } else alert('prea multi');
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
      setLoadingVoteMission(true);
      await axios.post(`/api/mission/vote`, {
        result,
        PlayerId: user.id,
        MissionId: mission.id,
      });
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
                loading={loadingVoteMission}
              >
                Accept
              </Button>
              <Button
                variant='filled'
                color='red'
                size='lg'
                m={10}
                onClick={() => voteazaPlecare(false)}
                loading={loadingVoteMission}
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
    return (
      <Container>
        <Text size='xl'>Wait for the result of the mission</Text>
        <Loader size='xl' />
      </Container>
    );
  };

  const Plecare = () => {
    const sendResultOfMission = async (result) => {
      setLoadingResultMission(true);
      await axios.post(`/api/mission/result/${mission.id}`, { result });
    };
    return (
      <Container>
        <h2 className={classes.description}>
          Vote for the result of the mission
        </h2>
        <Button
          m='xl'
          size='lg'
          loading={loadingResultMission}
          onClick={() => sendResultOfMission(true)}
        >
          Success
        </Button>

        {spies.map((s) => s.id).includes(user.id) && (
          <Button
            m='xl'
            size='lg'
            color='red'
            loading={loadingResultMission}
            onClick={() => sendResultOfMission(false)}
          >
            Fail
          </Button>
        )}
      </Container>
    );
  };

  return (
    <div className={classes.wrapper}>
      {user && room && (
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
          {room.Missions?.length > 0 &&
            room.Missions.filter((m) => m.is_success !== -1).map((misiune) => (
              <Mission mission={misiune} key={misiune.id} />
            ))}
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
    </div>
  );
}
