import { Stack } from '@chakra-ui/react';
import { FC } from 'react';
import { TableContainer, Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react';

import { CashMovement } from '../../interfaces/interfaces';
import { getInvoiceLetter } from '../../utils';

interface Props {
  cashMovement: CashMovement;
}

export const Card: FC<Props> = ({ cashMovement }) => {
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
                Depósito
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td borderBottomWidth="0" fontSize={18}>
                {cashMovement.warehouse?.code}
              </Td>
            </Tr>
            <Tr>
              <Td borderColor="brand.500">{cashMovement.warehouse?.description}</Td>
            </Tr>
          </Tbody>
        </Table>

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
                Tipo de Comprobante
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td borderBottomWidth="0" fontSize={18}>
                Nota de Crédito {getInvoiceLetter(cashMovement.invoceIdAfip!)}
              </Td>
            </Tr>
            <Tr>
              <Td borderColor="brand.500"> </Td>
            </Tr>
          </Tbody>
        </Table>

        <Table size="sm">
          <Thead>
            <Tr>
              <Th
                bg="brand.500"
                borderBottomWidth="1"
                borderColor="brand.500"
                borderStyle="solid"
                colSpan={2}
                color="white"
                h={30}
              >
                Cliente
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td borderBottomWidth="0" fontSize={18}>
                {cashMovement.client?.identification?.description!}: {cashMovement.client?.document}
              </Td>
            </Tr>
            <Tr>
              <Td borderColor="brand.500"> {cashMovement.client?.name}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
