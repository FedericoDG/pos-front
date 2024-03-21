/* eslint-disable prettier/prettier */
import { HStack, Stack, Table, TableContainer, Tbody, Td, Text, Th, Tr } from '@chakra-ui/react';
import { Fragment } from 'react';

import { CashMovement, Settings } from '../../interfaces';
import { formatCurrency, formatDate, getInvoiceLetter, getInvoiceName } from '../../utils';

interface Props {
  printRef: any;
  settings: Settings;
  cashMovement: CashMovement;
  newSubTotal: number;
  newDiscount: () => number;
  newRecharge: () => number;
}

export const TicketB = ({ printRef,
  settings,
  cashMovement,
  newSubTotal,
  newDiscount,
  newRecharge }: Props) => {

  return (
    <Stack ref={printRef} padding="2.5mm" width="80mm">
      <Text align="center" backgroundColor='white'>{settings.name}</Text>
      <HStack justifyContent="center" px={2} py={2} w="full">
        <Text
          border="solid black"
          borderWidth={1}
          fontSize="48px"
          lineHeight={1}
          textAlign="center"
          w="16mm"
        >

          {getInvoiceLetter(cashMovement?.cbteTipo!)}
        </Text>
      </HStack>
      <HStack alignItems={'flex-start'} w={'full'}>
        <Stack paddingTop={1} w="50%">
          <Text fontSize={'small'} textAlign="center">
            {settings.ivaCondition}
          </Text>
          <Text fontSize={'small'} textAlign="center">
            {settings.address}
          </Text>
          <Text fontSize={'small'} textAlign="center">
            {settings.cp} - {settings.province}
          </Text>
        </Stack>
        <Stack w="50%">
          <Text fontSize="md" fontWeight={500}>
            {getInvoiceName(cashMovement?.cbteTipo!)}
          </Text>
          <Text fontSize="small" fontWeight={400}>
            N°: {cashMovement.posNumber.toString().padStart(5, '0')}-
            {cashMovement?.invoceNumberAfip!.toString().padStart(8, '0')}
          </Text>
          <Text fontSize="small">Fecha: {formatDate(cashMovement.createdAt)}</Text>
          <Text fontSize="small">CUIT: {settings.cuit}</Text>
          <Text fontSize="small">Inicio de Actividades: {settings.start}</Text>
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
        <Text fontSize="small">Señores: {cashMovement.client?.name}</Text>
        <Text fontSize="small">Domicilio: {cashMovement.client?.address}</Text>
        <Text fontSize="small">
          {cashMovement.client?.identification?.description}: {cashMovement.client?.document}
        </Text>
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
                        <Th isNumeric className="padding0">
                          <Text fontSize={'x-small'}>Cant.</Text>
                        </Th>
                        <Th>
                          <Text fontSize={'x-small'}>Descripción</Text>
                        </Th>
                        <Th isNumeric className="paddingX0">
                          <Text fontSize={'x-small'}>Total</Text>
                        </Th>
                      </Tr>
                    </>
                  )}
                  <Tr>
                    <Td isNumeric className="padding0">
                      <Text fontSize={'x-small'}>{movement.quantity}</Text>
                    </Td>
                    <Td>
                      <Text fontSize={'x-small'}>{`P. unit.: ${formatCurrency(
                        movement.price
                      )}`}</Text>
                      {movement.totalDiscount > 0 && (
                        <Text fontSize={'x-small'}>{`Desc.: ${formatCurrency(
                          movement.totalDiscount * -1
                        )}`}</Text>
                      )}
                      <Text className="cut-text" fontSize={'x-small'}>
                        {movement.product?.name}
                      </Text>
                    </Td>
                    <Td isNumeric className="paddingX0">
                      <Text fontSize={'x-small'}>
                        {formatCurrency(
                          movement.quantity * movement.price * (1 + movement.tax) -
                          movement.totalDiscount
                        )}
                      </Text>
                    </Td>
                  </Tr>
                </Fragment>
              );
            })}
            {
              <Tr>
                <Td borderWidth={0} colSpan={2} fontSize={14} fontWeight={500} textAlign="right">
                  <Text>Subtotal: </Text>
                </Td>
                <Td isNumeric borderWidth={0} fontSize={14} fontWeight={500} paddingX={0}>
                  <Text>{formatCurrency(newSubTotal)}</Text>
                </Td>
              </Tr>
            }
            {cashMovement.discount > 0 && (
              <Tr>
                <Td borderWidth={0} colSpan={2} fontSize={14} fontWeight={500} textAlign="right">
                  Descuento:
                </Td>
                <Td isNumeric borderWidth={0} fontSize={14} fontWeight={500} paddingX={0}>
                  {formatCurrency(newDiscount())}
                </Td>
              </Tr>
            )}
            {cashMovement.recharge > 0 && (
              <Tr>
                <Td borderWidth={0} colSpan={2} fontSize={14} fontWeight={500} textAlign="right">
                  Recargo:
                </Td>
                <Td isNumeric borderWidth={0} fontSize={14} fontWeight={500} paddingX={0}>
                  {formatCurrency(newRecharge())}
                </Td>
              </Tr>
            )}
            {cashMovement.otherTributes > 0 &&
              cashMovement.otherTributesDetails?.map((tribute) => (
                <Tr key={tribute.id}>
                  <Td borderWidth={0} colSpan={2} textAlign="right">
                    {tribute.otherTribute?.description}
                  </Td>
                  <Td isNumeric borderWidth={0} paddingX={0}>
                    {formatCurrency(tribute.amount)}
                  </Td>
                </Tr>
              ))}
            <Tr>
              <Td borderWidth={0} colSpan={2} fontSize={14} fontWeight={500} textAlign="right">
                TOTAL:
              </Td>
              <Td isNumeric borderWidth={0} fontSize={14} fontWeight={700} paddingX={0}>
                {formatCurrency(cashMovement.total)}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <div style={{ flex: 1 }} />
      <HStack alignItems="flex-start" color="#4a5568" fontSize="sm" w="full">
        <Stack w={'full'}>
          <Text fontSize={'xs'} fontWeight={700}>
            FORMA DE PAGO:
          </Text>
          {cashMovement.paymentMethodDetails?.map((payment) => (
            <HStack key={payment.id} justifyContent={'space-between'} w="full">
              <Text fontSize={'xs'}>{payment.paymentMethod.code}</Text>
              <Text fontSize={'xs'}>{formatCurrency(payment.amount)}</Text>
            </HStack>
          ))}
        </Stack>
      </HStack>
      <Stack color="#4a5568" style={{ borderWidth: '0 0 1px 0', borderColor: 'black' }}>
        {cashMovement.info && (
          <Stack>
            <Text fontSize={'xs'} fontWeight={700}>
              OTRA INFORMACIÓN:
            </Text>
            <HStack>
              <Text fontSize={'xs'}>{cashMovement.info}</Text>
            </HStack>
          </Stack>
        )}
      </Stack>
      <Stack alignItems={'flex-end'} justifyContent={'flex-end'}>
        <Text fontSize="xs" fontWeight={500}>
          CAE: {cashMovement.cae}
        </Text>
        <Text fontSize="xs" fontWeight={500}>
          VTO. CAE: {formatDate(cashMovement.vtoCae)}
        </Text>
      </Stack>
    </Stack>
  );
};
