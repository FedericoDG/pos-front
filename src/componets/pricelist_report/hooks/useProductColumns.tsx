import { ColumnDef, CellContext } from '@tanstack/react-table';
import { useMemo } from 'react';

import { IndeterminateCheckbox } from '../../table';
import { Product } from '../../../interfaces';

export const useProductColumns = () => {
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: 'seleccion',
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                key: row.original.id,
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        id: 'nombre',
        header: 'Nombre',
        cell: (row: CellContext<Product, unknown>) => row.renderValue(),
        accessorKey: 'name',
      },
      {
        id: 'categoría',
        header: 'Categoría',
        cell: (row: CellContext<Product, unknown>) => row.renderValue(),
        accessorFn: (x) => x.category?.name,
      },
      {
        id: 'cod',
        header: 'Código',
        cell: (row: CellContext<Product, unknown>) => row.renderValue(),
        accessorKey: 'code',
      },
      {
        id: 'cod_barra',
        header: 'Cód. de Barra',
        cell: (row: CellContext<Product, unknown>) => row.renderValue(),
        accessorKey: 'barcode',
      },
      {
        id: 'stock',
        header: 'Stock Total',
        cell: ({ row }: CellContext<Product, unknown>) => (
          <p>
            {row.original.totalStock} {row.original.unit?.code}
          </p>
        ),
        accessorFn: (x) => x.totalStock,
      },
    ],
    []
  );

  return { columns };
};
