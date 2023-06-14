import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { HiPlus } from 'react-icons/Hi';
import { useMemo, useState } from 'react';

import { ConfirmationModal, Drawer } from '../componets/warehouses';
import { CustomTable } from '../componets/table';
import { DashBoard } from '../componets/common';
import { Loading } from '../componets/common';
import { useColumns } from '../componets/warehouses/hooks';
import { useGetWarehouses } from '../hooks';
import { Warehouse } from '../interfaces';

export const Warehouses = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure();

  const resetValues: Warehouse = useMemo(
    () => ({
      code: '',
      address: '',
      description: '',
    }),
    []
  );

  const [initialValues, setinitialValues] = useState(resetValues);

  const { data: warehouses, isFetching: isFetchingWarehouses } = useGetWarehouses();

  const isIndeterminate = isFetchingWarehouses;

  const { columns } = useColumns({ onOpen, onOpenModal, setinitialValues });

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Depósitos">
      <Button colorScheme="brand" leftIcon={<HiPlus />} mb={4} ml="auto" size="lg" onClick={onOpen}>
        Crear Depósito
      </Button>

      {!warehouses ? (
        <Loading />
      ) : (
        <>
          <Box maxW="800px" w="full">
            <CustomTable
              showColumsSelector
              showGlobalFilter
              showNavigation
              showPrintOption
              amount={warehouses.length}
              columns={columns}
              data={warehouses}
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
