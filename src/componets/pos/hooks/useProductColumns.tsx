import { Box, Button } from '@chakra-ui/react';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { Dispatch, useMemo, useCallback } from 'react';

import { Product } from '../../../interfaces';
import { CartItem, usePosContext } from '..';
import { formatCurrency } from '../../../utils';

interface Props {
  onOpen: () => void;
  setActiveProduct: Dispatch<React.SetStateAction<CartItem>>;
}

export const useProductColumns = ({ onOpen, setActiveProduct }: Props) => {
  const { cart } = usePosContext();

  const isDisabled = useCallback(
    (product: Product) => {
      if (product.allownegativestock === 'ENABLED') return false;

      const productExist = cart.find((el: Product) => el.id === product.id);

      if (productExist?.quantity! >= product.stock!) return true;

      return false;
    },
    [cart]
  );

  const stock = useCallback(
    (product: Product) => {
      const productExist = cart.find((el: Product) => el.id === product.id);

      if (productExist) {
        if (productExist.error) return product.stock;

        return product?.stock! - (productExist.quantity! || 0);
      }

      return product.stock;
    },
    [cart]
  );

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
        id: 'cod_barras',
        header: 'Código de Barras',
        cell: (row: CellContext<Product, unknown>) => row.renderValue(),
        accessorKey: 'barcode',
      },
      {
        id: 'stock',
        header: 'Stock',
        cell: ({ row }: CellContext<Product, unknown>) => (
          <p>
            {stock(row.original)} {row.original.unit?.code}
          </p>
        ),
        accessorFn: (stock) => stock,
      },
      /*   {
        id: 'permitir_stock_neg',
        header: 'Perm. Stock Neg.',
        cell: ({ row }: CellContext<Product, unknown>) => <p>{row.original.allownegativestock}</p>,
        accessorFn: (stock) => stock,
      }, */
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
              isDisabled={row.original.price! <= 0 || isDisabled(row.original!)}
              size="sm"
              type="submit"
              variant="ghost"
              onClick={() => {
                setActiveProduct({
                  ...row.original,
                  quantity: 0,
                  price: row.original.price!,
                  error: false,
                  tax: 0,
                  allow: row.original.allownegativestock === 'ENABLE' ? true : false,
                  discount: 0,
                  hasDiscount: false,
                  totalDiscount: 0,
                });
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
    [isDisabled, onOpen, setActiveProduct, stock]
  );

  return { columns };
};
