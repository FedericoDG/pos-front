import { Box, Button } from '@chakra-ui/react';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { Dispatch, useMemo } from 'react';

import { Product } from '../../../interfaces';
import { CartItem } from '..';

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
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }: CellContext<Product, unknown>) => (
          <Box fontFamily="IBM Plex Sans">
            <Button
              colorScheme="brand"
              size="sm"
              type="submit"
              variant="ghost"
              onClick={() => {
                setActiveProduct({ ...row.original, quantity: 0, price: 0 });
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
