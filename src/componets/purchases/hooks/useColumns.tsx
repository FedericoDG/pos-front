import { Box, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { DragHandleIcon } from '@chakra-ui/icons';
import { TbListDetails } from 'react-icons/Tb';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Purchase } from '../../../interfaces';
import { formatCurrency } from '../../../utils';
import { formatDate } from '../../../utils/formatDate';

export const useColumns = () => {
  const navigate = useNavigate();

  const columns = useMemo<ColumnDef<Purchase>[]>(
    () => [
      {
        id: 'fecha_compra',
        header: 'Fecha',
        cell: ({ row }: CellContext<Purchase, unknown>) => <p>{formatDate(row.original.date)}</p>,
        accessorFn: (x) => x.date,
      },
      {
        id: 'proveedor',
        header: 'Proveedor',
        cell: (row: CellContext<Purchase, unknown>) => row.renderValue(),
        accessorFn: (x) => x.supplier?.name,
      },
      {
        id: 'transporte',
        header: 'Transporte',
        cell: (row: CellContext<Purchase, unknown>) => row.renderValue(),
        accessorFn: (x) => x.transport,
      },
      {
        id: 'chofer',
        header: 'Chofer',
        cell: (row: CellContext<Purchase, unknown>) => row.renderValue(),
        accessorFn: (x) => x.driver,
      },
      {
        id: 'deposito',
        header: 'Depósito',
        cell: (row: CellContext<Purchase, unknown>) => row.renderValue(),
        accessorFn: (x) => x.warehouse?.code,
      },
      {
        id: 'usuario',
        header: 'Usuario',
        cell: ({ row }: CellContext<Purchase, unknown>) => (
          <p>
            {row.original.user?.lastname} {row.original.user?.lastname}
          </p>
        ),
        accessorFn: (x) => x.user?.lastname,
      },
      {
        id: 'total',
        header: 'Total',
        cell: ({ row }: CellContext<Purchase, unknown>) => (
          <p>{formatCurrency(row.original.total)}</p>
        ),
        accessorFn: (x) => x.total,
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }: CellContext<Purchase, unknown>) => (
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
                  onClick={() => navigate(`/panel/stock/compras/detalles/${row.original.id}`)}
                >
                  Ver Detalles
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
    [navigate]
  );

  return { columns };
};
