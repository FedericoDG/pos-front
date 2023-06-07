import { CellContext, ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  ButtonGroup,
  useDisclosure,
  Icon,
  Tooltip,
  Menu,
  IconButton,
  MenuButton,
  MenuItem,
  MenuList,
  Box,
} from '@chakra-ui/react';
import { HiPlus } from 'react-icons/Hi';
import { TbListDetails } from 'react-icons/Tb';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import {
  HamburgerIcon,
  AddIcon,
  ExternalLinkIcon,
  RepeatIcon,
  EditIcon,
  DragHandleIcon,
} from '@chakra-ui/icons';

import { DashBoard } from '../componets';
import { CustomTable } from '../componets/table';
import MOCK_DATA from '../componets/table/MOCK_DATA.json';
import { Drawer } from '../componets/products';
import { useGetCategories, useGetUnits } from '../hooks';
import { Product } from '../interfaces';
import { useGetProducts } from '../hooks/';
import { Loading } from '../componets/Loading';

/* type Item = {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  country: string;
  phone: string;
}; */

export const Products = () => {
  const resetValues: Product = {
    code: '',
    barcode: '',
    name: '',
    description: '',
    categoryId: 1,
    unitId: 1,
    status: 'ENABLED',
    allownegativestock: 'DISABLED',
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [initialValues, setinitialValues] = useState(resetValues);

  const { data: products, isFetching: isFetchingProducts } = useGetProducts();
  const { data: categories, isFetching: isFetchingCategories } = useGetCategories();
  const { data: units, isFetching: isFetchingUnits } = useGetUnits();

  const isIndeterminate = isFetchingProducts || isFetchingCategories || isFetchingUnits;

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: 'id',
        header: 'Id',
        cell: (row: CellContext<Product, unknown>) => row.renderValue(),
        accessorKey: 'id',
        size: 50,
      },
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
        id: 'cod_barra',
        header: 'Cód. de Barra',
        cell: (row: CellContext<Product, unknown>) => row.renderValue(),
        accessorKey: 'barcode',
      },
      {
        id: 'habilitado',
        header: 'Estado',
        cell: (row: CellContext<Product, unknown>) =>
          row.renderValue() === 'ENABLED' ? (
            <Badge colorScheme="teal" variant="subtle">
              {' '}
              Habilitado
            </Badge>
          ) : (
            <Badge colorScheme="red" variant="subtle">
              Deshabilitado
            </Badge>
          ),
        accessorKey: 'status',
      },
      {
        id: 'stock(-)',
        header: 'Permitir stock neg.',
        cell: (row: CellContext<Product, unknown>) =>
          row.renderValue() === 'ENABLED' ? (
            <Badge colorScheme="red" variant="subtle">
              Permitir
            </Badge>
          ) : (
            <Badge colorScheme="teal" variant="subtle">
              No Permitir
            </Badge>
          ),
        accessorFn: (x) => x.allownegativestock,
      },
      {
        id: 'stock',
        header: 'Stock',
        cell: ({ row }: CellContext<Product, unknown>) => (
          <p>
            {row.original.totalStock} {row.original.unit?.code}
          </p>
        ),
        accessorFn: (x) => x.totalStock,
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }: CellContext<Product, unknown>) => (
          <Box fontFamily="IBM Plex Sans">
            <Menu placement="left-start">
              <MenuButton
                aria-label="Options"
                as={IconButton}
                icon={<DragHandleIcon />}
                variant="outline"
              />
              <MenuList>
                <MenuItem icon={<TbListDetails />}>Ver Detalles</MenuItem>
                <MenuItem
                  icon={<FaRegEdit />}
                  onClick={() => {
                    onOpen();
                    setinitialValues(row.original);
                  }}
                >
                  Editar
                </MenuItem>
                <MenuItem icon={<FaRegTrashAlt />} onClick={() => console.log(row.original.id)}>
                  Eliminar
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        ),
        meta: {
          align: 'center',
        },
        size: 155,
      },
    ],
    [onOpen]
  );

  /* 
   <ButtonGroup spacing="1" variant="ghost">
            <Tooltip label="Ver detalles del producto">
              <Button colorScheme="green" size="sm">
                <Icon as={TbListDetails} boxSize={6} />
              </Button>
            </Tooltip>
            <Tooltip label="Editar producto">
              <Button
                colorScheme="blue"
                size="sm"
                onClick={() => {
                  onOpen();
                  setinitialValues(row.original);
                }}
              >
                <Icon as={FaRegEdit} boxSize={5} />
              </Button>
            </Tooltip>
            <Tooltip label="Eliminar producto">
              <Button colorScheme="red" size="sm" onClick={() => console.log(row.original.id)}>
                <Icon as={FaRegTrashAlt} boxSize={5} />
              </Button>
            </Tooltip>
          </ButtonGroup>
  */

  /*   const columns = useMemo<ColumnDef<Item>[]>(
() => [
{
  id: 'ID',
  header: 'Id',
  cell: (row: CellContext<Item, unknown>) => row.renderValue(),
  accessorKey: 'id',
  size: 50,
},
{
  id: 'Nombre',
  header: 'Nombre',
  cell: (row: CellContext<Item, unknown>) => row.renderValue(),
  accessorKey: 'first_name',
},
{
  id: 'Apellido',
  header: 'Apellido',
  cell: (row: CellContext<Item, unknown>) => row.renderValue(),
  accessorKey: 'last_name',
},
{
  id: 'Nacimiento',
  header: 'Nacimiento',
  cell: (row: CellContext<Item, unknown>) => row.renderValue(),
  accessorKey: 'date_of_birth',
},
{
  id: 'País',
  header: 'País',
  cell: (row: CellContext<Item, unknown>) => row.renderValue(),
  accessorKey: 'country',
},
{
  id: 'Teléfono',
  header: 'Teléfono',
  enableSorting: false,
  cell: (row: CellContext<Item, unknown>) => row.renderValue(),
  accessorFn: (x) => x.phone,
},
{
  id: 'Acciones',
  header: 'Acciones',
  cell: ({ row }: CellContext<Item, unknown>) => (
    <ButtonGroup spacing="1" variant="ghost">
      <Button colorScheme="green" size="sm">
        <Icon as={CgDetailsMore} boxSize={6} />
      </Button>
      <Button colorScheme="blue" size="sm" onClick={onOpen}>
        <Icon as={FaRegEdit} boxSize={5} />
      </Button>
      <Button colorScheme="red" size="sm" onClick={() => console.log(row.original.id)}>
        <Icon as={FaRegTrashAlt} boxSize={5} />
      </Button>
    </ButtonGroup>
  ),
  meta: {
    align: 'center',
  },
  size: 155,
},
],
[onOpen]
); */

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Productos">
      <Button colorScheme="green" leftIcon={<HiPlus />} mb={4} ml="auto" size="lg" onClick={onOpen}>
        Crear un Producto
      </Button>

      {!products || !categories || !units ? (
        <Loading />
      ) : (
        <>
          <CustomTable
            showColumsSelector
            showGlobalFilter
            showNavigation
            showPrintOption
            amount={products.length}
            columns={columns}
            data={products}
          />
          <Drawer
            categories={categories}
            initialValues={initialValues}
            isOpen={isOpen}
            resetValues={resetValues}
            setinitialValues={setinitialValues}
            units={units}
            onClose={onClose}
          />
        </>
      )}
    </DashBoard>
  );
};
