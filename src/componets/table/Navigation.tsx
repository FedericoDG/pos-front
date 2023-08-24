import { Box, Flex, Select, Text } from '@chakra-ui/react';
import { Table } from '@tanstack/react-table';

import { PagButton } from '.';

interface Props<T extends object> {
  table: Table<T>;
  memoAmount: number;
}

export const Navigation = <T extends object>({ table, memoAmount }: Props<T>) => (
  <Box bg="brand.700" borderRadius="md" color="white" my={1}>
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
            size="sm"
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
            left
            isDisabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          />
          <PagButton isDisabled={!table.getCanNextPage()} onClick={() => table.nextPage()} />
        </Flex>
      </Flex>
    </Flex>
  </Box>
);
