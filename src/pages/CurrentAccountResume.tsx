import { Box } from '@chakra-ui/react';

import { DashBoard } from '../componets/common';
import { CurrentAccountProvider } from '../componets/current_account/context';

export const CurrentAccountResume = () => {
  return (
    <CurrentAccountProvider>
      <DashBoard isIndeterminate={false} title="Cuenta Corriente - Resumen">
        <Box w="full">CuentaCorriente</Box>
      </DashBoard>
    </CurrentAccountProvider>
  );
};
