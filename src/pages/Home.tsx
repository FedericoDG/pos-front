import { Stack, Text } from '@chakra-ui/react';

import { DashBoard } from '../componets/common';

const Component = () => (
  <Stack bg="white" p={8}>
    <Text>Martes 24/10</Text>
    <Text>FRAN:</Text>
    <ul>
      <li>
        <Text>Creá un venta con Factura A de al menos $5000</Text>
      </li>
      <li>
        <Text>Creá un venta con Factura B de al menos $5000</Text>
      </li>
      <li>
        <Text>Creá un venta con Factura X de al menos $5000</Text>
      </li>
      <li>
        <Text>Creá una Nota de Crédito</Text>
      </li>
      <li>
        <Text>Hacé una Compra</Text>
      </li>
      <li>
        <Text>Hacé una Baja de Productos</Text>
      </li>
    </ul>
    <Text>
      Andá a Balance para obtener un informe y decime si la tabla DETALLE DE MOVIMIENTOS te parece
      bien
    </Text>
    <Text>
      No quiero hacer el Excel hasta que esa tabla esté bien... Esa tabla tiene mucha `magia` para
      que se vea así y tengo que estar seguro antes de intentar pasarla a Excel.
    </Text>
    <Text>Hablamos por la tarde y de ser posible la meet la hacemos tipo 20.45 hs.</Text>
  </Stack>
);

export const Home = () => (
  <DashBoard isIndeterminate={false} title="Inicio">
    <Component />
  </DashBoard>
);
