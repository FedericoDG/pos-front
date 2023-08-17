import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { HiPlus } from 'react-icons/Hi';
import { useMemo, useState, useEffect } from 'react';

import { User } from '../interfaces';
import { ConfirmationModal, Drawer } from '../componets/users';
import { CustomTable } from '../componets/table';
import { DashBoard } from '../componets/common';
import { Loading } from '../componets/common';
import { useColumns } from '../componets/users/hooks';
import {
  useGetUsers,
  useGetRoles,
  useGetWarehousesWOStock,
  useGetPriceLists,
  useGetClients,
} from '../hooks';

export const Users = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure();

  const resetValues: User = useMemo(
    () => ({
      name: '',
      lastname: '',
      email: '',
      password: '',
      password2: '',
      roleId: 3,
      userPreferences: {
        clientId: 1,
        priceListId: 1,
        warehouseId: 1,
      },
    }),
    []
  );

  const [initialValues, setinitialValues] = useState(resetValues);

  const { data: users, isFetching: isFetchingUsers } = useGetUsers();
  const { data: roles, isFetching: isFetchingRoles } = useGetRoles();
  const { data: warehouses, isFetching: isFetchingWarehouses } = useGetWarehousesWOStock();
  const { data: priceLists, isFetching: isFetchingPriceLists } = useGetPriceLists();
  const { data: clients, isFetching: isFetchingClients } = useGetClients();

  const isIndeterminate =
    isFetchingUsers ||
    isFetchingRoles ||
    isFetchingWarehouses ||
    isFetchingPriceLists ||
    isFetchingClients;

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
    <DashBoard isIndeterminate={isIndeterminate} title="Usuarios">
      <Button colorScheme="brand" leftIcon={<HiPlus />} mb={4} ml="auto" size="lg" onClick={onOpen}>
        CREAR USUARIO
      </Button>

      {!users || !roles || !priceLists || !warehouses || !clients ? (
        <Loading />
      ) : (
        <>
          <Box w="full">
            <CustomTable
              showColumsSelector
              showGlobalFilter
              showNavigation
              showPrintOption
              amount={users.length}
              columns={columns}
              data={users.filter((el) => el.role?.id !== 4)}
            />
          </Box>
          <Drawer
            clients={clients}
            initialValues={initialValues}
            isOpen={isOpen}
            priceLists={priceLists}
            resetValues={resetValues}
            roles={roles.filter((user) => user.name !== 'CLIENT' && user.name !== 'DRIVER')}
            setinitialValues={setinitialValues}
            warehouses={warehouses.filter((el) => el.driver === 0)}
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
