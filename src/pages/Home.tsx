import { Stack } from '@chakra-ui/react';

import { DashBoard } from '../componets/common';

const Component = () => <Stack p={8} />;

export const Home = () => (
  <DashBoard isIndeterminate={false} title="Inicio">
    <Component />
  </DashBoard>
);
