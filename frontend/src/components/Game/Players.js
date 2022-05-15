import { Container, Grid, Group, Text, Card } from '@mantine/core';
import React from 'react';

export default function Players({ room }) {
  return (
    <Container my='md'>
      <Grid>
        {room &&
          room.Players.map((player) => (
            <Grid.Col xs={4} key={player.id}>
              <Card shadow='sm' p='xl'>
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
