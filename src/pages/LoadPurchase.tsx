import { Box, Stack } from '@chakra-ui/react';

import { DashBoard } from '../componets/common';
import { PurchasesProvider } from '../componets/load_purchase/context';
import {
  Basket,
  Card,
  ProductsTable,
  StepperWrapper,
  Steps,
  SupplierAndWarehouse,
  TransportAndDriver,
} from '../componets/load_purchase';

export const LoadPurchase = () => {
  return (
    <PurchasesProvider>
      <DashBoard isIndeterminate={false} title="Cargar Compra">
        <Steps />

        <Box w="full">
          <StepperWrapper step={1}>
            <SupplierAndWarehouse />
          </StepperWrapper>

          <StepperWrapper step={2}>
            <TransportAndDriver />
          </StepperWrapper>

          <StepperWrapper step={3}>
            <Stack>
              <Card />
              <Stack
                alignItems="flex-start"
                bg="white"
                direction="row"
                p="4"
                rounded="md"
                shadow="md"
              >
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
