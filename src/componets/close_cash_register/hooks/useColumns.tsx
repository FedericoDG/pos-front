/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button } from '@chakra-ui/react';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';

import { CartItem } from '..';
import { formatCurrency } from '../../../utils';
import { Stock2, Warehouse } from '../../../interfaces/interfaces';

interface Props {
  onOpen: () => void;
  warehouses: Warehouse[];
  setActiveProduct: Dispatch<SetStateAction<CartItem>>;
}

export const useColumns = ({ onOpen, warehouses, setActiveProduct }: Props) => {
  const warehousesColumns: ColumnDef<Stock2>[] = warehouses.map((el, idx) => ({
    id: el.code,
    header: el.code,
    cell: ({ row }: CellContext<Stock2, unknown>) => {
      if (row.original.products.stocks) {
        if (row.original.products.stocks[idx]) {
          return (
            <p>
              {row.original.products.stocks[idx].stock} {row.original.products.unit?.code}
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
        <Box fontFamily="IBM Plex Sans">
          <Button
            colorScheme="brand"
            isDisabled={row.original.stock <= 0}
            size="sm"
            type="submit"
            variant="ghost"
            onClick={() => {
              if (row.original.products.costs) {
                setActiveProduct({
                  ...row.original,
                  productId: row.original.products.id!,
                  quantity: 0,
                  cost: row.original.products.costs[0].price,
                  reasonId: 1,
                  info: '',
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
    [originalCols]
  );

  return { columns };
};
