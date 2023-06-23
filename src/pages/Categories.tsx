import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { HiPlus } from 'react-icons/Hi';
import { useMemo, useState } from 'react';

import { Category } from '../interfaces';
import { ConfirmationModal, Drawer } from '../componets/categories';
import { CustomTable } from '../componets/table';
import { DashBoard } from '../componets/common';
import { Loading } from '../componets/common';
import { useColumns } from '../componets/categories/hooks';
import { useGetCategories } from '../hooks';

export const Categories = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure();

  const resetValues: Category = useMemo(
    () => ({
      name: '',
      description: '',
    }),
    []
  );

  const [initialValues, setinitialValues] = useState(resetValues);

  const { data: categories, isFetching: isFetchingCategories } = useGetCategories();

  const isIndeterminate = isFetchingCategories;

  const { columns } = useColumns({ onOpen, onOpenModal, setinitialValues });

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Categorías">
      <Button colorScheme="brand" leftIcon={<HiPlus />} mb={4} ml="auto" size="lg" onClick={onOpen}>
        CREAR CATEGORÍA
      </Button>

      {!categories ? (
        <Loading />
      ) : (
        <>
          <Box maxW="800px" w="full">
            <CustomTable
              showColumsSelector
              showGlobalFilter
              showNavigation
              showPrintOption
              amount={categories.length}
              columns={columns}
              data={categories}
            />
          </Box>
          <Drawer
            initialValues={initialValues}
            isOpen={isOpen}
            resetValues={resetValues}
            setinitialValues={setinitialValues}
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
