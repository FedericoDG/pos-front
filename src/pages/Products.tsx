import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { HiPlus } from 'react-icons/Hi';
import { useEffect, useMemo, useState } from 'react';

import { ConfirmationModal, Drawer } from '../componets/products';
import { CustomTable } from '../componets/table';
import { DashBoard } from '../componets/common';
import { Loading } from '../componets/common/';
import { Product } from '../interfaces';
import { useColumns } from '../componets/products/hooks';
import { useGetCategories, useGetUnits, useGetProducts, useGetIvaConditions } from '../hooks';

export const Products = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure();

  const resetValues: Product = useMemo(
    () => ({
      code: '',
      barcode: '',
      name: '',
      description: '',
      categoryId: 1,
      unitId: 1,
      ivaConditionId: 1,
      status: 'ENABLED',
      allownegativestock: 'DISABLED',
      alertlowstock: 'DISABLED',
      lowstock: 0,
    }),
    []
  );

  const [initialValues, setinitialValues] = useState(resetValues);

  const { data: products, isFetching: isFetchingProducts } = useGetProducts();
  const { data: categories, isFetching: isFetchingCategories } = useGetCategories();
  const { data: units, isFetching: isFetchingUnits } = useGetUnits();
  const { data: ivaConditions, isFetching: isFetchingIVAConditions } = useGetIvaConditions();

  useEffect(() => {
    if (!categories || !units || !ivaConditions) return;

    resetValues.categoryId = categories[0].id!;
    resetValues.unitId = units[0].id!;
    resetValues.ivaConditionId = ivaConditions[5].id!;
  }, [categories, ivaConditions, resetValues, units]);

  const isIndeterminate =
    isFetchingProducts || isFetchingCategories || isFetchingUnits || isFetchingIVAConditions;

  const { columns } = useColumns({ onOpen, onOpenModal, setinitialValues });

  useEffect(() => {
    const handleUserKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        return onOpen();
      }
    };

    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [onOpen]);

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Productos">
      <Button colorScheme="brand" leftIcon={<HiPlus />} mb={4} ml="auto" size="lg" onClick={onOpen}>
        CREAR PRODUCTO
      </Button>

      {!products || !categories || !units || !ivaConditions ? (
        <Loading />
      ) : (
        <>
          <Box w="full">
            <CustomTable
              showColumsSelector
              showGlobalFilter
              showNavigation
              showPrintOption
              amount={products.length}
              columns={columns}
              data={products}
            />
          </Box>
          <Drawer
            categories={categories}
            initialValues={initialValues}
            isOpen={isOpen}
            ivaConditions={ivaConditions}
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
          />
        </>
      )}
    </DashBoard>
  );
};
