import { Box, Button } from '@chakra-ui/react';
import { HiPlus } from 'react-icons/Hi';
import { useNavigate } from 'react-router-dom';

import { CustomTable } from '../componets/table';
import { DashBoard } from '../componets/common';
import { Loading } from '../componets/common';
import { useColumns } from '../componets/purchases/hooks';
import { useGetPurchases } from '../hooks';

export const Purchases = () => {
  const navigate = useNavigate();

  const { data: purchases, isFetching: isFetchingPurchases } = useGetPurchases();

  const isIndeterminate = isFetchingPurchases;

  const { columns } = useColumns();

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Compras">
      <Button
        colorScheme="brand"
        leftIcon={<HiPlus />}
        mb={4}
        ml="auto"
        size="lg"
        onClick={() => navigate('/panel/stock/compras/cargar')}
      >
        CARGAR COMPRA
      </Button>

      {!purchases ? (
        <Loading />
      ) : (
        <>
          <Box w="full">
            <CustomTable
              showColumsSelector
              showGlobalFilter
              showNavigation
              showPrintOption
              amount={purchases.length}
              columns={columns}
              data={purchases}
            />
          </Box>
        </>
      )}
    </DashBoard>
  );
};
