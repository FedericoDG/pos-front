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
        </Box>
      </DashBoard>
    </DischargesProvider>
  );
};
