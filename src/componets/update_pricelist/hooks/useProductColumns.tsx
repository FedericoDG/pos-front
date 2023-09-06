import { Box, Button } from '@chakra-ui/react';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { useMemo, useCallback, Dispatch } from 'react';

import { ProductWithPrice } from '../../../interfaces';
import { formatCurrency } from '../../../utils';
import { CartItem, useUpdatePriceContext } from '..';

interface Props {
  onOpen: () => void;
  setActiveProduct: Dispatch<React.SetStateAction<CartItem>>;
}

export const useProductColumns = ({ onOpen, setActiveProduct }: Props) => {
  const { cart } = useUpdatePriceContext();

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
              isDisabled={isDisabled(row.original!)}
              size="sm"
              type="submit"
              variant="ghost"
              onClick={() => {
                setActiveProduct({
                  ...row.original,
                  price: row.original.price!,
                  newPrice: row.original.price!,
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
    [isDisabled, onOpen, setActiveProduct]
  );

  return { columns };
};
