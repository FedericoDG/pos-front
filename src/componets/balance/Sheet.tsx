import {
  Box,
  Button,
  HStack,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { ImPrinter } from 'react-icons/im';

import { useGetBalance } from '../../hooks';
import { Loading } from '../common';
import { formatCurrency, formatDate } from '../../utils';

import { useBalanceContext } from '.';

export const Sheet = () => {
  const { user, payment, from, to, goToPrevious } = useBalanceContext();

  const printRef = useRef<any | null>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const data = {
    userId: user?.value!,
    paymentMethodId: payment?.value!,
    from,
    to,
  };

  const getType = (type: string) => {
    if (type === 'IN') return 'Ingreso';

    return 'Egreso';
  };

  const { data: balance, isFetching } = useGetBalance(data);

  if (isFetching) return <Loading />;

  return (
    <Stack w="full">
      <HStack>
        <Button
          colorScheme="brand"
          leftIcon={<ArrowBackIcon />}
          minW="170px"
          mr="auto"
          size="lg"
          onClick={() => goToPrevious()}
        >
          VOLVER
        </Button>
      </HStack>
      <Stack m="0 auto" maxW="1024px">
        <Button
          alignSelf={'flex-end'}
          colorScheme="linkedin"
          leftIcon={<ImPrinter />}
          size="sm"
          onClick={handlePrint}
        >
          Imprimir
        </Button>
        <Stack ref={printRef} py="8">
          <TableContainer w="210mm">
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th bg="gray.700" color="white">
                    Desde
                  </Th>
                  <Th bg="gray.700" color="white">
                    Hasta
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>{formatDate(balance?.from)}</Td>
                  <Td>{formatDate(balance?.to)}</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          <HStack alignItems="flex-start" w="210mm">
            <TableContainer w="full">
              <Table size="sm">
                <Text as="caption" fontSize="sm">
                  INGRESOS
                </Text>
                <Thead>
                  <Tr>
                    <Th bg="gray.700" color="white" />
                    <Th isNumeric bg="gray.700" color="white">
                      TOTAL
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Efectivo</Td>
                    <Td isNumeric>{formatCurrency(balance?.incomes.totalCash!)}</Td>
                  </Tr>
                  <Tr>
                    <Td>Débito</Td>
                    <Td isNumeric>{formatCurrency(balance?.incomes.totalDebit!)}</Td>
                  </Tr>
                  <Tr>
                    <Td>Crédito</Td>
                    <Td isNumeric>{formatCurrency(balance?.incomes.totalCredit!)}</Td>
                  </Tr>
                  <Tr>
                    <Td>Transferencia</Td>
                    <Td isNumeric>{formatCurrency(balance?.incomes.totalTransfer!)}</Td>
                  </Tr>
                  <Tr>
                    <Td borderColor="black">Mercado Pago</Td>
                    <Td isNumeric borderColor="black">
                      {formatCurrency(balance?.incomes.totalMercadoPago!)}
                    </Td>
                  </Tr>
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th />
                    <Th isNumeric color="green.600" fontSize={16}>
                      {formatCurrency(balance?.incomes.totalIncomes!)}
                    </Th>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>

            <TableContainer w="full">
              <Table size="sm">
                <Text as="caption" fontSize="sm">
                  EGRESOS
                </Text>
                <Thead>
                  <Tr>
                    <Th bg="gray.700" color="white" />
                    <Th isNumeric bg="gray.700" color="white">
                      TOTAL
                    </Th>
                  </Tr>
                </Thead>
                <Tfoot>
                  <Tr>
                    <Th />
                    <Th isNumeric color="red.600" fontSize={16}>
                      {formatCurrency(balance?.outcomes.totalOutcomes!)}
                    </Th>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>
            <TableContainer w="full">
              <Table size="sm">
                <Text as="caption" fontSize="sm">
                  BALANCE
                </Text>
                <Thead>
                  <Tr>
                    <Th bg="gray.700" color="white" />
                    <Th isNumeric bg="gray.700" color="white">
                      TOTAL
                    </Th>
                  </Tr>
                </Thead>
                <Tfoot>
                  <Tr>
                    <Th fontSize={14} />
                    <Th isNumeric fontSize={16}>
                      {formatCurrency(
                        balance?.incomes.totalIncomes! - balance?.outcomes.totalOutcomes!
                      )}
                    </Th>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>
          </HStack>
          <TableContainer w="210mm">
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th bg="gray.700" color="white">
                    Fecha
                  </Th>
                  <Th bg="gray.700" color="white">
                    Monto
                  </Th>
                  <Th bg="gray.700" color="white">
                    Tipo
                  </Th>
                  <Th bg="gray.700" color="white">
                    Forma de pago
                  </Th>
                  <Th bg="gray.700" color="white">
                    Concepto
                  </Th>
                  <Th bg="gray.700" color="white">
                    Usuario
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {balance?.movements.map((el) => (
                  <Tr key={el.id}>
                    <Td>{formatDate(el.createdAt)}</Td>
                    <Td isNumeric>{formatCurrency(el.amount)}</Td>
                    <Td color={el.type === 'IN' ? 'green.600' : 'red.600'}>{getType(el.type)}</Td>
                    <Td>{el.paymentMethod?.code}</Td>
                    <Td>{el.concept}</Td>
                    <Td>
                      {el.user?.name} {el.user?.lastname}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          {/* <pre>{JSON.stringify(balance, null, 2)}</pre> */}
        </Stack>
      </Stack>
    </Stack>
  );
};
