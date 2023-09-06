import { Box, Stack } from '@chakra-ui/react';

import { DashBoard } from '../componets/common';
import { UpdatePriceProvider } from '../componets/update_pricelist/context';
import {
  Card,
  FinishSale,
  ProductsTable,
  StepperWrapper,
  Steps,
  SupplierAndWarehouse,
} from '../componets/update_pricelist';

export const UpdatePriceList = () => {
  return (
    <UpdatePriceProvider>
      <DashBoard isIndeterminate={false} title="Actualizar Lista de Precios">
        <>
          <Steps />

          <Box w="full">
            <StepperWrapper step={1}>
              <SupplierAndWarehouse />
            </StepperWrapper>

            <StepperWrapper step={2}>
              <Stack>
                <Card />
                <ProductsTable />
              </Stack>
            </StepperWrapper>

            <StepperWrapper step={3}>
              <Stack>
                <Card />
                <FinishSale />
              </Stack>
            </StepperWrapper>
          </Box>
        </>
      </DashBoard>
    </UpdatePriceProvider>
  );
};
