import { Box, Button } from '@chakra-ui/react';
import { HiPlus } from 'react-icons/Hi';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { CustomTable } from '../componets/table';
import { DashBoard } from '../componets/common';
import { Loading } from '../componets/common';
import { useColumns } from '../componets/transfers/hooks';
import { useGetTransfers } from '../hooks';

export const TransfersDriver = () => {
  const navigate = useNavigate();

  const { data: transfers, isFetching: isFetchingTransfers } = useGetTransfers();

  const isIndeterminate = isFetchingTransfers;

  const { columns } = useColumns();

  useEffect(() => {
    const handleUserKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        return navigate('/panel/stock/transferencias-choferes/crear');
      }
    };

    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [navigate]);

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Transferencia de stock a chofer">
      <Button
        colorScheme="brand"
        leftIcon={<HiPlus />}
        mb={4}
        ml="auto"
        size="lg"
        onClick={() => navigate('/panel/stock/transferencias-choferes/crear')}
      >
        TRANFERIR STOCK
      </Button>

      {!transfers ? (
        <Loading />
      ) : (
        <>
          <Box bg="white" p="4" rounded="md" shadow="md" w="full">
            <CustomTable
              showColumsSelector
              showGlobalFilter
              showNavigation
              showPrintOption
              amount={transfers.filter((el) => el.warehouseDestination.driver === 1).length}
              columns={columns}
              data={transfers.filter((el) => el.warehouseDestination.driver === 1)}
            />
          </Box>
        </>
      )}
    </DashBoard>
  );
};
