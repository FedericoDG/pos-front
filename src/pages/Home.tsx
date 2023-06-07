import { Text } from '@chakra-ui/react';

import { DashBoard } from '../componets/common';

const Component = () => <Text>Home</Text>;

export const Home = () => (
  <DashBoard isIndeterminate={false} title="Inicio">
    <Component />
  </DashBoard>
);
