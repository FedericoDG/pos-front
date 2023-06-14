import { Flex, FormControl, FormLabel, Text, Switch } from '@chakra-ui/react';
import { Table } from '@tanstack/react-table';

interface Props<T extends object> {
  table: Table<T>;
}

export const ColumnSelector = <T extends object>({ table }: Props<T>) => {
  return (
    <Flex
      _dark={{ bg: 'gray.600', color: 'whitesmoke' }}
      bg="blackAlpha.50"
      border="1px"
      borderColor="blackAlpha.100"
      direction={{ base: 'column', md: 'row' }}
      justifyContent="flex-end"
      p="2"
      rounded="md"
    >
      {table.getAllLeafColumns().map((column) => (
        <FormControl key={column.id} alignItems="center" display="flex" justifyContent="flex-end">
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
              colorScheme="brand"
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
  );
};
