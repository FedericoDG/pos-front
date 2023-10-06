import { useParams } from 'react-router-dom';
import {
  Flex,
  Stack,
  Button,
  HStack,
  Text,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { ImPrinter } from 'react-icons/im';
import { useReactToPrint } from 'react-to-print';
import { useCallback, useRef } from 'react';

import { DashBoard, Loading } from '../componets/common';
import { useGetCashMovement, useGetSettings } from '../hooks';
import { formatCurrency, formatDate } from '../utils';
import { formatTwoDigits } from '../utils/formatCurrency';

export const SaleDetails = () => {
  const { id } = useParams();

  const printRef = useRef<any | null>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const { data: cashMovement, isLoading: isLoadingCashMovement } = useGetCashMovement(Number(id!));
  const { data: settings, isLoading: isLoadingSettings } = useGetSettings(1);

  const getInvoceName = useCallback((num: number) => {
    switch (num) {
      case 1:
        return 'FACTURA';
      case 3:
        return 'NOTA DE CRÉDITO';
      case 6:
        return 'FACTURA';
      case 8:
        return 'NOTA DE CRÉDITO';
      case 11:
        return 'FACTURA';
      case 13:
        return 'NOTA DE CRÉDITO';
      case 51:
        return 'FACTURA';
      case 53:
        return 'NOTA DE CRÉDITO';
      default:
        return 'FACTURA';
    }
  }, []);

  return (
    <DashBoard
      isIndeterminate={isLoadingCashMovement || isLoadingSettings}
      title="Comprobante Interno"
    >
      {!cashMovement || !settings ? (
        <Loading />
      ) : (
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
              mb="2"
              size="sm"
              onClick={handlePrint}
            >
              Imprimir
            </Button>
          </Stack>
          <Stack ref={printRef} border="1px solid black" w="209mm">
            <HStack
              alignItems="flex-start"
              as="header"
              justifyContent="space-between"
              pos="relative"
            >
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
                  X
                </Text>
              </HStack>
              <Stack pl={20} py={2} w="50%">
                {cashMovement.invoceTypeId == 5 ||
                  cashMovement.invoceTypeId === 6 ||
                  cashMovement.invoceTypeId === 7 ? (
                  <Text fontSize="xl" fontWeight={500}>
                    {getInvoceName(cashMovement?.cbteTipo!)}
                  </Text>
                ) : (
                  <Text fontSize="xl" fontWeight={500}>
                    {settings.invoceName}
                  </Text>
                )}
                <Text fontSize="xl" fontWeight={500}>
                  N°: {cashMovement.posNumber.toString().padStart(3, '0')}-
                  {cashMovement.invoceNumber.toString().padStart(6, '0')}
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
                  {cashMovement.client?.identification?.description}:{' '}
                  {cashMovement.client?.document}
                </Text>
              </Stack>
            </HStack>

            <Stack
              alignItems="flex-start"
              as="header"
              borderColor="black"
              borderTopWidth={1}
              justifyContent="space-between"
              pos="relative"
            >
              <TableContainer w="full">
                <Table size={'sm'} variant="simple">
                  <Thead>
                    <Tr>
                      <Th isNumeric w="135px">
                        Cantidad
                      </Th>
                      <Th>Descripción</Th>
                      <Th isNumeric>Precio unitatio</Th>
                      {/* <Th isNumeric>IVA</Th> */}
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
                          {/*  <Td isNumeric>
                            {formatCurrency(movement.quantity * movement.price * movement.tax)}
                          </Td> */}
                          <Td isNumeric>
                            {formatCurrency(
                              movement.quantity * movement.price * (1 + movement.tax)
                            )}
                          </Td>
                        </Tr>
                      );
                    })}
                    <Tr>
                      <Td
                        borderWidth={0}
                        colSpan={3}
                        fontSize={16}
                        fontWeight={500}
                        textAlign="right"
                      >
                        Subtotal:
                      </Td>
                      <Td isNumeric borderWidth={0} fontSize={16} fontWeight={500}>
                        {formatCurrency(cashMovement.subtotal)}
                      </Td>
                    </Tr>
                    {cashMovement.otherTributes > 0 &&
                      cashMovement.otherTributesDetails?.map((tribute) => (
                        <Tr key={tribute.id}>
                          <Td borderWidth={0} colSpan={3} textAlign="right">
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
                        colSpan={3}
                        fontSize={18}
                        fontWeight={700}
                        textAlign="right"
                      >
                        TOTAL:
                      </Td>
                      <Td isNumeric borderWidth={0} fontSize={18} fontWeight={700}>
                        {formatCurrency(cashMovement.total)}
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
              <TableContainer w="full">
                <Table size={'sm'} variant="simple">
                  <TableCaption>Este comprobante no tiene validez fiscal</TableCaption>
                  <Tbody>
                    {cashMovement.discount > 0 && (
                      <>
                        <Tr>
                          <Th borderWidth={0} width="180px">
                            Descuento:
                          </Th>
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
                          <Th borderWidth={0} width="180px">
                            Recargo:
                          </Th>
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
                      <Th borderWidth={0}>Forma de pago</Th>
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
                  </Tbody>
                </Table>
              </TableContainer>
            </Stack>
          </Stack>
        </Flex>
      )}
    </DashBoard>
  );
};
