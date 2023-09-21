import {
  Flex,
  Stack,
  Button,
  HStack,
  TableContainer,
  Table,
  TableCaption,
  Text,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
} from '@chakra-ui/react';
import { ImPrinter } from 'react-icons/im';
import { useReactToPrint } from 'react-to-print';
import { useCallback, useMemo, useRef } from 'react';

import { CashMovement, Settings } from '../../interfaces';
import { formatDate, formatCurrency } from '../../utils';
import { formatTwoDigits } from '../../utils/formatCurrency';

interface Props {
  settings: Settings;
  cashMovement: CashMovement;
}

export const A = ({ cashMovement, settings }: Props) => {
  const printRef = useRef<any | null>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const getInvoceLetter = useCallback((num: number) => {
    switch (num) {
      case 1:
        return 'A';
      case 6:
        return 'B';
      case 11:
        return 'C';
      case 51:
        return 'M';
      default:
        return 'X';
    }
  }, []);

  const iva = useMemo(
    () =>
      cashMovement.cashMovementDetails?.reduce(
        (acc, el) => acc + el.quantity * el.price * el.tax,
        0
      ) || 0,
    [cashMovement.cashMovementDetails]
  );

  return (
    <Flex
      alignItems="center"
      bg="white"
      flexDir={{ base: 'column' }}
      justifyContent="space-between"
      p="4"
      rounded="md"
      shadow="md"
      w="full"
    >
      <Stack direction="row" justifyContent="flex-end" w="full">
        <Button
          alignSelf={'flex-end'}
          colorScheme="linkedin"
          leftIcon={<ImPrinter />}
          size="sm"
          onClick={handlePrint}
        >
          Imprimir
        </Button>
      </Stack>
      <Stack ref={printRef} border="1px solid black" w="209mm">
        <HStack alignItems="flex-start" as="header" justifyContent="space-between" pos="relative">
          <HStack p={2} w="50%">
            {settings.imageURL && (
              <img alt="logo" height={120} src={settings.imageURL} width={120} />
            )}
            <Stack px={settings.imageURL ? '' : 8}>
              <Text fontWeight={500}>{settings.name}</Text>
              <Text>{settings.address}</Text>
              <Text>
                {settings.cp} - {settings.province}
              </Text>
              <Text>{settings.ivaCondition}</Text>
            </Stack>
          </HStack>
          <HStack
            border="solid black"
            borderTop={0}
            borderWidth={1}
            justifyContent="center"
            left="95mm"
            pos="absolute"
            px={2}
            py={2}
            w="20mm"
          >
            <Text fontSize="48px" lineHeight={1} textAlign="center">
              {getInvoceLetter(cashMovement?.cbteTipo!)}
            </Text>
          </HStack>
          <Stack pl={20} py={2} w="50%">
            <Text fontSize="xl" fontWeight={500}>
              FACTURA
            </Text>
            <Text fontSize="xl" fontWeight={500}>
              N°: {cashMovement.posNumber.toString().padStart(3, '0')}-
              {cashMovement?.invoceNumberAfip!.toString().padStart(6, '0')}
            </Text>
            <Text>Fecha: {formatDate(cashMovement.createdAt)}</Text>
            <Text>CUIT: {settings.cuit}</Text>
          </Stack>
        </HStack>

        <HStack
          alignItems="flex-start"
          as="header"
          borderColor="black"
          borderTopWidth={1}
          justifyContent="space-between"
          pos="relative"
        >
          <Stack p={2}>
            <Text>
              Señores: {cashMovement.client?.name} {cashMovement.client?.lastname}
            </Text>
            <Text>Domicilio: {cashMovement.client?.address}</Text>
            <Text>
              {cashMovement.client?.identification?.description}: {cashMovement.client?.document}
            </Text>
          </Stack>
        </HStack>

        <HStack
          alignItems="flex-start"
          as="header"
          borderColor="black"
          borderTopWidth={1}
          justifyContent="space-between"
          pos="relative"
        >
          <TableContainer w="full">
            <Table size={'sm'} variant="simple">
              {(cashMovement.cbteTipo === 1 || cashMovement.cbteTipo === 51) && (
                <TableCaption>
                  <Text>
                    El crédito fiscal discriminado en el presente comprobante solo podrá ser
                    computado
                  </Text>
                  <Text>
                    a efectos del Procedimiento permanente de transición al Régimen General.
                  </Text>
                </TableCaption>
              )}
              <Thead>
                <Tr>
                  <Th isNumeric w="135px">
                    Cantidad
                  </Th>
                  <Th>Descripción</Th>
                  <Th isNumeric>Precio unitatio</Th>
                  <Th isNumeric>Alícuota</Th>
                  <Th isNumeric>Total</Th>
                </Tr>
              </Thead>
              <Tbody>
                {cashMovement.cashMovementDetails?.map((movement) => {
                  return (
                    <Tr key={movement.id}>
                      <Td isNumeric>
                        {movement.quantity} {movement.product?.unit?.code}
                      </Td>
                      <Td>{movement.product?.name}</Td>
                      <Td isNumeric>{formatCurrency(movement.price)}</Td>
                      <Td isNumeric>{formatTwoDigits(movement.tax * 100)}%</Td>
                      <Td isNumeric>{formatCurrency(movement.quantity * movement.price)}</Td>
                    </Tr>
                  );
                })}
                <Tr>
                  <Td borderWidth={0} colSpan={4} fontSize={16} fontWeight={500} textAlign="right">
                    Subtotal:
                  </Td>
                  <Td isNumeric borderWidth={0} fontSize={16} fontWeight={500}>
                    {formatCurrency(cashMovement.subtotal - iva)}
                  </Td>
                </Tr>
                <Tr>
                  <Td borderWidth={0} colSpan={4} fontSize={16} fontWeight={500} textAlign="right">
                    IVA:
                  </Td>
                  <Td isNumeric borderWidth={0} fontSize={16} fontWeight={500}>
                    {formatCurrency(iva)}
                  </Td>
                </Tr>
                {cashMovement.otherTributes > 0 &&
                  cashMovement.otherTributesDetails?.map((tribute) => (
                    <Tr key={tribute.id}>
                      <Td borderWidth={0} colSpan={4} textAlign="right">
                        {tribute.otherTribute?.description}
                      </Td>
                      <Td isNumeric borderWidth={0}>
                        {formatCurrency(tribute.amount)}
                      </Td>
                    </Tr>
                  ))}
                <Tr>
                  <Td borderWidth={0} colSpan={4} fontSize={18} fontWeight={700} textAlign="right">
                    TOTAL:
                  </Td>
                  <Td isNumeric borderWidth={0} fontSize={18} fontWeight={700}>
                    {formatCurrency(cashMovement.total)}
                  </Td>
                </Tr>
                <Tr>
                  <Td borderWidth={0} colSpan={4} fontSize={18} fontWeight={700} textAlign="right">
                    TOTAL AFIP:
                  </Td>
                  <Td isNumeric borderWidth={0} fontSize={18} fontWeight={700}>
                    {formatCurrency(Number(cashMovement?.impTotal))}
                  </Td>
                </Tr>
              </Tbody>
              <Tfoot>
                {cashMovement.discount > 0 && (
                  <>
                    <Tr>
                      <Th borderWidth={0}>Descuento:</Th>
                    </Tr>
                    <Tr>
                      <Td borderWidth={0} colSpan={1} fontSize={12}>
                        {formatCurrency(cashMovement.discount)}
                      </Td>
                      <Td borderWidth={0} colSpan={1} fontSize={12}>
                        {formatTwoDigits(cashMovement.discountPercent)}%
                      </Td>
                    </Tr>
                  </>
                )}
                {cashMovement.recharge > 0 && (
                  <>
                    <Tr>
                      <Th borderWidth={0}>Recargo:</Th>
                    </Tr>
                    <Tr>
                      <Td borderWidth={0} colSpan={1} fontSize={12}>
                        {formatCurrency(cashMovement.recharge)}
                      </Td>
                      <Td borderWidth={0} colSpan={1} fontSize={12}>
                        {formatTwoDigits(cashMovement.rechargePercent)}%
                      </Td>
                    </Tr>
                  </>
                )}
                <Tr>
                  <Th borderWidth={0}>Forma de Pago</Th>
                </Tr>
                {cashMovement.paymentMethodDetails?.map((payment) => (
                  <Tr key={payment.id}>
                    <Td borderWidth={0} colSpan={1} fontSize={12}>
                      {payment.paymentMethod.code}
                    </Td>
                    <Td borderWidth={0} fontSize={12}>
                      {formatCurrency(payment.amount)}
                    </Td>
                  </Tr>
                ))}
                {cashMovement.info && (
                  <>
                    <Tr>
                      <Th borderWidth={0} colSpan={5} fontSize={12}>
                        Otra información
                      </Th>
                    </Tr>
                    <Tr>
                      <Td borderWidth={0} fontSize={12}>
                        {cashMovement.info}
                      </Td>
                    </Tr>
                  </>
                )}
                <Tr>
                  <Th
                    isNumeric
                    colSpan={7}
                    fontSize={12}
                    style={{ borderWidth: '1px 0 0 0', borderColor: 'black' }}
                  >
                    CAE: {cashMovement.cae}
                  </Th>
                </Tr>
                <Tr>
                  <Th isNumeric borderWidth={0} colSpan={5} fontSize={12}>
                    Vto. CAE: {formatDate(cashMovement.vtoCae)}
                  </Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </HStack>
      </Stack>
    </Flex>
  );
};
