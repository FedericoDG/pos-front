import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { HiPlus } from 'react-icons/Hi';
import { useMemo, useState } from 'react';

import { Client } from '../interfaces';
import { ConfirmationModal, Drawer } from '../componets/clients';
import { CustomTable } from '../componets/table';
import { DashBoard } from '../componets/common';
import { Loading } from '../componets/common';
import { useColumns } from '../componets/clients/hooks';
import { useGetClients } from '../hooks';

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
    }),
    []
  );

  const [initialValues, setinitialValues] = useState(resetValues);

  const { data: clients, isFetching: isFetchingClients } = useGetClients();

  const isIndeterminate = isFetchingClients;

  const { columns } = useColumns({ onOpen, onOpenModal, setinitialValues });

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Clientes">
      <Button colorScheme="brand" leftIcon={<HiPlus />} mb={4} ml="auto" size="lg" onClick={onOpen}>
        CREAR CLIENTE
      </Button>

      {!clients ? (
        <Loading />
      ) : (
        <>
          <Box w="full">
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
