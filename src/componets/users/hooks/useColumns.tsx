import { Box, Menu, MenuButton, IconButton, MenuList, MenuItem } from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';

import { User } from '../../../interfaces';
import { getRole } from '../../../utils';

interface Props {
  onOpen: () => void;
  onOpenModal: () => void;
  setinitialValues: Dispatch<SetStateAction<User>>;
}

export const useColumns = ({ onOpen, onOpenModal, setinitialValues }: Props) => {
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: 'nombre',
        header: 'Nombre',
        cell: (row: CellContext<User, unknown>) => row.renderValue(),
        accessorKey: 'name',
      },
      {
        id: 'apellido',
        header: 'Apellido',
        cell: (row: CellContext<User, unknown>) => row.renderValue(),
        accessorKey: 'lastname',
      },
      {
        id: 'email',
        header: 'Email',
        cell: (row: CellContext<User, unknown>) => row.renderValue(),
        accessorKey: 'email',
      },
      {
        id: 'rol',
        header: 'Rol',
        cell: ({ row }: CellContext<User, unknown>) => getRole(row.original.role?.name!),
        accessorFn: (x) => x.role?.name,
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }: CellContext<User, unknown>) => (
          <Box fontFamily="IBM Plex Sans">
            <Menu placement="left-start">
              <MenuButton
                aria-label="Options"
                as={IconButton}
                fontSize={24}
                icon={<BsThreeDots />}
                variant="link"
              />
              <MenuList>
                <MenuItem
                  icon={<FaRegEdit />}
                  onClick={() => {
                    onOpen();
                    setinitialValues(row.original);
                  }}
                >
                  Editar
                </MenuItem>
                <MenuItem
                  icon={<FaRegTrashAlt />}
                  onClick={() => {
                    onOpenModal();
                    setinitialValues(row.original);
                  }}
                >
                  Eliminar
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        ),
        meta: {
          align: 'center',
        },
        size: 80,
      },
    ],
    [onOpen, onOpenModal, setinitialValues]
  );

  return { columns };
};
