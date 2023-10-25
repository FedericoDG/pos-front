import { Stack, Text } from '@chakra-ui/react';

import { DashBoard } from '../componets/common';

const Component = () => (
  <Stack bg="white" p={8}>
    <Text>Martes 25/10</Text>
    <Text>FRAN:</Text>
    <Text>Fijate si cumple más o menos con lo que querías.</Text>
    <Text>
      El backend está todo `agarrado con alambre`, hay que probarlo bien, voy a necesitar solucionar
      cosas. Digamos que quedó todo andando a medias, tengo muchísimo código spaghetti para
      arreglar.
    </Text>
    <Text>
      En la parte de Balance, el selector Tipo de Comprobantes detecta si están activadas las
      Facturas A ó M.
    </Text>
    <Text>
      También agrupé las facturas en los Detalles de Movimiento. Se muestra todo en un renglón, pero
      se pierde la chance de filtrar por forma de pago.
    </Text>
  </Stack>
);

export const Home = () => (
  <DashBoard isIndeterminate={false} title="Inicio">
    <Component />
  </DashBoard>
);
