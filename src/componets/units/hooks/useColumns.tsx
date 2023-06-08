import { DragHandleIcon } from '@chakra-ui/icons';
import { Box, Menu, MenuButton, IconButton, MenuList, MenuItem } from '@chakra-ui/react';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { Unit } from '../../../interfaces';

interface Props {
  onOpen: () => void;
  onOpenModal: () => void;
  setinitialValues: Dispatch<SetStateAction<Unit>>;
}

export const useColumns = ({ onOpen, onOpenModal, setinitialValues }: Props) => {
  const navigate = useNavigate();

  const columns = useMemo<ColumnDef<Unit>[]>(
    () => [
      {
        id: 'id',
        header: 'Id',
        cell: (row: CellContext<Unit, unknown>) => row.renderValue(),
        accessorKey: 'id',
        size: 50,
      },
      {
        id: 'codigo',
        header: 'Código',
        cell: (row: CellContext<Unit, unknown>) => row.renderValue(),
        accessorKey: 'code',
      },
      {
        id: 'nombre',
        header: 'Nombre',
        cell: (row: CellContext<Unit, unknown>) => row.renderValue(),
        accessorKey: 'name',
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }: CellContext<Unit, unknown>) => (
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
