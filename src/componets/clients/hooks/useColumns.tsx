import { Box, Menu, MenuButton, IconButton, MenuList, MenuItem } from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { TbListDetails } from 'react-icons/Tb';
import { useNavigate } from 'react-router-dom';

import { Client } from '../../../interfaces';

interface Props {
  onOpen: () => void;
  onOpenModal: () => void;
  setinitialValues: Dispatch<SetStateAction<Client>>;
}

export const useColumns = ({ onOpen, onOpenModal, setinitialValues }: Props) => {
  const navigate = useNavigate();

  const columns = useMemo<ColumnDef<Client>[]>(
    () => [
      {
        id: 'nombre',
        header: 'Nombre',
        cell: (row: CellContext<Client, unknown>) => row.renderValue(),
        accessorKey: 'name',
      },
      {
        id: 'identificacion',
        header: 'Identificación',
        cell: (row: CellContext<Client, unknown>) => row.renderValue(),
        accessorFn: (x) => x.identification?.description,
      },
      {
        id: 'id_numero',
        header: 'Número',
        cell: (row: CellContext<Client, unknown>) => row.renderValue(),
        accessorKey: 'document',
      },
      {
        id: 'email',
        header: 'Email',
        cell: (row: CellContext<Client, unknown>) => row.renderValue(),
        accessorKey: 'email',
      },
      {
        id: 'tel',
        header: 'Teléfono',
        cell: (row: CellContext<Client, unknown>) => row.renderValue(),
        accessorKey: 'phone',
      },
      {
        id: 'cel',
        header: 'Celular',
        cell: (row: CellContext<Client, unknown>) => row.renderValue(),
        accessorKey: 'mobile',
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }: CellContext<Client, unknown>) => (
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
                  icon={<TbListDetails />}
                  onClick={() => navigate(`/panel/Clientos/${row.original.id}`)}
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
