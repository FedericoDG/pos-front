import { Box, Stack } from '@chakra-ui/react';

import { DashBoard } from '../componets/common';
import { CurrentAccountProvider } from '../componets/current_account/context';
import { Sheet, StepperWrapper, Steps, SupplierAndWarehouse } from '../componets/current_account';

export const CurrentAccount = () => {
  return (
    <CurrentAccountProvider>
      <DashBoard isIndeterminate={false} title="Cuenta Corriente">
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
    </CurrentAccountProvider>
  );
};
