import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { HiPlus } from 'react-icons/Hi';
import { useEffect, useMemo, useState } from 'react';

import { ConfirmationModal, Drawer } from '../componets/products';
import { CustomTable } from '../componets/table';
import { DashBoard } from '../componets/common';
import { Loading } from '../componets/common/';
import { Product } from '../interfaces';
import { useColumns } from '../componets/products/hooks';
import { useGetCategories, useGetUnits, useGetProducts } from '../hooks';

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

  useEffect(() => {
    if (!categories || !units) return;

    resetValues.categoryId = categories[0].id!;
    resetValues.unitId = units[0].id!;
  }, [categories, resetValues, units]);

  const isIndeterminate = isFetchingProducts || isFetchingCategories || isFetchingUnits;

  const { columns } = useColumns({ onOpen, onOpenModal, setinitialValues });

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Productos">
      <Button colorScheme="brand" leftIcon={<HiPlus />} mb={4} ml="auto" size="lg" onClick={onOpen}>
        CREAR PRODUCTO
      </Button>

      {!products || !categories || !units ? (
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
