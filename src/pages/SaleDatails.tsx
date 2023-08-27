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
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { ImPrinter } from 'react-icons/im';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

import { DashBoard, Loading } from '../componets/common';
import { useGetCashMovement } from '../hooks';
import { formatCurrency, formatDate } from '../utils';

export const SaleDetails = () => {
  const { id } = useParams();

  const printRef = useRef<any | null>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const { data: cashMovement, isLoading: isLoadingCashMovement } = useGetCashMovement(Number(id!));

  return (
    <DashBoard isIndeterminate={isLoadingCashMovement} title="Detalles de la Caja">
      {!cashMovement ? (
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
                <img src="http://via.placeholder.com/120x120" />
                <Stack>
                  <Text fontWeight={500}>Delivery Hero Stores SA</Text>
                  <Text>25 de Mayo 1370</Text>
                  <Text>5009 - Córdoba</Text>
                  <Text>Responsable Inscripto</Text>
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
                <Text fontSize="xl" fontWeight={500}>
                  Comprobante
                </Text>
                <Text fontSize="xl" fontWeight={500}>
                  N°: {'1'.padStart(3, '0')}-{'1'.padStart(6, '0')}
                </Text>
                <Text>Fecha: {formatDate(cashMovement.createdAt)}</Text>
                <Text>CUIT: 20-29127368-9</Text>
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
                  {cashMovement.client?.identification?.description}:{' '}
                  {cashMovement.client?.document}
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
                  <TableCaption>Este comprobante no tiene validez fiscal</TableCaption>
                  <Thead>
                    <Tr>
                      <Th isNumeric w="135px">
                        Cantidad
                      </Th>
                      <Th>Descripción</Th>
                      <Th isNumeric>Precio unitatio</Th>
                      <Th isNumeric>IVA</Th>
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
                          <Td isNumeric>
                            {formatCurrency(movement.quantity * movement.price * movement.tax)}
                          </Td>
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
                        colSpan={4}
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
                    {cashMovement.discount > 0 && (
                      <Tr>
                        <Td borderWidth={0} colSpan={4} textAlign="right">
                          Descuento:
                        </Td>
                        <Td isNumeric borderWidth={0}>
                          {formatCurrency(cashMovement.discount * -1)}
                        </Td>
                      </Tr>
                    )}
                    {cashMovement.recharge > 0 && (
                      <Tr>
                        <Td borderWidth={0} colSpan={4} textAlign="right">
                          Recargo:
                        </Td>
                        <Td isNumeric borderWidth={0}>
                          {formatCurrency(cashMovement.recharge)}
                        </Td>
                      </Tr>
                    )}
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
                        textAlign="right"
                      >
                        TOTAL:
                      </Td>
                      <Td isNumeric borderWidth={0} fontSize={18} fontWeight={700}>
                        {formatCurrency(cashMovement.total)}
                      </Td>
                    </Tr>
                  </Tbody>
                  <Tfoot>
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
                  </Tfoot>
                </Table>
              </TableContainer>
            </HStack>
          </Stack>
          {/*  <pre>{JSON.stringify(cashMovement, null, 2)}</pre> */}
        </Flex>
      )}
    </DashBoard>
  );
};
