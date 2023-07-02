import { Box, Button } from '@chakra-ui/react';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { Dispatch, useMemo } from 'react';

import { Product } from '../../../interfaces';
import { CartItem } from '..';
import { formatCurrency } from '../../../utils';

interface Props {
  onOpen: () => void;
  setActiveProduct: Dispatch<React.SetStateAction<CartItem>>;
}

export const useProductColumns = ({ onOpen, setActiveProduct }: Props) => {
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
        id: 'stock',
        header: 'Stock',
        cell: ({ row }: CellContext<Product, unknown>) => (
          <p>
            {row.original.stock} {row.original.unit?.code}
          </p>
        ),
        accessorKey: 'stock',
      },
      {
        id: 'precio',
        header: 'Precio',
        cell: ({ row }: CellContext<Product, unknown>) => (
          <p>{formatCurrency(row.original.price!)}</p>
        ),
        accessorKey: 'price',
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }: CellContext<Product, unknown>) => (
          <Box fontFamily="IBM Plex Sans">
            <Button
              colorScheme="brand"
              size="sm"
              type="submit"
              variant="outline"
              onClick={() => {
                setActiveProduct({ ...row.original, quantity: 0, price: row.original.price! });
                onOpen();
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
    [onOpen, setActiveProduct]
  );

  return { columns };
};
