import {
  Container,
  Grid,
  Group,
  Text,
  Card,
  useMantineTheme,
} from '@mantine/core';
import React from 'react';

export default function Players({ room, userId }) {
  const spies = room?.Players?.filter((s) => s.is_spy).map((s) => s.id);
  console.log(spies);
  const { colors } = useMantineTheme();
  return (
    <Container my='md'>
      <Grid>
        {room &&
          room.Players.map((player) => (
            <Grid.Col xs={4} key={player.id}>
              <Card
                shadow='sm'
                p='xl'
                sx={{
                  backgroundColor:
                    spies.includes(player.id) && spies.includes(userId)
                      ? colors.red[9]
                      : '',
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
    </Container>
  );
}
