import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { HiPlus } from 'react-icons/Hi';
import { useMemo, useState, useEffect } from 'react';

import { ConfirmationModal, Drawer, exportToexcel } from '../componets/suppliers';
import { CustomTable } from '../componets/table';
import { DashBoard } from '../componets/common';
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
    <DashBoard isIndeterminate={isIndeterminate} title="Proveedores">
      <Button
        colorScheme="brand"
        leftIcon={<HiPlus />}
        mb={4}
        ml="auto"
        shadow="lg"
        size="lg"
        onClick={onOpen}
      >
        CREAR PROVEEDOR
      </Button>

      {!suppliers ? (
        <Loading />
      ) : (
        <>
          <Box bg="white" p="4" rounded="md" shadow="md" w="full">
            <CustomTable
              showColumsSelector
              showExportToExcelButton
              showGlobalFilter
              showNavigation
              showPrintOption
              amount={suppliers.length}
              columns={columns}
              data={suppliers}
              exportToExcel={() => exportToexcel(suppliers)}
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
