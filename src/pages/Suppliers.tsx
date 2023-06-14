import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { HiPlus } from 'react-icons/Hi';
import { useMemo, useState } from 'react';

import { CustomTable } from '../componets/table';
import { DashBoard } from '../componets/common';
import { ConfirmationModal, Drawer } from '../componets/suppliers';
import { Loading } from '../componets/common';
import { Supplier } from '../interfaces';
import { useColumns } from '../componets/suppliers/hooks';
import { useGetSuppliers } from '../hooks';

export const Suppliers = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure();

  const resetValues: Supplier = useMemo(
    () => ({
      cuit: '',
      name: '',
      email: '',
      phone: '',
      mobile: '',
      address: '',
      info: '',
    }),
    []
  );

  const [initialValues, setinitialValues] = useState(resetValues);

  const { data: suppliers, isFetching: isFetchingSuppliers } = useGetSuppliers();

  const isIndeterminate = isFetchingSuppliers;

  const { columns } = useColumns({ onOpen, onOpenModal, setinitialValues });

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Proveedores">
      <Button colorScheme="brand" leftIcon={<HiPlus />} mb={4} ml="auto" size="lg" onClick={onOpen}>
        Crear Producto
      </Button>

      {!suppliers ? (
        <Loading />
      ) : (
        <>
          <Box w="full">
            <CustomTable
              showColumsSelector
              showGlobalFilter
              showNavigation
              showPrintOption
              amount={suppliers.length}
              columns={columns}
              data={suppliers}
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
