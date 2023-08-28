import { BsArrowRight } from 'react-icons/bs';
import { Stack, Icon, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';

import { useProductTransContext } from '.';

export const Card = () => {
  const { warehouse, warehouse2 } = useProductTransContext();

  return (
    <Stack
      alignItems="center"
      bg="white"
      direction="row"
      justifyContent="space-between"
      mb="2"
      p="4"
      rounded="md"
      shadow="md"
      w="full"
    >
      <TableContainer alignItems="flex-start" display={'flex'} gap={8} w="full">
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
                Depósito
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
              <Td borderColor="brand.500">{warehouse?.description}</Td>
            </Tr>
          </Tbody>
        </Table>

        <Icon alignSelf={'center'} as={BsArrowRight} boxSize={14} color="brand.500" />

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
                {warehouse2?.code}
              </Td>
            </Tr>
            <Tr>
              <Td borderColor="brand.500">{warehouse2?.description}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
