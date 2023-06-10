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
  FormControl,
  FormLabel,
  Icon,
  Select,
  Switch,
  Table as TableChakra,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import './customTable.css';
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { ImPrinter } from 'react-icons/im';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useMemo, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

import { DebouncedInput } from './';
import { filterFns } from './';

interface Id {
  id: string;
}

interface ReactTableProps<T extends object & Id> {
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
}

const PagButton = (props: any) => {
  const activeStyle = {
    bg: 'gray.300',
    color: 'white',
  };

  return (
    <Button
      _hover={!props.isDisabled && activeStyle}
      bg="white"
      color="gray.800"
      cursor={props.isDisabled && 'not-allowed'}
      mx={1}
      opacity={props.isDisabled && 0.6}
      px={4}
      py={2}
      rounded="lg"
      {...(props.active && activeStyle)}
      {...props}
    >
      {props.children}
    </Button>
  );
};

export const CustomTable = <T extends object & Id>({
  data,
  columns,
  amount,
  showFooter = false,
  showNavigation = false,
  showGlobalFilter = false,
  showColumsSelector = false,
  showPrintOption = false,
  showSelectButton = false,
  filterFn = filterFns.fuzzy,
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
      rowSelection,
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

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
  });

  const getIds = (rows: T[]) => {
    const ids = JSON.stringify(rows.map((el) => el.id));

    console.log(ids);
  };

  return (
    <Box bg="white" mb={20} p="4" rounded="md" shadow="md" w="full">
      <Flex gap="1" justifyContent="flex-end">
        {showPrintOption ? (
          <Button colorScheme="linkedin" leftIcon={<ImPrinter />} size="sm" onClick={handlePrint}>
            Imprimir
          </Button>
        ) : null}
        {showSelectButton ? (
          <Button
            colorScheme="purple"
            isDisabled={table.getSelectedRowModel().flatRows.length < 1}
            size="sm"
            onClick={() => {
              getIds(table.getSelectedRowModel().flatRows.map((el) => el.original));
            }}
          >
            Hacer algo con las filas seleccionadas
          </Button>
        ) : null}
      </Flex>
      <Flex
        alignItems={{ base: 'flex-start', md: 'center' }}
        direction={{ base: 'column', md: 'row' }}
        justifyContent={showGlobalFilter ? 'space-between' : 'flex-end'}
        py="2"
      >
        {showGlobalFilter ? (
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={(value) => setGlobalFilter(String(value))}
          />
        ) : null}
        {showColumsSelector ? (
          <Flex
            bg="white"
            border="1px"
            borderColor="blackAlpha.100"
            direction={{ base: 'column', md: 'row' }}
            justifyContent="flex-end"
            p="2"
            rounded="md"
          >
            {table.getAllLeafColumns().map((column) => (
              <FormControl
                key={column.id}
                alignItems="center"
                display="flex"
                justifyContent="flex-end"
              >
                <FormLabel
                  alignItems="center"
                  cursor="pointer"
                  display="flex"
                  htmlFor={column.id}
                  mb="0"
                  ml="5"
                  mr="0"
                >
                  <Text fontSize="sm">{column.id}</Text>
                  <Switch
                    id={column.id}
                    isChecked={column.getIsVisible()}
                    ml={1}
                    size="sm"
                    onChange={column.getToggleVisibilityHandler()}
                  />
                </FormLabel>
              </FormControl>
            ))}
          </Flex>
        ) : null}
      </Flex>

      <TableContainer
        ref={tableRef}
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
                      bg="blackAlpha.800"
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

          {showFooter ? (
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
          ) : null}
        </TableChakra>
      </TableContainer>

      {showNavigation ? (
        <Box bg="blackAlpha.700" borderRadius="md" color="white" my={1}>
          <Flex alignItems="center" justifyContent="flex-end" p={1} w="full">
            <Flex alignItems="center" mr="10">
              <Text fontSize="md">
                página{' '}
                <strong>
                  {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                </strong>
              </Text>
              <Flex alignItems="center">
                <Select
                  maxW="160"
                  ml={1}
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                >
                  <option style={{ color: 'black' }} value={10}>
                    mostrar 10
                  </option>
                  <option style={{ color: 'black' }} value={20}>
                    mostrar 20
                  </option>
                  <option style={{ color: 'black' }} value={30}>
                    mostrar 30
                  </option>
                  <option style={{ color: 'black' }} value={40}>
                    mostrar 40
                  </option>
                  <option style={{ color: 'black' }} value={50}>
                    mostrar 50
                  </option>
                  <option style={{ color: 'black' }} value={memoAmount}>
                    mostrar todos
                  </option>
                </Select>
              </Flex>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between">
              <Flex alignItems="center">
                <PagButton
                  isDisabled={!table.getCanPreviousPage()}
                  onClick={() => table.previousPage()}
                >
                  <Icon
                    _dark={{ color: 'gray.200' }}
                    as={IoIosArrowBack}
                    boxSize={4}
                    color="gray.700"
                  />
                </PagButton>
                <PagButton isDisabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
                  <Icon
                    _dark={{ color: 'gray.200' }}
                    as={IoIosArrowForward}
                    boxSize={4}
                    color="gray.700"
                  />
                </PagButton>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      ) : null}
    </Box>
  );
};
