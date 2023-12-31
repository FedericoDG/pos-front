import { Box, Stack } from '@chakra-ui/react';

import { DashBoard } from '../componets/common';
import { CostsProvider } from '../componets/load_cost/context';
import { Basket, CostTable } from '../componets/load_cost';

export const LoadCosts = () => {
  return (
    <CostsProvider>
      <DashBoard isIndeterminate={false} title="Actualizar Costos">
        <Box bg="white" p="4" rounded="md" shadow="md" w="full">
          <Stack>
            <Stack alignItems="flex-start" direction="row">
              <CostTable />
              <Basket />
            </Stack>
          </Stack>
        </Box>
      </DashBoard>
    </CostsProvider>
  );
};
