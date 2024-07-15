import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { HiPlus } from 'react-icons/Hi';
import { useMemo, useState, useEffect } from 'react';

import { Client } from '../interfaces';
import { ConfirmationModal, Drawer, exportToexcel } from '../componets/clients';
import { CustomTable } from '../componets/table';
import { DashBoard } from '../componets/common';
import { Loading } from '../componets/common';
import { useColumns } from '../componets/clients/hooks';
import { useGetClients, useGetIvaTypes, useGetStates } from '../hooks';
import { useGetIdentifications } from '../hooks/useIdentifications';

export const Clients = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure();

  const resetValues: Client = useMemo(
    () => ({
      name: '',
      document: '',
      email: '',
      stateId: 14,
      city: '',
      password: 'hola123',
      password2: 'hola123',
      phone: '',
      mobile: '',
      address: '',
      info: '',
      roleId: 5,
      identificationId: 35,
      ivaTypeId: 5,
      currentAccountActive: 0,
    }),
    []
  );

  const [initialValues, setinitialValues] = useState(resetValues);

  const { data: clients, isFetching: isFetchingClients } = useGetClients();
  const { data: identifications, isFetching: isFetchingIdentifications } = useGetIdentifications();
  const { data: ivaTypes, isFetching: isFetchingIvaTypes } = useGetIvaTypes();
  const { data: states, isFetching: isFetchingStates } = useGetStates();

  const isIndeterminate =
    isFetchingClients || isFetchingIdentifications || isFetchingIvaTypes || isFetchingStates;

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
    <DashBoard isIndeterminate={isIndeterminate} title="Clientes">
      <Button
        colorScheme="brand"
        leftIcon={<HiPlus />}
        mb={4}
        ml="auto"
        shadow="lg"
        size="lg"
        onClick={onOpen}
      >
        CREAR CLIENTE
      </Button>

      {!clients || !identifications || !ivaTypes || !states ? (
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
              amount={clients.length}
              columns={columns}
              data={clients}
              exportToExcel={() => exportToexcel(clients)}
            />
          </Box>
          <Drawer
            identifications={identifications}
            initialValues={initialValues}
            isOpen={isOpen}
            ivaTypes={ivaTypes}
            resetValues={resetValues}
            setinitialValues={setinitialValues}
            states={states}
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
