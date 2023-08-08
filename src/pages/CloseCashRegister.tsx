import { Box, Stack } from '@chakra-ui/react';

import { DashBoard } from '../componets/common';
import { DischargesProvider } from '../componets/close_cash_register/context';
import { Finish } from '../componets/close_cash_register/Finish';
import {
  Basket,
  Card,
  DischargesTable,
  StepperWrapper,
  Steps,
  SupplierAndWarehouse,
} from '../componets/close_cash_register';

export const CloseCashRegister = () => {
  return (
    <DischargesProvider>
      <DashBoard isIndeterminate={false} title="Cerrar Caja">
        <Steps />
        <Box w="1080px">
          <StepperWrapper step={1}>
            <SupplierAndWarehouse />
          </StepperWrapper>
          <StepperWrapper step={2}>
            <Stack>
              <Card />
              <Stack alignItems="flex-start" direction="row">
                <DischargesTable />
                <Basket />
              </Stack>
            </Stack>
          </StepperWrapper>
          <StepperWrapper step={3}>
            <Stack>
              <Card />
              <Finish />
            </Stack>
          </StepperWrapper>
        </Box>
      </DashBoard>
    </DischargesProvider>
  );
};
