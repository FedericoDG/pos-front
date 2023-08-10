import { Box, Stack } from '@chakra-ui/react';

import { DashBoard } from '../componets/common';
import { ProductTransProvider } from '../componets/load_product_trans_driver/context';
import {
  Basket,
  Card,
  DischargesTable,
  StepperWrapper,
  Steps,
  SupplierAndWarehouse,
} from '../componets/load_product_trans_driver';

export const LoadProductTransDriver = () => {
  return (
    <ProductTransProvider>
      <DashBoard isIndeterminate={false} title="Transferencia entre depósito y chofer">
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
    </ProductTransProvider>
  );
};
