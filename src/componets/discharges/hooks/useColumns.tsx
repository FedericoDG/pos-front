import { Box, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { TbListDetails } from 'react-icons/Tb';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Discharge } from '../../../interfaces';
import { formatCurrency } from '../../../utils';
import { formatDate } from '../../../utils/formatDate';

export const useColumns = () => {
  const navigate = useNavigate();

  const columns = useMemo<ColumnDef<Discharge>[]>(
    () => [
      {
        id: 'fecha',
        header: 'Fecha',
        cell: ({ row }: CellContext<Discharge, unknown>) => (
          <p>{formatDate(row.original.createdAt)}</p>
        ),
        accessorFn: (x) => x.createdAt,
      },
      {
        id: 'perdida',
        header: 'Pérdida',
        cell: ({ row }: CellContext<Discharge, unknown>) => (
          <p>{formatCurrency(Number(row.original.cost))}</p>
        ),
        accessorFn: (x) => x.cost,
      },
      {
        id: 'deposito',
        header: 'Depósito',
        cell: (row: CellContext<Discharge, unknown>) => row.renderValue(),
        accessorFn: (x) => x.warehouses?.code,
      },
      {
        id: 'usuario',
        header: 'Usuario',
        cell: ({ row }: CellContext<Discharge, unknown>) => (
          <p>
            {row.original.user?.lastname} {row.original.user?.name}
          </p>
        ),
        accessorFn: (x) => x.user?.lastname,
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }: CellContext<Discharge, unknown>) => (
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
                  onClick={() => navigate(`/panel/stock/bajas/detalles/${row.original.id}`)}
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
