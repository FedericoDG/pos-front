import { Box, Button } from '@chakra-ui/react';
import { HiPlus } from 'react-icons/Hi';
import { useEffect } from 'react';
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

  useEffect(() => {
    const handleUserKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        return navigate('/panel/stock/bajas/cargar');
      }
    };

    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [navigate]);

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
          <Box bg="white" p="4" rounded="md" shadow="md" w="full">
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
