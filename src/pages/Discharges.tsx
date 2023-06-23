import { Box, Button } from '@chakra-ui/react';
import { HiPlus } from 'react-icons/Hi';
import { useNavigate } from 'react-router-dom';

import { CustomTable } from '../componets/table';
import { DashBoard } from '../componets/common';
import { Loading } from '../componets/common';
import { useColumns } from '../componets/discharges/hooks';
import { useGetDischarges } from '../hooks';

export const Discharges = () => {
  const navigate = useNavigate();

  const { data: discharges, isFetching: isFetchingDischarges } = useGetDischarges();

  const isIndeterminate = isFetchingDischarges;

  const { columns } = useColumns();

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Baja de Productos">
      <Button
        colorScheme="brand"
        leftIcon={<HiPlus />}
        mb={4}
        ml="auto"
        size="lg"
        onClick={() => navigate('/panel/stock/bajas/cargar')}
      >
        CARGAR BAJA DE PRODUCTOS
      </Button>

      {!discharges ? (
        <Loading />
      ) : (
        <>
          <Box w="full">
            <CustomTable
              showColumsSelector
              showGlobalFilter
              showNavigation
              showPrintOption
              amount={discharges.length}
              columns={columns}
              data={discharges}
            />
          </Box>
        </>
      )}
    </DashBoard>
  );
};
