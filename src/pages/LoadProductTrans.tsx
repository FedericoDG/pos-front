import { Box, Stack } from '@chakra-ui/react';

import { DashBoard } from '../componets/common';
import { ProductTransProvider } from '../componets/load_product_trans/context';
import {
  Basket,
  Card,
  DischargesTable,
  StepperWrapper,
  Steps,
  SupplierAndWarehouse,
} from '../componets/load_product_trans';

export const LoadProductTrans = () => {
  return (
    <ProductTransProvider>
      <DashBoard isIndeterminate={false} title="Transferencia entre depósitos">
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
    </ProductTransProvider>
  );
};
