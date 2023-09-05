import { Box, Button } from '@chakra-ui/react';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { useMemo, useCallback } from 'react';

import { ProductWithPrice } from '../../../interfaces';
import { formatCurrency } from '../../../utils';
import { useUpdatePricePercentageContext } from '..';

export const useProductColumns = () => {
  const { addItem, percentage, cart } = useUpdatePricePercentageContext();

  const isDisabled = useCallback(
    (product: ProductWithPrice) => {
      const productExist = cart.find((el: ProductWithPrice) => el.id === product.id);

      if (productExist) return true;

      return false;
    },
    [cart]
  );

  const columns = useMemo<ColumnDef<ProductWithPrice>[]>(
    () => [
      {
        id: 'nombre',
        header: 'Nombre',
        cell: (row: CellContext<ProductWithPrice, unknown>) => row.renderValue(),
        accessorKey: 'name',
      },
      {
        id: 'cod',
        header: 'Código',
        cell: (row: CellContext<ProductWithPrice, unknown>) => row.renderValue(),
        accessorKey: 'code',
      },
      {
        id: 'precio',
        header: 'Precio',
        cell: ({ row }: CellContext<ProductWithPrice, unknown>) => (
          <p>{formatCurrency(row.original.price!)}</p>
        ),
        accessorKey: 'price',
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }: CellContext<ProductWithPrice, unknown>) => (
          <Box fontFamily="IBM Plex Sans">
            <Button
              colorScheme="brand"
              isDisabled={row.original.price! <= 0 || percentage <= 0 || isDisabled(row.original!)}
              size="sm"
              type="submit"
              variant="ghost"
              onClick={() => {
                addItem({
                  ...row.original,
                  newPrice: row.original.price! * (1 + percentage / 100),
                });
              }}
            >
              AGREGAR
            </Button>
          </Box>
        ),
        meta: {
          align: 'center',
        },
      },
    ],
    [addItem, isDisabled, percentage]
  );

  return { columns };
};
