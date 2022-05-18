import { Container, Text, useMantineTheme } from '@mantine/core';
import React from 'react';

export default function Mission({ mission, players }) {
  const { colors } = useMantineTheme();

  return (
    <>
      <Container
        size='xl'
        pb='lg'
        fluid
        style={{
          backgroundColor: mission.is_starting
            ? mission.is_success
              ? colors.blue[9]
              : colors.red[9]
            : '',
          borderRadius: '20px',
        }}
      >
        <Text size='xl'>Mission</Text>
        <Text size='xl'>
          {mission.is_starting
            ? mission.is_success
              ? 'Passed'
              : 'Failed'
            : 'Not started'}
        </Text>
        <Text size='xl' mt='lg'>
          The players that went are:
        </Text>
        {mission.Players.map((player) => (
          <Text
            size='xl'
            m='md'
            component='span'
            key={`mission ${mission.id} player ${player.id}`}
          >
            {players.filter((p) => p.id === player.id)[0].name + '\t'}
          </Text>
        ))}
        <Text size='xl' mx='md' mt='lg'>
          Players that voted for the mission:
        </Text>
        {mission.Votes.filter((v) => v.result).map((vote) => (
          <Text size='xl' mx='md' component='span' key={vote.id}>
            {players.filter((p) => p.id === vote.PlayerId)[0].name + '\t'}
          </Text>
        ))}
        <Text size='xl' mt='lg'>
          Players that voted against the mission:
        </Text>
        {mission.Votes.filter((v) => !v.result).map((vote) => (
          <Text size='xl' mx='md' component='span' key={vote.id}>
            {players.filter((p) => p.id === vote.PlayerId)[0].name + '\t'}
          </Text>
        ))}
      </Container>
    </>
  );
}
