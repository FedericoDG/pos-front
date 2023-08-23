import { Box, Button } from '@chakra-ui/react';
import { HiPlus } from 'react-icons/Hi';
import { useEffect } from 'react';
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

  useEffect(() => {
    const handleUserKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        return navigate('/panel/stock/compras/cargar');
      }
    };

    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [navigate]);

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
          <Box bg="white" p="4" rounded="md" shadow="md" w="full">
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
