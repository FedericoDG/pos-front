/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button } from '@chakra-ui/react';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';

import { CartItem } from '..';
import { formatCurrency } from '../../../utils';
import { Stock2 } from '../../../interfaces/interfaces';

interface Props {
  onOpen: () => void;
  setActiveProduct: Dispatch<SetStateAction<CartItem>>;
}

export const useColumns = ({ onOpen, setActiveProduct }: Props) => {
  const originalCols: ColumnDef<Stock2>[] = [
    {
      id: 'nombre',
      header: 'Nombre',
      cell: (row: CellContext<Stock2, unknown>) => row.renderValue(),
      accessorFn: (x) => x.products.name,
    },
    {
      id: 'cod',
      header: 'Código',
      cell: (row: CellContext<Stock2, unknown>) => row.renderValue(),
      accessorFn: (x) => x.products.code,
    },
  ];

  const lastCols: ColumnDef<Stock2>[] = [
    {
      id: 'costo',
      header: 'Costo',
      cell: ({ row }: CellContext<Stock2, unknown>) => {
        if (row.original.products.costs) {
          return (
            <p>
              {formatCurrency(row.original.products.costs[0].price)}/
              {row.original.products.unit?.code}
            </p>
          );
        }
      },
      accessorFn: (x) => {
        if (x.products.costs) {
          return x.products?.costs[0].price;
        }
      },
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }: CellContext<Stock2, unknown>) => (
        <Box fontFamily="IBM Plex Sans">
          <Button
            colorScheme="brand"
            size="sm"
            type="submit"
            variant="outline"
            onClick={() => {
              if (row.original.products.costs) {
                setActiveProduct({
                  ...row.original,
                  productId: row.original.products.id!,
                  cost: row.original.products.costs[0].price,
                });
                onOpen();
              }
            }}
          >
            AGREGAR
          </Button>
        </Box>
      ),
      meta: {
        align: 'center',
      },
      size: 80,
    },
  ];

  const columns = useMemo(() => [...originalCols, ...lastCols], [originalCols]);

  return { columns };
};
