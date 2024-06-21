/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button } from '@chakra-ui/react';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo, useCallback } from 'react';

import { CartItem, useProductTransContext } from '..';
import { formatCurrency } from '../../../utils';
import { Product, Stock2, Warehouse } from '../../../interfaces/interfaces';

interface Props {
  onOpen: () => void;
  warehouses: Warehouse[];
  setActiveProduct: Dispatch<SetStateAction<CartItem>>;
}

export const useColumns = ({ onOpen, warehouses, setActiveProduct }: Props) => {
  const { cart } = useProductTransContext();

  const isDisabled = useCallback(
    (product: Stock2) => {
      const productExist = cart.find((el: CartItem) => el.id === product.id);

      if (productExist?.quantity === product.stock) return true;

      return false;
    },
    [cart]
  );

  const stock = useCallback(
    (product: Product, num: number) => {
      const productExist = cart.find((el: CartItem) => el.productId === product.id);

      if (productExist) {
        return num - (productExist.quantity! || 0);
      }

      return product.stocks![0].stock;
    },
    [cart]
  );

  const warehousesColumns: ColumnDef<Stock2>[] = warehouses.map((el, idx) => ({
    id: el.code,
    header: el.code,
    cell: ({ row }: CellContext<Stock2, unknown>) => {
      if (row.original.products.stocks) {
        if (row.original.products.stocks[idx]) {
          return (
            <p>
              {stock(row.original.products, row.original.products.stocks[idx].stock)}{' '}
              {row.original.products.unit?.code}
            </p>
          );
        } else {
          return <p>0 {row.original.products.unit?.code}</p>;
        }
      }
    },
    accessorFn: (x) => {
      if (x.products.stocks) {
        return x.products.stocks[idx].stock;
      }
    },
  }));

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
        <Box fontFamily="Poppins">
          <Button
            colorScheme="brand"
            isDisabled={row.original.stock <= 0 || isDisabled(row.original!)}
            size="sm"
            type="submit"
            variant="ghost"
            onClick={() => {
              if (row.original.products.costs) {
                setActiveProduct({
                  ...row.original,
                  productId: row.original.products.id!,
                  quantity: 0,
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

  const columns = useMemo(
    () => [...originalCols, ...warehousesColumns, ...lastCols],
    [originalCols, isDisabled]
  );

  return { columns };
};
