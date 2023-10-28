import { Stack, Text } from '@chakra-ui/react';

import { DashBoard } from '../componets/common';

const Component = () => (
  <Stack bg="white" p={8}>
    <Text>Sábado 28/10</Text>
    <Text>FRAN:</Text>
    <Text>Ya están implementadas las Notas de Crédito X.</Text>
  </Stack>
);

export const Home = () => (
  <DashBoard isIndeterminate={false} title="Inicio">
    <Component />
  </DashBoard>
);
