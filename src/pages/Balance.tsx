import { Box, Stack } from '@chakra-ui/react';

import { DashBoard } from '../componets/common';
import { BalanceProvider } from '../componets/balance/context';
import { Sheet, StepperWrapper, Steps, SupplierAndWarehouse } from '../componets/balance';

export const Balance = () => {
  return (
    <BalanceProvider>
      <DashBoard isIndeterminate={false} title="Ingresos">
        <Steps />
        <Box w="full">
          <StepperWrapper step={1}>
            <SupplierAndWarehouse />
          </StepperWrapper>
          <StepperWrapper step={2}>
            <Stack>
              <Stack alignItems="flex-start" bg="white" direction="row" p="4">
                <Sheet />
              </Stack>
            </Stack>
          </StepperWrapper>
        </Box>
      </DashBoard>
    </BalanceProvider>
  );
};
