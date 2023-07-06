import { Box, Menu, MenuButton, IconButton, MenuList, MenuItem } from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';

import { Warehouse } from '../../../interfaces';

interface Props {
  onOpen: () => void;
  onOpenModal: () => void;
  setinitialValues: Dispatch<SetStateAction<Warehouse>>;
}

export const useColumns = ({ onOpen, onOpenModal, setinitialValues }: Props) => {
  const columns = useMemo<ColumnDef<Warehouse>[]>(
    () => [
      {
        id: 'codigo',
        header: 'Código',
        cell: (row: CellContext<Warehouse, unknown>) => row.renderValue(),
        accessorKey: 'code',
      },
      {
        id: 'descripcion',
        header: 'Descripción',
        cell: (row: CellContext<Warehouse, unknown>) => row.renderValue(),
        accessorKey: 'description',
      },
      {
        id: 'direccion',
        header: 'Dirección',
        cell: (row: CellContext<Warehouse, unknown>) => row.renderValue(),
        accessorKey: 'address',
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }: CellContext<Warehouse, unknown>) => (
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
