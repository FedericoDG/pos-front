import { Stack, Text } from '@chakra-ui/react';

import { DashBoard } from '../componets/common';

const Component = () => (
  <Stack bg="white" p={8}>
    <Text>Martes 26/10</Text>
    <Text>FRAN:</Text>
    <Text>Fijate si qué la parte de INGRESOS. Probá descargar el Excel.</Text>
    <Text>
      Te mando un mensaje por la tarde por si hay que modificar algo. Seguiré con el tema de poder
      hacer Notas de Crédito para los comprobantes X.
    </Text>
  </Stack>
);

export const Home = () => (
  <DashBoard isIndeterminate={false} title="Inicio">
    <Component />
  </DashBoard>
);
