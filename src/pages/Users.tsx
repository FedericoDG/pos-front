import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { HiPlus } from 'react-icons/Hi';
import { useMemo, useState, useEffect } from 'react';

import { User } from '../interfaces';
import { ConfirmationModal, Drawer } from '../componets/users';
import { CustomTable } from '../componets/table';
import { DashBoard } from '../componets/common';
import { Loading } from '../componets/common';
import { useColumns } from '../componets/users/hooks';
import { useGetUsers, useGetRoles } from '../hooks';

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
    }),
    []
  );

  const [initialValues, setinitialValues] = useState(resetValues);

  const { data: users, isFetching: isFetchingUsers } = useGetUsers();
  const { data: roles, isFetching: isFetchingRoles } = useGetRoles();

  const isIndeterminate = isFetchingUsers || isFetchingRoles;

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

      {!users || !roles ? (
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
              data={users}
            />
          </Box>
          <Drawer
            initialValues={initialValues}
            isOpen={isOpen}
            resetValues={resetValues}
            roles={roles.filter((user) => user.name !== 'CLIENT')}
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
