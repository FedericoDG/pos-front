/* eslint-disable react-hooks/exhaustive-deps */
import { DragHandleIcon } from '@chakra-ui/icons';
import { Box, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { GoAlert } from 'react-icons/go';
import { TbListDetails } from 'react-icons/Tb';
import { useNavigate } from 'react-router-dom';

import { Stock2 } from '../../../interfaces';
import { formatCurrency } from '../../../utils';
import { Discharge, Warehouse } from '../../../interfaces/interfaces';

interface Props {
  onOpen: () => void;
  warehouses: Warehouse[];
  setinitialValues: Dispatch<SetStateAction<Discharge>>;
}

export const useColumns = ({ onOpen, warehouses, setinitialValues }: Props) => {
  const navigate = useNavigate();

  /* const warehousesColumns: ColumnDef<Stock2>[] = warehouses.map((el, idx) => ({
    id: el.code,
    header: el.code,
    cell: ({ row }: CellContext<Stock2, unknown>) => {
      if (row.original.products.stocks) {
        return (
          <p>
            {row.original.products.stocks[idx].stock} {row.original.products.unit?.code}
          </p>
        );
      }
    },
    accessorFn: (x) => {
      if (x.products.stocks) {
        return x.products.stocks[idx].stock;
      }
    },
  })); */

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
    {
      id: 'cod_barra',
      header: 'Cód. de Barra',
      cell: (row: CellContext<Stock2, unknown>) => row.renderValue(),
      accessorFn: (x) => x.products.barcode,
    },
    {
      id: 'stock',
      header: 'Stock',
      cell: ({ row }: CellContext<Stock2, unknown>) => (
        <p>
          {row.original.stock} {row.original.products.unit?.code}
        </p>
      ),
      accessorFn: (x) => x.stock,
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
          <Menu placement="left-start">
            <MenuButton
              aria-label="Options"
              as={IconButton}
              icon={<DragHandleIcon />}
              variant="outline"
            />
            <MenuList>
              <MenuItem
                icon={<TbListDetails />}
                onClick={() => navigate(`/panel/productos/${row.original.productId}`)}
              >
                Ver Detalles
              </MenuItem>
              <MenuItem
                icon={<GoAlert />}
                isDisabled={row.original.stock <= 0}
                onClick={() => {
                  onOpen();
                  setinitialValues((current) => {
                    return {
                      ...current,
                      productId: row.original.productId,
                      cost: row.original.products.costs![0].price.toString(),
                      unit: row.original.products.unit?.code!,
                    };
                  });
                }}
              >
                Cargar pérdida de stock
              </MenuItem>
            </MenuList>
          </Menu>
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
