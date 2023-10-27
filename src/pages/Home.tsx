import { Stack, Text } from '@chakra-ui/react';

import { DashBoard } from '../componets/common';

const Component = () => (
  <Stack bg="white" p={8}>
    <Text>Martes 27/10</Text>
    <Text>FRAN:</Text>
    <Text>Está corregida la tabla Detalle de Movimientos. Ahora muestra los Clientes.</Text>
    <Text>
      En el Informe de Ingresos ahora no muestra comprobantes que están en cero, como me pediste.
    </Text>
    <Text>
      Está hecho (o eso creo) en el backend que hacelas Notas de Crédito X. Tuve que hacer cambios
      grandes en algunos controladores.
    </Text>
    <Text>
      No llegué a hacer el frontend (avancés un poco pero está roto), por eso no lo subí. Mañana lo
      termino.
    </Text>
    <Text>
      Probando cosas encontré unos errores complicados, pero al menos sé por qué suceden. Estoy
      viendo la mejor forma de arreglarlos.
    </Text>
  </Stack>
);

export const Home = () => (
  <DashBoard isIndeterminate={false} title="Inicio">
    <Component />
  </DashBoard>
);
