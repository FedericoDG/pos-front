/* eslint-disable prettier/prettier */
import { Stack, HStack, TableContainer, Table, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';
import { Fragment } from 'react';

import { getInvoiceName, formatDate, formatCurrency } from '../../utils';
import { CashMovement, Settings } from '../../interfaces';

interface Props {
  printRef: any;
  settings: Settings;
  cashMovement: CashMovement;
  someDiscount: boolean | undefined;
}

export const FacturaX = ({ printRef, settings, cashMovement, someDiscount }: Props) => {
  return (
    <Stack ref={printRef} minH="267mm" w="210mm">
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
              X
            </Text>
          </HStack>
          <Stack pl={20} py={2} w="50%">
            {cashMovement.invoceTypeId == 5 ||
              cashMovement.invoceTypeId === 6 ||
              cashMovement.invoceTypeId === 7 ||
              cashMovement.invoceTypeId === 8 ? (
              <Text fontSize="xl" fontWeight={500}>
                {getInvoiceName(cashMovement?.cbteTipo!)}
              </Text>
            ) : (
              <Text fontSize="xl" fontWeight={500}>
                {settings.invoceName}
              </Text>
            )}
            <Text fontSize="xl" fontWeight={500}>
              N°: {cashMovement.posNumber.toString().padStart(5, '0')}-
              {cashMovement.invoceNumber.toString().padStart(8, '0')}
            </Text>
            <Text>Fecha: {formatDate(cashMovement.createdAt)}</Text>
            <Text>CUIT: {settings.cuit}</Text>
            <Text>Inicio de Actividades: {settings.start}</Text>
          </Stack>
        </HStack>

        <Stack
          alignItems="flex-start"
          borderBottomWidth={1}
          borderColor="black"
          borderTopWidth={1}
          justifyContent="space-between"
          pos="relative"
        >
          <Text>Señores: {cashMovement.client?.name}</Text>
          <Text>Domicilio: {cashMovement.client?.address}</Text>
          <Text>
            {cashMovement.client?.identification?.description}: {cashMovement.client?.document}
          </Text>
        </Stack>
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
                          Precio unitario
                        </Th>
                        {someDiscount && (
                          <Th isNumeric className="coso">
                            Descuento
                          </Th>
                        )}
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
                    {someDiscount && (
                      <Td isNumeric>{formatCurrency(movement.totalDiscount * -1)}</Td>
                    )}
                    <Td isNumeric>
                      {formatCurrency(
                        movement.quantity * movement.price * (1 + movement.tax) -
                        movement.totalDiscount
                      )}
                    </Td>
                  </Tr>
                </Fragment>
              );
            })}
            <Tr>
              <Td
                borderWidth={0}
                colSpan={someDiscount ? 4 : 3}
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
                <Td
                  borderWidth={0}
                  colSpan={someDiscount ? 4 : 3}
                  fontSize={16}
                  fontWeight={500}
                  textAlign="right"
                >
                  Descuento:
                </Td>
                <Td isNumeric borderWidth={0} fontSize={16} fontWeight={500}>
                  {formatCurrency(cashMovement.discount * -1)}
                </Td>
              </Tr>
            )}
            {cashMovement.recharge > 0 && (
              <Tr>
                <Td
                  borderWidth={0}
                  colSpan={someDiscount ? 4 : 3}
                  fontSize={16}
                  fontWeight={500}
                  textAlign="right"
                >
                  Recargo:
                </Td>
                <Td isNumeric borderWidth={0} fontSize={16} fontWeight={500}>
                  {formatCurrency(cashMovement.recharge)}
                </Td>
              </Tr>
            )}
            {cashMovement.otherTributes > 0 &&
              cashMovement.otherTributesDetails?.map((tribute) => (
                <Tr key={tribute.id}>
                  <Td borderWidth={0} colSpan={someDiscount ? 4 : 3} textAlign="right">
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
                colSpan={someDiscount ? 4 : 3}
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
        {/* {cashMovement.discount > 0 && (
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
      )} */}
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
    </Stack>
  );
};
