import { Box, Stack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { DashBoard, Loading } from '../componets/common';
import { PosProvider } from '../componets/credit_note/context';
import { Card, ProductsTable, StepperWrapper } from '../componets/credit_note';
import { useGetCashMovement } from '../hooks';

export const CreditNote = () => {
  const { id } = useParams();

  const { data: cashMovement, isFetching } = useGetCashMovement(Number(id));

  console.log(cashMovement);

  return (
    <PosProvider>
      <DashBoard isIndeterminate={isFetching} title="Crear Nota de Crédito">
        {!cashMovement?.cashMovementDetails ? (
          <Loading />
        ) : (
          <Box w="full">
            <StepperWrapper step={1}>
              <Stack>
                <Card cashMovement={cashMovement} />
                <ProductsTable cashMovement={cashMovement} />
              </Stack>
            </StepperWrapper>
          </Box>
        )}
      </DashBoard>
    </PosProvider>
  );
};
