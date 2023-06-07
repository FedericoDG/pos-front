import { DragHandleIcon } from '@chakra-ui/icons';
import { Badge, Box, Menu, MenuButton, IconButton, MenuList, MenuItem } from '@chakra-ui/react';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { TbListDetails } from 'react-icons/Tb';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { Product } from '../../../interfaces';

interface Props {
  onOpen: () => void;
  onOpenModal: () => void;
  setinitialValues: Dispatch<SetStateAction<Product>>;
}

export const useColumns = ({ onOpen, onOpenModal, setinitialValues }: Props) => {
  const navigate = useNavigate();

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: 'id',
        header: 'Id',
        cell: (row: CellContext<Product, unknown>) => row.renderValue(),
        accessorKey: 'id',
        size: 50,
      },
      {
        id: 'nombre',
        header: 'Nombre',
        cell: (row: CellContext<Product, unknown>) => row.renderValue(),
        accessorKey: 'name',
      },
      {
        id: 'cod',
        header: 'Código',
        cell: (row: CellContext<Product, unknown>) => row.renderValue(),
        accessorKey: 'code',
      },
      {
        id: 'cod_barra',
        header: 'Cód. de Barra',
        cell: (row: CellContext<Product, unknown>) => row.renderValue(),
        accessorKey: 'barcode',
      },
      {
        id: 'habilitado',
        header: 'Estado',
        cell: (row: CellContext<Product, unknown>) =>
          row.renderValue() === 'ENABLED' ? (
            <Badge colorScheme="teal" variant="subtle">
              {' '}
              Habilitado
            </Badge>
          ) : (
            <Badge colorScheme="red" variant="subtle">
              Deshabilitado
            </Badge>
          ),
        accessorKey: 'status',
      },
      {
        id: 'stock(-)',
        header: 'Permitir stock neg.',
        cell: (row: CellContext<Product, unknown>) =>
          row.renderValue() === 'ENABLED' ? (
            <Badge colorScheme="red" variant="subtle">
              Permitir
            </Badge>
          ) : (
            <Badge colorScheme="teal" variant="subtle">
              No Permitir
            </Badge>
          ),
        accessorFn: (x) => x.allownegativestock,
      },
      {
        id: 'stock',
        header: 'Stock',
        cell: ({ row }: CellContext<Product, unknown>) => (
          <p>
            {row.original.totalStock} {row.original.unit?.code}
          </p>
        ),
        accessorFn: (x) => x.totalStock,
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }: CellContext<Product, unknown>) => (
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
                  onClick={() => navigate(`/panel/productos/${row.original.id}`)}
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
    [onOpen, onOpenModal]
  );

  return { columns };
};
