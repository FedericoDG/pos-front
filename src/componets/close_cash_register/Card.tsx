import { Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';

import { useDischargesContext } from '.';

export const Card = () => {
  const { warehouse } = useDischargesContext();

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
      <TableContainer alignItems="flex-start" display={'flex'} gap={8} w="50%">
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
                Chofer
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td borderBottomWidth="0" fontSize={18}>
                {warehouse?.code}
              </Td>
            </Tr>
            <Tr>
              <Td borderColor="brand.500">
                {warehouse?.user?.name} {warehouse?.user?.lastname}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
