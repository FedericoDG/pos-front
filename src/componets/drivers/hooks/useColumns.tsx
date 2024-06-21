import { Box, Menu, MenuButton, IconButton, MenuList, MenuItem, Badge } from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { TbListDetails } from 'react-icons/Tb';
import { useNavigate } from 'react-router-dom';

import { Warehouse } from '../../../interfaces';

interface Props {
  onOpen: () => void;
  onOpenModal: () => void;
  setinitialValues: Dispatch<SetStateAction<Warehouse>>;
}

export const useColumns = ({ onOpen, onOpenModal, setinitialValues }: Props) => {
  const navigate = useNavigate();

  const columns = useMemo<ColumnDef<Warehouse>[]>(
    () => [
      {
        id: 'codigo',
        header: 'Código',
        cell: (row: CellContext<Warehouse, unknown>) => row.renderValue(),
        accessorKey: 'code',
      },
      {
        id: 'apellido',
        header: 'Apellido',
        cell: (row: CellContext<Warehouse, unknown>) => row.renderValue(),
        accessorKey: 'user.lastname',
      },
      {
        id: 'nombre',
        header: 'Nombre',
        cell: (row: CellContext<Warehouse, unknown>) => row.renderValue(),
        accessorKey: 'user.name',
      },
      {
        id: 'email',
        header: 'Email',
        cell: (row: CellContext<Warehouse, unknown>) => row.renderValue(),
        accessorKey: 'user.email',
      },
      {
        id: 'stock',
        header: 'Stock',
        cell: ({ row }: CellContext<Warehouse, unknown>) =>
          row.original.stocks?.filter((el) => el.stock > 0).length! > 0 ? (
            <Badge colorScheme="green" variant="subtle">
              TIENE
            </Badge>
          ) : (
            <Badge colorScheme="red" variant="subtle">
              NO TIENE
            </Badge>
          ),
      },
      {
        id: 'descripcion',
        header: 'Descripción',
        cell: (row: CellContext<Warehouse, unknown>) => row.renderValue(),
        accessorKey: 'description',
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }: CellContext<Warehouse, unknown>) => (
          <Box fontFamily="Poppins">
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
                  onClick={() => navigate(`/panel/choferes/detalles/${row.original.id}`)}
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
