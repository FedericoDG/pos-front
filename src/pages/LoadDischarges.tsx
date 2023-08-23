import { Box, Stack } from '@chakra-ui/react';

import { DashBoard } from '../componets/common';
import { DischargesProvider } from '../componets/load_discharges/context';
import {
  Basket,
  Card,
  DischargesTable,
  StepperWrapper,
  Steps,
  SupplierAndWarehouse,
} from '../componets/load_discharges';

export const LoadDischarges = () => {
  return (
    <DischargesProvider>
      <DashBoard isIndeterminate={false} title="Cargar Baja de Stock">
        <Steps />
        <Box w="full">
          <StepperWrapper step={1}>
            <SupplierAndWarehouse />
          </StepperWrapper>
          <StepperWrapper step={2}>
            <Stack>
              <Card />
              <Stack alignItems="flex-start" bg="white" direction="row" p="4">
                <DischargesTable />
                <Basket />
              </Stack>
            </Stack>
          </StepperWrapper>
        </Box>
      </DashBoard>
    </DischargesProvider>
  );
};
