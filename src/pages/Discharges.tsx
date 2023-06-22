import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { HiPlus } from 'react-icons/Hi';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CustomTable } from '../componets/table';
import { DashBoard } from '../componets/common';
import { ConfirmationModal, Drawer } from '../componets/discharges';
import { Loading } from '../componets/common';
import { Purchase } from '../interfaces';
import { useColumns } from '../componets/discharges/hooks';
import { useGetDischarges, useGetPurchases } from '../hooks';

export const Discharges = () => {
  //const { isOpen, onOpen, onClose } = useDisclosure();
  //const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure();

  /*  const resetValues: Product = useMemo(
    () => ({
      code: '',
      barcode: '',
      name: '',
      description: '',
      categoryId: 1,
      unitId: 1,
      status: 'ENABLED',
      allownegativestock: 'DISABLED',
      alertlowstock: 'DISABLED',
      lowstock: 0,
    }),
    []
  ); */

  // const [initialValues, setinitialValues] = useState(resetValues);

  const navigate = useNavigate();

  const { data: discharges, isFetching: isFetchingDischarges } = useGetDischarges();

  /*   useEffect(() => {
    if (!categories || !units) return;

    resetValues.categoryId = categories[0].id!;
    resetValues.unitId = units[0].id!;
  }, [categories, resetValues, units]); */

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
          {/* <Drawer
            categories={categories}
            initialValues={initialValues}
            isOpen={isOpen}
            resetValues={resetValues}
            setinitialValues={setinitialValues}
            units={units}
            onClose={onClose}
          />
          <ConfirmationModal
            initialValues={initialValues}
            isOpen={isOpenModal}
            resetValues={resetValues}
            setinitialValues={setinitialValues}
            onClose={onCloseModal}
          /> */}
        </>
      )}
    </DashBoard>
  );
};
