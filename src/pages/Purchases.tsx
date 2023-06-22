import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { HiPlus } from 'react-icons/Hi';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CustomTable } from '../componets/table';
import { DashBoard } from '../componets/common';
import { ConfirmationModal, Drawer } from '../componets/purchases';
import { Loading } from '../componets/common';
import { Purchase } from '../interfaces';
import { useColumns } from '../componets/purchases/hooks';
import { useGetPurchases } from '../hooks';

export const Purchases = () => {
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

  const { data: purchases, isFetching: isFetchingPurchases } = useGetPurchases();

  /*   useEffect(() => {
    if (!categories || !units) return;

    resetValues.categoryId = categories[0].id!;
    resetValues.unitId = units[0].id!;
  }, [categories, resetValues, units]); */

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
