import { Box, Stack } from '@chakra-ui/react';

import { DashBoard } from '../componets/common';
import { PurchasesProvider } from '../componets/stepper/context';
import {
  StepperWrapper,
  Basket,
  ProductsTable,
  Stepper,
  SupplierAndWarehouse,
  Card,
} from '../componets/stepper';
import { TransportAndDriver } from '../componets/stepper/TransportAndDriver';

export const StepperA = () => {
  return (
    <PurchasesProvider>
      <DashBoard isIndeterminate={false} title="Cargar Compra">
        <Stepper />

        <Box w="1080px">
          <StepperWrapper step={1}>
            <SupplierAndWarehouse />
          </StepperWrapper>

          <StepperWrapper step={2}>
            <TransportAndDriver />
          </StepperWrapper>

          <StepperWrapper step={3}>
            <Stack>
              <Card />
              <Stack alignItems="flex-start" direction="row">
                <ProductsTable />
                <Basket />
              </Stack>
            </Stack>
          </StepperWrapper>
        </Box>
      </DashBoard>
    </PurchasesProvider>
  );
};
