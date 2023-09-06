/* eslint-disable react/no-children-prop */
import { Stack, TableContainer, Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react';

import { useUpdatePriceContext } from '.';

export const Card = () => {
  const { priceList } = useUpdatePriceContext();

  return (
    <Stack
      alignItems="flex-start"
      bg="white"
      direction="row"
      justifyContent="space-between"
      mb="2"
      p="4"
      rounded="md"
      shadow="md"
      w="full"
    >
      <TableContainer display={'flex'} gap={8} w="full">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th
                bg="brand.500"
                borderBottomWidth="1"
                borderColor="black"
                borderStyle="solid"
                colSpan={2}
                color="white"
                h={30}
              >
                Lista de Precio
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td borderBottomWidth="0" fontSize={18}>
                {priceList?.code.toUpperCase()}
              </Td>
            </Tr>
            <Tr>
              <Td borderColor="brand.500">{priceList?.description}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
