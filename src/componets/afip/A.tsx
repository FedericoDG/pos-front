/* eslint-disable prettier/prettier */
import {
  Flex,
  Stack,
  Button,
  HStack,
  TableContainer,
  Table,
  Text,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react';
import { ImPrinter } from 'react-icons/im';
import { useReactToPrint } from 'react-to-print';
import { Fragment, useMemo, useRef } from 'react';
import { nanoid } from 'nanoid';

import { CashMovement, Settings } from '../../interfaces';
import { formatDate, formatCurrency, getInvoiceName, getInvoiceLetter } from '../../utils';
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


  const iva = useMemo(
    () =>
      cashMovement.cashMovementDetails?.reduce(
        (acc, el) => acc + el.quantity * el.price * el.tax,
        0
      ) || 0,
    [cashMovement.cashMovementDetails]
  );

  const iva2 = useMemo(() => {
    const fede = cashMovement.cashMovementDetails?.reduce((acc: any, el) => {
      acc[el.tax] ??= 0;
      acc[el.tax] += el.quantity * el.price * el.tax;

      return acc;
    }, {});

    const arr = [];

    for (const key in fede) {
      arr.push({
        percent: 'IVA ' + formatTwoDigits(parseFloat(key) * 100) + '%',
        value: Math.round(fede[key] * 100) / 100,
      });
    }

    return arr.filter((el) => el.percent !== 'IVA 0,00%');
  }, [cashMovement.cashMovementDetails]);

  return (
    <Flex
      alignItems="center"
      bg="white"
      flexDir={{ base: 'column' }}
      justifyContent="center"
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
          mb="2"
          size="sm"
          onClick={handlePrint}
        >
          Imprimir
        </Button>
      </Stack>
      <Flex ref={printRef} direction="column" minH="267mm" w="210mm">
        <Stack className="header">
          <HStack alignItems="flex-start" justifyContent="space-between" pos="relative">
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
              borderWidth={1}
              justifyContent="center"
              left="95mm"
              pos="absolute"
              px={2}
              py={2}
              w="20mm"
            >
              <Text fontSize="48px" lineHeight={1} textAlign="center">
                {getInvoiceLetter(cashMovement?.cbteTipo!)}
              </Text>
            </HStack>
            <Stack pl={20} py={2} w="50%">
              <Text fontSize="xl" fontWeight={500}>
                {getInvoiceName(cashMovement?.cbteTipo!)}
              </Text>
              <Text fontSize="xl" fontWeight={500}>
                N°: {cashMovement.posNumber.toString().padStart(5, '0')}-
                {cashMovement?.invoceNumberAfip!.toString().padStart(8, '0')}
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
              <Text>Señores: {cashMovement.client?.name}</Text>
              <Text>Domicilio: {cashMovement.client?.address}</Text>
              <Text>
                {cashMovement.client?.identification?.description}: {cashMovement.client?.document}
              </Text>
            </Stack>
          </HStack>
        </Stack>

        <TableContainer w="full">
          <Table size={'sm'} variant="simple">
            <Tbody>
              {cashMovement.cashMovementDetails?.map((movement, idx) => {
                return (
                  <Fragment key={movement.id}>
                    {idx % 21 === 0 && (
                      <>
                        <Tr>
                          <Th isNumeric className="coso" w="100px">
                            Cantidad
                          </Th>
                          <Th className="coso">Descripción</Th>
                          <Th isNumeric className="coso">
                            Precio unitatio
                          </Th>
                          <Th isNumeric className="coso">
                            Alícuota
                          </Th>
                          <Th isNumeric className="coso">
                            Total
                          </Th>
                        </Tr>
                      </>
                    )}
                    <Tr>
                      <Td isNumeric>
                        {movement.quantity} {movement.product?.unit?.code}
                      </Td>
                      <Td>{movement.product?.name}</Td>
                      <Td isNumeric>{formatCurrency(movement.price)}</Td>
                      <Td isNumeric>{formatTwoDigits(movement.tax * 100)}%</Td>
                      <Td isNumeric>{formatCurrency(movement.quantity * movement.price)}</Td>
                    </Tr>
                  </Fragment>
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
              {iva2.length > 0 &&
                iva2.map((el) => (
                  <Tr key={nanoid()}>
                    <Td
                      borderWidth={0}
                      colSpan={4}
                      fontSize={16}
                      fontWeight={500}
                      textAlign="right"
                    >
                      {el.percent}
                    </Td>
                    <Td isNumeric borderWidth={0} fontSize={16} fontWeight={500}>
                      {formatCurrency(el.value)}
                    </Td>
                  </Tr>
                ))}
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
                <Td
                  borderWidth={0}
                  colSpan={4}
                  fontSize={18}
                  fontWeight={700}
                  pb="100px"
                  textAlign="right"
                >
                  TOTAL:
                </Td>
                <Td isNumeric borderWidth={0} fontSize={18} fontWeight={700} pb="100px">
                  {formatCurrency(cashMovement.total)}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        <div style={{ flex: 1 }} />
        <HStack alignItems="flex-start" color="#4a5568" fontSize="sm">
          {cashMovement.cbteTipo !== 3 && (
            <Stack>
              <Text fontWeight={700} width="180px">
                FORMA DE PAGO:
              </Text>
              {cashMovement.paymentMethodDetails?.map((payment) => (
                <HStack key={payment.id}>
                  <Text width="180px">{payment.paymentMethod.code}</Text>
                  <Text width="180px">{formatCurrency(payment.amount)}</Text>
                </HStack>
              ))}
            </Stack>
          )}
          {cashMovement.discount > 0 && (
            <Stack>
              <Text fontWeight={700} width="180px">
                DESCUENTO:
              </Text>
              <HStack>
                <Text width="180px">{formatCurrency(cashMovement.discount)}</Text>
                <Text width="180px">{formatTwoDigits(cashMovement.discountPercent)}%</Text>
              </HStack>
            </Stack>
          )}
          {cashMovement.recharge > 0 && (
            <Stack>
              <Text fontWeight={700} width="180px">
                RECARGO:
              </Text>
              <HStack>
                <Text width="180px">{formatCurrency(cashMovement.recharge)}</Text>
                <Text width="180px">{formatTwoDigits(cashMovement.rechargePercent)}%</Text>
              </HStack>
            </Stack>
          )}
        </HStack>
        <Stack
          color="#4a5568"
          fontSize="sm"
          style={{ borderWidth: '0 0 1px 0', borderColor: 'black' }}
        >
          {cashMovement.info && (
            <Stack>
              <Text fontWeight={700}>OTRA INFORMACIÓN:</Text>
              <HStack>
                <Text>{cashMovement.info}</Text>
              </HStack>
            </Stack>
          )}
        </Stack>

        <Stack alignItems={'flex-end'} justifyContent={'flex-end'} pr={4} pt={4}>
          <Text fontSize="sm" fontWeight={600}>
            CAE: {cashMovement.cae}
          </Text>
          <Text fontSize="sm" fontWeight={600}>
            VTO. CAE: {formatDate(cashMovement.vtoCae)}
          </Text>
        </Stack>
        {
          cashMovement.cbteTipo === 1 || cashMovement.cbteTipo === 51 && (
            <>
              <Text fontSize="sm" textAlign="center">
                El crédito fiscal discriminado en el presente comprobante solo podrá ser computado
              </Text>
              <Text fontSize="sm" pb={4} textAlign="center">
                a efectos del Procedimiento permanente de transición al Régimen General.
              </Text>
            </>
          )
        }
      </Flex>
    </Flex>
  );
};
