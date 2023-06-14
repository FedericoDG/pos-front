import { DragHandleIcon } from '@chakra-ui/icons';
import { Box, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { TbListDetails } from 'react-icons/Tb';
import { useNavigate } from 'react-router-dom';

import { Supplier } from '../../../interfaces';

interface Props {
  onOpen: () => void;
  onOpenModal: () => void;
  setinitialValues: Dispatch<SetStateAction<Supplier>>;
}

export const useColumns = ({ onOpen, onOpenModal, setinitialValues }: Props) => {
  const navigate = useNavigate();

  const columns = useMemo<ColumnDef<Supplier>[]>(
    () => [
      {
        id: 'cuit',
        header: 'CUIT',
        cell: (row: CellContext<Supplier, unknown>) => row.renderValue(),
        accessorKey: 'cuit',
      },
      {
        id: 'nombre',
        header: 'name',
        cell: (row: CellContext<Supplier, unknown>) => row.renderValue(),
        accessorKey: 'name',
      },
      {
        id: 'email',
        header: 'Email',
        cell: (row: CellContext<Supplier, unknown>) => row.renderValue(),
        accessorKey: 'email',
      },
      {
        id: 'tel',
        header: 'Tel.',
        cell: (row: CellContext<Supplier, unknown>) => row.renderValue(),
        accessorKey: 'phone',
      },
      {
        id: 'cel',
        header: 'Cel.',
        cell: (row: CellContext<Supplier, unknown>) => row.renderValue(),
        accessorKey: 'mobile',
      },
      {
        id: 'direccion',
        header: 'Dirección.',
        cell: (row: CellContext<Supplier, unknown>) => row.renderValue(),
        accessorKey: 'address',
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }: CellContext<Supplier, unknown>) => (
          <Box fontFamily="IBM Plex Sans">
            <Menu placement="left-start">
              <MenuButton
                aria-label="Options"
                as={IconButton}
                icon={<DragHandleIcon />}
                variant="outline"
              />
              <MenuList>
                <MenuItem
                  icon={<TbListDetails />}
                //onClick={() => navigate(`/panel/Supplieros/${row.original.id}`)}
                >
                  Ver Detalles
                </MenuItem>
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
    [navigate, onOpen, onOpenModal, setinitialValues]
  );

  return { columns };
};
