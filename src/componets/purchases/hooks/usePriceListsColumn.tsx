import { ColumnDef, CellContext } from '@tanstack/react-table';
import { useMemo } from 'react';

import { IndeterminateCheckbox } from '../../table';
import { Pricelists } from '../../../interfaces';

export const usePriceListsColumns = () => {
  const columns = useMemo<ColumnDef<Pricelists>[]>(
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
        id: 'codigo',
        header: 'Código',
        cell: (row: CellContext<Pricelists, unknown>) => row.renderValue(),
        accessorKey: 'code',
      },
      {
        id: 'descripcion',
        header: 'Descrición',
        cell: (row: CellContext<Pricelists, unknown>) => row.renderValue(),
        accessorKey: 'description',
      },
    ],
    []
  );

  return { columns };
};
