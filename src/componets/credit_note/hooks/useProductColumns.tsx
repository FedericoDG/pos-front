// import { Box, Button } from '@chakra-ui/react';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { useMemo, useCallback } from 'react';

import { CashMovementsDetail } from '../../../interfaces';
import { usePosContext } from '..';
import { formatCurrency } from '../../../utils';

/* interface Props {
  onOpen: () => void;
  setActiveProduct: Dispatch<React.SetStateAction<CashMovementsDetail>>;
  cashMovement: CashMovement;
} */

export const useProductColumns = () => {
  const { cart } = usePosContext();

  /*   const isDisabled = useCallback(
    (product: CashMovementsDetail) => {
      const productExist = cart.find((el: CashMovementsDetail) => el.id === product.id);

      if (
        productExist?.quantity! >= product.quantity! ||
        cashMovement.discount > 0 ||
        cashMovement.recharge > 0
      )
        return true;

      return false;
    },
    [cart, cashMovement]
  ); */

  const stock = useCallback(
    (product: CashMovementsDetail) => {
      const productExist = cart.find((el: CashMovementsDetail) => el.id === product.id);

      if (productExist) {
        return product.quantity! - (productExist.quantity! || 0);
      }

      return product.quantity;
    },
    [cart]
  );

  const columns = useMemo<ColumnDef<CashMovementsDetail>[]>(
    () => [
      {
        id: 'cantidad',
        header: 'Cantidad',
        cell: ({ row }: CellContext<CashMovementsDetail, unknown>) => (
          <p>
            {stock(row.original)} {row.original?.product?.unit?.code}
          </p>
        ),
        accessorFn: (x) => x,
      },
      {
        id: 'nombre',
        header: 'Nombre',
        cell: (row: CellContext<CashMovementsDetail, unknown>) => row.renderValue(),
        accessorFn: (x) => x.product?.name,
      },
      {
        id: 'precio unitario',
        header: 'Precio U.',
        cell: (row: CellContext<CashMovementsDetail, unknown>) => row.renderValue(),
        accessorFn: (x) => formatCurrency(x.price - x.totalDiscount / x.quantity),
      },
      {
        id: 'total',
        header: 'Total (incluye IVA)',
        cell: (row: CellContext<CashMovementsDetail, unknown>) => row.renderValue(),
        accessorFn: (x) => formatCurrency(x.price * x.quantity - x.totalDiscount + x.totalIVA), // ACA
      },
      /*       {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }: CellContext<CashMovementsDetail, unknown>) => (
          <Box fontFamily="Poppins">
            <Button
              colorScheme="brand"
              isDisabled={isDisabled(row.original!)}
              size="sm"
              type="submit"
              variant="ghost"
              onClick={() => {
                setActiveProduct({
                  ...row.original,
                  price: row.original.price - row.original.totalDiscount / row.original.quantity,
                  quantity: row.original.quantity,
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
      }, */
    ],
    [stock]
  );

  return { columns };
};
