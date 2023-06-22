import type { FilterFn, SortingState } from '@tanstack/react-table';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Box,
  Button,
  Flex,
  Icon,
  Stack,
  Table as TableChakra,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons';
import './customTable.css';
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { ImPrinter } from 'react-icons/im';
import { useMemo, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

import { usePriceListContext } from '../pricelistreport/context';

import { Navigation } from './Navigation';

import { ColumnSelector, GlobalFilter } from './';
import { filterFns } from './';

interface ReactTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  amount: number;
  showFooter?: boolean;
  showNavigation?: boolean;
  showGlobalFilter?: boolean;
  showColumsSelector?: boolean;
  showPrintOption?: boolean;
  showSelectButton?: boolean;
  filterFn?: FilterFn<T>;
  flag?: string;
}

export const CustomTable = <T extends object>({
  data,
  columns,
  amount,
  showFooter = false,
  showNavigation = false,
  showGlobalFilter = false,
  showColumsSelector = false,
  showPrintOption = false,
  showSelectButton = false,
  filterFn = filterFns.contains,
  flag = '',
}: ReactTableProps<T>) => {
  const [globalFilter, setGlobalFilter] = useState('');

  const [sorting, setSorting] = useState<SortingState>([]);

  const [columnVisibility, setColumnVisibility] = useState({});

  const [rowSelection, setRowSelection] = useState({});

  const tableRef = useRef<HTMLDivElement | null>(null);

  const memoAmount = useMemo(() => amount, [amount]);

  const table = useReactTable({
    data,
    columns,
    //
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      rowSelection: rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    //
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: filterFn,
    //
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    //
    onRowSelectionChange: setRowSelection,
  });

  const {
    setProductList,
    setPriceListsList,
    setWarehousesList,
    goToNext,
    goToPrevious,
    activeStep,
  } = usePriceListContext();

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
  });

  const getIds = (rows: any[]) => {
    if (flag === 'products') {
      setProductList(() => [...rows.map((el) => el.id)]);
    }

    if (flag === 'priceLists') {
      setPriceListsList(() => [...rows.map((el) => el.id)]);
    }

    if (flag === 'warehouses') {
      setWarehousesList(() => [...rows.map((el) => el.id)]);
    }
    setRowSelection({});
    goToNext();
  };

  return (
    <Box _dark={{ bg: 'gray.700' }} bg="white" mb={20} p="4" rounded="md" shadow="md" w="full">
      <Flex gap="1" justifyContent="flex-end">
        {showPrintOption && (
          <Button colorScheme="linkedin" leftIcon={<ImPrinter />} size="sm" onClick={handlePrint}>
            Imprimir
          </Button>
        )}

        {showSelectButton && (
          <Stack direction="row" justifyContent="space-between" w="full">
            <Button
              colorScheme="brand"
              isDisabled={activeStep === 1}
              leftIcon={<ArrowBackIcon />}
              minW="150px"
              size="lg"
              onClick={goToPrevious}
            >
              ANTERIOR
            </Button>
            <Button
              colorScheme="brand"
              isDisabled={Object.keys(rowSelection).length === 0 && flag !== 'warehouses'}
              minW="150px"
              rightIcon={<ArrowForwardIcon />}
              size="lg"
              onClick={() => getIds(table.getSelectedRowModel().flatRows.map((el) => el.original))}
            >
              SIGUIENTE
            </Button>
          </Stack>
        )}
      </Flex>

      <Flex
        alignItems={{ base: 'flex-start', md: 'center' }}
        direction={{ base: 'column', md: 'row' }}
        justifyContent={'flex-end'}
        py="2"
      >
        {showColumsSelector ? <ColumnSelector table={table} /> : null}
      </Flex>

      <Flex
        alignItems={{ base: 'flex-start', md: 'center' }}
        direction={{ base: 'column', md: 'row' }}
        py="2"
      >
        {showGlobalFilter && (
          <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
        )}
      </Flex>

      <TableContainer
        ref={tableRef}
        _dark={{ bg: 'gray.700', color: 'whitesmoke' }}
        bg="white"
        border="1px"
        borderColor="blackAlpha.300"
        fontFamily="IBM Plex Mono, mono"
        mt="6"
        rounded=" md"
        w="full"
      >
        <TableChakra colorScheme="blackAlpha" size="sm" variant="simple">
          <Thead h="10">
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Th
                      key={header.id}
                      bg="gray.700"
                      colSpan={header.colSpan}
                      color="whitesmoke"
                      px="1"
                      style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                      textAlign={(header.column.columnDef.meta as any)?.align}
                    >
                      {header.isPlaceholder ? null : (
                        <Box
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <Icon as={ArrowDownIcon} />,
                            desc: <Icon as={ArrowUpIcon} />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </Box>
                      )}
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id} px="1" textAlign={(cell.column.columnDef.meta as any)?.align}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>

          {showFooter && (
            <Tfoot>
              {table.getFooterGroups().map((footerGroup) => (
                <Tr key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <Th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.footer, header.getContext())}
                    </Th>
                  ))}
                </Tr>
              ))}
            </Tfoot>
          )}
        </TableChakra>
      </TableContainer>

      {showNavigation && <Navigation memoAmount={memoAmount} table={table} />}
    </Box>
  );
};
