import { Box, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { TbListDetails } from 'react-icons/Tb';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { formatDate } from '../../../utils/formatDate';
import { Transfer } from '../../../interfaces';

export const useColumns = () => {
  const navigate = useNavigate();

  const columns = useMemo<ColumnDef<Transfer>[]>(
    () => [
      {
        id: 'fecha',
        header: 'Fecha',
        cell: ({ row }: CellContext<Transfer, unknown>) => (
          <p>{formatDate(row.original.createdAt)}</p>
        ),
        accessorFn: (x) => x.createdAt,
      },
      {
        id: 'deposito_origen',
        header: 'Depósito de Origen',
        cell: (row: CellContext<Transfer, unknown>) => row.renderValue(),
        accessorFn: (x) => x.warehouseOrigin.code,
      },
      {
        id: 'deposito_destino',
        header: 'Depósito de Destino',
        cell: (row: CellContext<Transfer, unknown>) => row.renderValue(),
        accessorFn: (x) => x.warehouseDestination.code,
      },
      {
        id: 'usuario',
        header: 'Usuario',
        cell: ({ row }: CellContext<Transfer, unknown>) => (
          <p>
            {row.original.user?.lastname} {row.original.user?.name}
          </p>
        ),
        accessorFn: (x) => x.user?.lastname,
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }: CellContext<Transfer, unknown>) => (
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
                  onClick={() =>
                    navigate(`/panel/stock/transferencias/detalles/${row.original.id}`)
                  }
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
