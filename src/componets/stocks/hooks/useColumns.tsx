/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Icon, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import { ColumnDef, CellContext } from '@tanstack/react-table';
import { useMemo } from 'react';
import { GoAlert, GoGraph } from 'react-icons/go';
import { TbListDetails } from 'react-icons/Tb';
import { useNavigate } from 'react-router-dom';
import { AiFillDollarCircle, AiOutlineDollarCircle } from 'react-icons/ai';

import { Warehouse } from '../../../interfaces/interfaces';
import { formatCurrency } from '../../../utils';
import { Stock2 } from '../../../interfaces';

interface Props {
  warehouses: Warehouse[];
}

export const useColumns = ({ warehouses }: Props) => {
  const navigate = useNavigate();

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
        <Box fontFamily="Poppins">
          <Menu placement="left-start">
            <MenuButton
              aria-label="Options"
              as={IconButton}
              fontSize={24}
              icon={<BsThreeDots />}
              variant="link"
            />
            <MenuList>
              <MenuItem
                icon={<TbListDetails />}
                onClick={() => navigate(`/panel/productos/detalles/${row.original.productId}`)}
              >
                Ver Detalles
              </MenuItem>
              <MenuItem
                icon={<Icon as={GoGraph} />}
                onClick={() =>
                  navigate(`/panel/productos/detalles/${row.original.productId}?tab=1`)
                }
              >
                Ver Evolución del Stock
              </MenuItem>
              <MenuItem
                icon={<GoAlert />}
                isDisabled={row.original.stock <= 0}
                onClick={() =>
                  navigate(`/panel/productos/detalles/${row.original.productId}?tab=0&discharge=1`)
                }
              >
                Cargar pérdida de stock
              </MenuItem>
              <MenuItem
                icon={<Icon as={AiOutlineDollarCircle} />}
                onClick={() =>
                  navigate(`/panel/productos/detalles/${row.original.productId}?tab=0&price=1`)
                }
              >
                Actualizar Precios
              </MenuItem>
              <MenuItem
                icon={<Icon as={AiFillDollarCircle} />}
                onClick={() =>
                  navigate(`/panel/productos/detalles/${row.original.productId}?tab=0&cost=1`)
                }
              >
                Actualizar Costo
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
