import { ColumnDef, CellContext } from '@tanstack/react-table';
import { Dispatch, useMemo } from 'react';
import { Box, Button } from '@chakra-ui/react';

import { Product } from '../../../interfaces';

interface Props {
  onOpen: () => void;
  setActiveProduct: Dispatch<React.SetStateAction<Product | undefined>>;
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
              variant="outline"
              onClick={() => {
                setActiveProduct(row.original);
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
