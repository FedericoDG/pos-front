import { DragHandleIcon } from '@chakra-ui/icons';
import { Box, Menu, MenuButton, IconButton, MenuList, MenuItem } from '@chakra-ui/react';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { TbListDetails } from 'react-icons/Tb';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { Category } from '../../../interfaces';

interface Props {
  onOpen: () => void;
  onOpenModal: () => void;
  setinitialValues: Dispatch<SetStateAction<Category>>;
}

export const useColumns = ({ onOpen, onOpenModal, setinitialValues }: Props) => {
  const navigate = useNavigate();

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        id: 'id',
        header: 'Id',
        cell: (row: CellContext<Category, unknown>) => row.renderValue(),
        accessorKey: 'id',
        size: 50,
      },
      {
        id: 'nombre',
        header: 'Nombre',
        cell: (row: CellContext<Category, unknown>) => row.renderValue(),
        accessorKey: 'name',
      },
      {
        id: 'descripcion',
        header: 'Descripción',
        cell: (row: CellContext<Category, unknown>) => row.renderValue(),
        accessorKey: 'description',
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }: CellContext<Category, unknown>) => (
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
