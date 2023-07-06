import { Box, Menu, MenuButton, IconButton, MenuList, MenuItem, Badge } from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { useMemo } from 'react';
import { TbListDetails } from 'react-icons/Tb';
import { useNavigate } from 'react-router-dom';

import { CashRegister } from '../../../interfaces';
import { formatCurrency, formatDateAndHour } from '../../../utils';

export const useColumns = () => {
  const navigate = useNavigate();

  const columns = useMemo<ColumnDef<CashRegister>[]>(
    () => [
      {
        id: 'estado',
        header: 'Estado',
        cell: ({ row }: CellContext<CashRegister, unknown>) =>
          row.original.closingDate !== null ? (
            <Badge colorScheme="red" px="2" py="1" rounded="md" variant="subtle">
              CERRADA
            </Badge>
          ) : (
            <Badge colorScheme="green" variant="subtle">
              ABIERTA
            </Badge>
          ),
        accessorFn: (x) => x.isOpen,
      },
      {
        id: 'apertura',
        header: 'Apertura',
        cell: ({ row }: CellContext<CashRegister, unknown>) => (
          <p>{formatDateAndHour(row.original.openingDate)}</p>
        ),
        accessorFn: (x) => x.openingDate,
      },
      {
        id: 'monto_inicial',
        header: 'Monto inicial',
        cell: ({ row }: CellContext<CashRegister, unknown>) => (
          <p>{formatCurrency(row.original.initialBalance)}</p>
        ),
        accessorFn: (x) => x.initialBalance,
      },
      {
        id: 'ventas',
        header: 'Ventas',
        cell: ({ row }: CellContext<CashRegister, unknown>) => (
          <p>{formatCurrency(row.original.finalBalance!)}</p>
        ),
        accessorFn: (x) => x.finalBalance,
      },
      {
        id: 'total_rendir',
        header: 'Total a Rendir',
        cell: ({ row }: CellContext<CashRegister, unknown>) => (
          <p>{formatCurrency(row.original.finalBalance! + row.original.initialBalance)}</p>
        ),
        accessorFn: (x) => x.finalBalance,
      },
      {
        id: 'usuario',
        header: 'Usuario',
        cell: ({ row }: CellContext<CashRegister, unknown>) => (
          <p>
            {row.original.user?.lastname}, {row.original.user?.name}
          </p>
        ),
        accessorFn: (x) => x.user?.lastname,
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }: CellContext<CashRegister, unknown>) => (
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
                  onClick={() => navigate(`/panel/CashRegisteros/${row.original.id}`)}
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
