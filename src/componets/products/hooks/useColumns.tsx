import { Badge, Box, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { TbListDetails } from 'react-icons/Tb';
import { useNavigate } from 'react-router-dom';

import { Product } from '../../../interfaces';
import { formatCurrency } from '../../../utils';

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
        id: 'costo',
        header: 'Costo',
        cell: ({ row }: CellContext<Product, unknown>) => (
          <p>
            {formatCurrency(row.original.costs![0].price)}/{row.original.unit?.code}
          </p>
        ),
        accessorFn: (x) => x.costs![0].price,
      },
      {
        id: 'habilitado',
        header: 'Estado',
        cell: ({ row }: CellContext<Product, unknown>) =>
          row.original.status === 'ENABLED' ? (
            <Badge colorScheme="green" variant="subtle">
              {' '}
              Habilitado
            </Badge>
          ) : (
            <Badge colorScheme="red" variant="subtle">
              Deshabilitado
            </Badge>
          ),
      },
      {
        id: 'stock(-)',
        header: 'Stock neg.',
        cell: ({ row }: CellContext<Product, unknown>) =>
          row.original.allownegativestock === 'ENABLED' ? (
            <Badge colorScheme="red" variant="subtle">
              Permitir
            </Badge>
          ) : (
            <Badge colorScheme="green" variant="subtle">
              No Permitir
            </Badge>
          ),
      },
      {
        id: 'alertar',
        header: 'Stock bajo',
        cell: ({ row }: CellContext<Product, unknown>) =>
          row.original.alertlowstock === 'ENABLED' ? (
            <Badge colorScheme="green" variant="subtle">
              {row.original.lowstock} {row.original.unit?.code}
            </Badge>
          ) : (
            <Badge colorScheme="red" variant="subtle">
              No Alertar
            </Badge>
          ),
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
                fontSize={24}
                icon={<BsThreeDots />}
                variant="link"
              />
              <MenuList>
                <MenuItem
                  icon={<TbListDetails />}
                  onClick={() => navigate(`/panel/productos/detalles/${row.original.id}`)}
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
