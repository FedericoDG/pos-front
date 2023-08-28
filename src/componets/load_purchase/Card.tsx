import { Icon, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { BsArrowRight } from 'react-icons/bs';

import { usePurchasesContext } from '.';

export const Card = () => {
  const { supplier, warehouse } = usePurchasesContext();

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
                Proveedor
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td borderBottomWidth="0" fontSize={18}>
                {supplier?.cuit}
              </Td>
            </Tr>
            <Tr>
              <Td borderBottomWidth="0" borderColor="brand.500">
                {supplier?.name}
              </Td>
            </Tr>
            {supplier?.phone && (
              <Tr>
                <Td borderBottomWidth="0" borderColor="brand.500">
                  {supplier?.phone}
                </Td>
              </Tr>
            )}
            {supplier?.mobile && (
              <Tr>
                <Td borderBottomWidth="0" borderColor="brand.500">
                  {supplier?.mobile}
                </Td>
              </Tr>
            )}
            {supplier?.email && (
              <Tr>
                <Td borderColor="brand.500">{supplier?.email}</Td>
              </Tr>
            )}
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
      </TableContainer>
    </Stack>
  );
};
