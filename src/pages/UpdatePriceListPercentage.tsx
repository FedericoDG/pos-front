import { Box, Stack } from '@chakra-ui/react';

import { DashBoard } from '../componets/common';
import { UpdatePricePercentageProvider } from '../componets/update_pricelist_percentage/context';
import {
  Card,
  FinishSale,
  ProductsTable,
  StepperWrapper,
  Steps,
  SupplierAndWarehouse,
} from '../componets/update_pricelist_percentage';

export const UpdatePriceListPercentage = () => {
  return (
    <UpdatePricePercentageProvider>
      <DashBoard isIndeterminate={false} title="Actualizar Lista de Precios - Porcentaje">
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
    </UpdatePricePercentageProvider>
  );
};
