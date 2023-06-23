import { Box, Button } from '@chakra-ui/react';
import { HiPlus } from 'react-icons/Hi';
import { useNavigate } from 'react-router-dom';

import { CustomTable } from '../componets/table';
import { DashBoard } from '../componets/common';
import { Loading } from '../componets/common';
import { useColumns } from '../componets/transfers/hooks';
import { useGetTransfers } from '../hooks';

export const Transfers = () => {
  const navigate = useNavigate();

  const { data: transfers, isFetching: isFetchingTransfers } = useGetTransfers();

  const isIndeterminate = isFetchingTransfers;

  const { columns } = useColumns();

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Transferencia de stock">
      <Button
        colorScheme="brand"
        leftIcon={<HiPlus />}
        mb={4}
        ml="auto"
        size="lg"
        onClick={() => navigate('/panel/stock/transferencias/crear')}
      >
        TRANSFERRIR STOCK
      </Button>

      {!transfers ? (
        <Loading />
      ) : (
        <>
          <Box w="full">
            <CustomTable
              showColumsSelector
              showGlobalFilter
              showNavigation
              showPrintOption
              amount={transfers.length}
              columns={columns}
              data={transfers}
            />
          </Box>
        </>
      )}
    </DashBoard>
  );
};
