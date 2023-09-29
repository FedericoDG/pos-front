import { Box, Stack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { DashBoard, Loading } from '../componets/common';
import { PosProvider } from '../componets/credit_note/context';
import { Card, ProductsTable, StepperWrapper, Steps } from '../componets/credit_note';
import { useGetCashMovement } from '../hooks';

export const CreditNote = () => {
  const { id } = useParams();

  const { data: cashMovement, isFetching } = useGetCashMovement(Number(id));

  return (
    <PosProvider>
      <DashBoard isIndeterminate={isFetching} title="Crear Nota de Crédito">
        {!cashMovement?.cashMovementDetails ? (
          <Loading />
        ) : (
          <>
            {/* <Steps /> */}

            <Box w="full">
              <StepperWrapper step={1}>
                <Stack>
                  <Card cashMovement={cashMovement} />
                  <ProductsTable cashMovement={cashMovement} />
                </Stack>
              </StepperWrapper>

              {/*  <StepperWrapper step={2}>
                <Stack>
                  <Card cashMovement={cashMovement} />
                  <FinishSale />
                </Stack>
              </StepperWrapper> */}
            </Box>
          </>
        )}
      </DashBoard>
    </PosProvider>
  );
};
