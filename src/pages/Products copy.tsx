import { Button, ButtonGroup, useDisclosure, Icon } from '@chakra-ui/react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { HiPlus } from 'react-icons/Hi';
import { useMemo, useState } from 'react';

import { CustomTable } from '../componets/table';
import { DashBoard } from '../componets/common';
import { Drawer } from '../componets/products';
import { Loading } from '../componets/common/Loading';
import { Product } from '../interfaces';
import { useColumns } from '../componets/products/hooks';
import { useGetCategories, useGetUnits } from '../hooks';
import { useGetProducts } from '../hooks/';
import MOCK_DATA from '../componets/table/MOCK_DATA.json';

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

  const { columns } = useColumns({ onOpen, setinitialValues });

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
  );
 */
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
