import { Box, Badge, Button, Icon } from '@chakra-ui/react';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { useMemo } from 'react';
import { TbListDetails } from 'react-icons/Tb';
import { useNavigate } from 'react-router-dom';

import { CashRegister } from '../../../interfaces';
import { formatCurrency, formatDateAndHour } from '../../../utils';

export const useColumns2 = () => {
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
            <Badge colorScheme="green" px="2" py="1" rounded="md" variant="subtle">
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
        id: 'cierre',
        header: 'Cierre',
        cell: ({ row }: CellContext<CashRegister, unknown>) =>
          row.original.isOpen ? <p> </p> : <p>{formatDateAndHour(row.original.closingDate)}</p>,
        accessorFn: (x) => x.closingDate,
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
            <Box fontFamily="IBM Plex Sans">
              <Button
                size="xs"
                onClick={() => navigate(`/panel/CashRegisteros/${row.original.id}`)}
              >
                <Icon as={TbListDetails} />
              </Button>
            </Box>
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
