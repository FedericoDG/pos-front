import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { HiPlus } from 'react-icons/Hi';
import { useMemo, useState, useEffect } from 'react';

import { Client } from '../interfaces';
import { ConfirmationModal, Drawer } from '../componets/clients';
import { CustomTable } from '../componets/table';
import { DashBoard } from '../componets/common';
import { Loading } from '../componets/common';
import { useColumns } from '../componets/clients/hooks';
import { useGetClients } from '../hooks';
import { useGetIdentifications } from '../hooks/useIdentifications';

export const Clients = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure();

  const resetValues: Client = useMemo(
    () => ({
      name: '',
      lastname: '',
      document: '',
      email: '',
      password: '',
      password2: '',
      phone: '',
      mobile: '',
      address: '',
      info: '',
      roleId: 5,
      identificationId: 35,
    }),
    []
  );

  const [initialValues, setinitialValues] = useState(resetValues);

  const { data: clients, isFetching: isFetchingClients } = useGetClients();
  const { data: identifications, isFetching: isFetchingIdentifications } = useGetIdentifications();

  const isIndeterminate = isFetchingClients || isFetchingIdentifications;

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

      {!clients || !identifications ? (
        <Loading />
      ) : (
        <>
          <Box bg="white" p="4" rounded="md" shadow="md" w="full">
            <CustomTable
              showColumsSelector
              showGlobalFilter
              showNavigation
              showPrintOption
              amount={clients.length}
              columns={columns}
              data={clients}
            />
          </Box>
          <Drawer
            identifications={identifications}
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
