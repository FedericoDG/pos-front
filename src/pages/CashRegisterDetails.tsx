/* eslint-disable prettier/prettier */
import { useNavigate, useParams } from 'react-router-dom';
import {
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Stack,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { ImPrinter } from 'react-icons/im';
import { nanoid } from 'nanoid';
import { Text, Button } from '@chakra-ui/react';
import { useReactToPrint } from 'react-to-print';
import React, { useEffect, useRef, useState } from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai';

import { DashBoard, Loading } from '../componets/common';
import { formatCurrency, formatDate, formatDateAndHour } from '../utils';
import { useCashRegister } from '../hooks';
import { useMyContext } from '../context';
import { formatTwoDigits } from '../utils/formatCurrency';

interface Algo {
  id: number | undefined;
  open: boolean;
}

export const CashRegisterDetails = () => {
  const { user } = useMyContext();
  const [algo, setAlgo] = useState<Algo[]>([]);
  const [enabledFilter, setEnabledFilter] = useState(true);
  const { id } = useParams();

  const printRef = useRef<any | null>(null);

  const { data: cashRegister, isFetching: isFetchingCashCashRegister } = useCashRegister(
    Number(id)
  );

  const isIndeterminate = isFetchingCashCashRegister;

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  useEffect(() => {
    if (!cashRegister?.cashMovements) return;

    const fede = cashRegister.cashMovements?.map((el) => ({ id: el.id, open: false }));

    setAlgo(fede);
  }, [cashRegister]);

  useEffect(() => {
    if (enabledFilter) {
      setAlgo((current) => {
        return current.map((item) => ({ ...item, open: true }));
      });
    } else {
      setAlgo((current) => {
        return current.map((item) => ({ ...item, open: false }));
      });
    }
  }, [enabledFilter]);

  useEffect(() => {
    if (!cashRegister) return;

    if (algo.every((item) => item.open === true)) {
      return setEnabledFilter(true);
    }

    if (algo.every((item) => item.open === false)) {
      return setEnabledFilter(false);
    }
  }, [algo, cashRegister]);

  const handleClick = (id: number) => {
    setAlgo((current) => {
      return current.map((item) => {
        if (item.id === id) {
          return { ...item, open: !item.open };
        }

        return item;
      });
    });
  };

  const navigate = useNavigate();

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Detalles de la Caja">
      {!cashRegister ? (
        <Loading />
      ) : (
        <>
          {user?.role?.name! !== 'DRIVER' && cashRegister.closingDate === null && cashRegister.user?.role?.name === "DRIVER" && (
            <Button
              colorScheme="brand"
              leftIcon={<AiOutlineClose />}
              mb={4}
              ml="auto"
              size="lg"
              onClick={() => navigate(`/panel/caja/detalles/${cashRegister.user?.id}/cerrar`)}
            >
              CERRAR CAJA
            </Button>
          )}
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
            <Stack direction="row" justifyContent="space-between" w="full">
              <FormControl alignItems="center" display="flex">
                <Switch
                  id="filter"
                  isChecked={enabledFilter}
                  onChange={(e) => setEnabledFilter(e.target.checked)}
                />
                <FormLabel htmlFor="filter" mb="0" ml="2">
                  Mostar detalles de todas la ventas
                </FormLabel>
              </FormControl>
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
            <Stack ref={printRef} minW="1024px" py="8">
              <Stack >
                <TableContainer w="full">
                  <Table size="sm">
                    <Text as={'caption'} textAlign="left">
                      Usuario
                    </Text>
                    <Thead>
                      <Tr>
                        <Th bg="gray.700" color="white">
                          Apellido
                        </Th>
                        <Th bg="gray.700" color="white">
                          Nombre
                        </Th>
                        <Th bg="gray.700" color="white">
                          Rol
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>{cashRegister.user?.lastname}</Td>
                        <Td>{cashRegister.user?.name}</Td>
                        {cashRegister.user?.role?.name! === 'USER' && <Td>USUARIO</Td>}
                        {cashRegister.user?.role?.name! === 'DRIVER' && <Td>CHOFER</Td>}
                        {cashRegister.user?.role?.name! === 'SELLER' && <Td>VENDEDOR</Td>}
                        {cashRegister.user?.role?.name! === 'ADMIN' && <Td>ADMINISTRADOR</Td>}
                        {cashRegister.user?.role?.name! === 'SUPERADMIN' && <Td>SUPER</Td>}
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>

                <TableContainer w="full">
                  <Table size="sm" w="full">
                    <Text as={'caption'} textAlign="left">
                      Caja
                    </Text>
                    <Thead>
                      <Tr>
                        <Th bg="gray.700" color="white">
                          Apertura
                        </Th>
                        <Th bg="gray.700" color="white">
                          Cierre
                        </Th>
                        <Th isNumeric bg="gray.700" color="white">
                          Saldo Inicial
                        </Th>
                        <Th isNumeric bg="gray.700" color="white">
                          Ventas Brutas
                        </Th>
                        <Th isNumeric bg="gray.700" color="white">
                          Descuentos
                        </Th>
                        <Th isNumeric bg="gray.700" color="white">
                          Recargos
                        </Th>
                        <Th isNumeric bg="gray.700" color="white">
                          Otros Impuestos
                        </Th>
                        <Th isNumeric bg="gray.700" color="white">
                          Total a Rendir
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td isNumeric>{formatDate(cashRegister.openingDate)}</Td>
                        <Td>
                          {cashRegister.closingDate ? formatDate(cashRegister.closingDate) : ''}
                        </Td>
                        <Td isNumeric color="#4a5568" fontWeight="semibold">
                          {formatCurrency(cashRegister.initialBalance)}
                        </Td>
                        <Td isNumeric color="#4a5568" fontWeight="semibold">
                          {formatCurrency(cashRegister.sales + cashRegister.discounts - cashRegister.recharges - cashRegister.otherTributes)}
                        </Td>
                        <Td isNumeric color="#4a5568" fontWeight="semibold">
                          {formatCurrency(cashRegister.discounts)}
                        </Td>
                        <Td isNumeric color="#4a5568" fontWeight="semibold">
                          {formatCurrency(cashRegister.recharges)}
                        </Td>
                        <Td isNumeric color="#4a5568" fontWeight="semibold">
                          {formatCurrency(cashRegister.otherTributes)}
                        </Td>
                        <Td isNumeric color="#4a5568" fontSize={16} fontWeight="bold">
                          {formatCurrency(cashRegister.finalBalance + cashRegister.initialBalance)}
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>

                <TableContainer w="full">
                  <Table size="sm" w="full">
                    <Text as={'caption'} textAlign="left">
                      Forma de Pago
                    </Text>
                    <Thead>
                      <Tr>
                        <Th isNumeric bg="gray.700" color="white">Efectivo</Th>
                        <Th isNumeric bg="gray.700" color="white">Débito</Th>
                        <Th isNumeric bg="gray.700" color="white">Crédito</Th>
                        <Th isNumeric bg="gray.700" color="white">Transferencia</Th>
                        <Th isNumeric bg="gray.700" color="white">Mercado Pago</Th>
                        <Th isNumeric bg="gray.700" color="white">Total</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td isNumeric color="#4a5568" fontWeight="semibold">
                          {formatCurrency(cashRegister.cash)}
                        </Td>
                        <Td isNumeric color="#4a5568" fontWeight="semibold">
                          {formatCurrency(cashRegister.debit)}
                        </Td>
                        <Td isNumeric color="#4a5568" fontWeight="semibold">
                          {formatCurrency(cashRegister.credit)}
                        </Td>
                        <Td isNumeric color="#4a5568" fontWeight="semibold">
                          {formatCurrency(cashRegister.transfer)}
                        </Td>
                        <Td isNumeric color="#4a5568" fontWeight="semibold">
                          {formatCurrency(cashRegister.mercadoPago)}
                        </Td>
                        <Td isNumeric color="#4a5568" fontWeight="semibold">
                          {formatCurrency(cashRegister.sales)}
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>

                <Stack>
                  <TableContainer m="0" w="full">
                    <Table size="sm">
                      <Text as={'caption'} textAlign="left">
                        Detalle de Ventas
                      </Text>
                      <Thead>
                        <Tr>
                          <Th bg="gray.700" className="no-print" color="white" w="50px" />
                          <Th bg="gray.700" color="white" w="250px">
                            Fecha
                          </Th>
                          <Th isNumeric bg="gray.700" color="white" w="181px">
                            Subtotal
                          </Th>
                          <Th isNumeric bg="gray.700" color="white" w="181px">
                            Descuentos
                          </Th>
                          <Th isNumeric bg="gray.700" color="white" w="181px">
                            Recargos
                          </Th>
                          <Th isNumeric bg="gray.700" color="white" w="181px">
                            Otros impuestos
                          </Th>
                          <Th isNumeric bg="gray.700" color="white" w="181px">
                            Total
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {cashRegister.cashMovements?.map((movement) => (
                          <React.Fragment key={nanoid()}>
                            <Tr
                              bg={algo.some((el) => el.open) ? 'gray.50' : 'white'}
                              cursor="pointer"
                              onClick={() => handleClick(movement.id!)}
                            >
                              <Td className="no-print">
                                <Icon
                                  as={MdKeyboardArrowRight}
                                  transform={
                                    algo.find((el) => el.id === movement.id)?.open
                                      ? 'rotate(90deg)'
                                      : ''
                                  }
                                />
                              </Td>
                              <Td>{formatDateAndHour(movement.createdAt)}</Td>
                              <Td isNumeric>{formatCurrency(movement.subtotal)}</Td>
                              <Td isNumeric>{formatCurrency(movement.discount)}</Td>
                              <Td isNumeric>{formatCurrency(movement.recharge)}</Td>
                              <Td isNumeric>{formatCurrency(movement.otherTributes)}</Td>
                              <Td isNumeric>{formatCurrency(movement.total)}</Td>
                            </Tr>

                            {algo.find((el) => el.id === movement.id)?.open && (
                              <>
                                <Tr className='no-print'>
                                  <Td borderWidth={0} colSpan={7} textAlign='right'>
                                    <Button size='sm' onClick={() => navigate(`/panel/caja/detalles/venta/${movement.id}`)}>Ver Comprobante</Button>
                                  </Td>
                                </Tr>
                                <Tr>
                                  <Td colSpan={5} px="0">
                                    <TableContainer w="843px">
                                      <Table size="sm">
                                        <Thead>
                                          <Tr>
                                            <Th
                                              borderBottomWidth="1"
                                              borderColor="black"
                                              borderStyle="solid"
                                              colSpan={4}
                                              color="black"
                                              w="843px"
                                            >
                                              Cliente
                                            </Th>
                                          </Tr>
                                        </Thead>
                                        <Tbody>
                                          <Tr key={nanoid()}>
                                            <Td border="none" w="150px">
                                              {movement.client?.document}
                                            </Td>
                                            <Td border="none" w="231px">
                                              {movement.client?.name}
                                            </Td>
                                            <Td border="none" w="231px">
                                              {movement.client?.lastname}
                                            </Td>
                                            <Td border="none" w="231px">
                                              {movement.client?.email}
                                            </Td>
                                          </Tr>
                                        </Tbody>
                                      </Table>
                                    </TableContainer>
                                  </Td>
                                </Tr>

                                <Tr>
                                  <Td colSpan={5} px="0">
                                    <TableContainer w="843px">
                                      <Table size="sm">
                                        <Thead>
                                          <Tr>
                                            <Th
                                              borderBottomWidth="1"
                                              borderColor="black"
                                              borderStyle="solid"
                                              colSpan={3}
                                              color="black"
                                              w="843px"
                                            >
                                              Depósito
                                            </Th>
                                          </Tr>
                                        </Thead>
                                        <Tbody>
                                          <Tr key={nanoid()}>
                                            <Td border="none" w="150px">
                                              {movement.warehouse?.code}
                                            </Td>
                                            <Td border="none" w="341px">
                                              {movement.warehouse?.description}
                                            </Td>
                                            <Td border="none" w="352px">
                                              {movement.warehouse?.address}
                                            </Td>
                                          </Tr>
                                        </Tbody>
                                      </Table>
                                    </TableContainer>
                                  </Td>
                                </Tr>

                                <Tr>
                                  <Td colSpan={5} px="0">
                                    <TableContainer w="843px">
                                      <Table size="sm">
                                        <Thead>
                                          <Tr>
                                            <Th
                                              borderBottomWidth="1"
                                              borderColor="black"
                                              borderStyle="solid"
                                              colSpan={7}
                                              color="black"
                                              w="843px"
                                            >
                                              Detalle
                                            </Th>
                                          </Tr>
                                        </Thead>
                                        <Tbody>
                                          {movement.cashMovementsDetails?.map((detail) => {
                                            return (
                                              <Tr key={nanoid()}>
                                                <Td border="none" w="150px">
                                                  {detail.quantity} {detail.product?.unit!.code}
                                                </Td>
                                                <Td border="none" w="341px">
                                                  {detail.product?.name}
                                                </Td>
                                                <Td border="none" w="131px">
                                                  {formatCurrency(detail.price)}
                                                </Td>

                                                <Td isNumeric border="none" w="121px">
                                                  {formatCurrency(detail.price * detail.quantity)}
                                                </Td>
                                                {
                                                  movement.iva &&
                                                  (

                                                    <Td isNumeric border="none" w="121px">
                                                      {formatCurrency(detail.price * detail.quantity * (detail.product?.ivaCondition?.tax!))}
                                                    </Td>
                                                  )
                                                }
                                                {
                                                  movement.iva ?
                                                    (
                                                      <Td border="none" fontSize={12} style={{ textAlign: 'right' }} w="100px">
                                                        {`${formatTwoDigits(detail.product?.ivaCondition?.tax! * 100)}%`}
                                                      </Td>

                                                    ) :
                                                    (
                                                      <Td border="none" fontSize={12} style={{ textAlign: 'right' }} w="100px">
                                                        {`${formatTwoDigits(0)}%`}
                                                      </Td>

                                                    )
                                                }
                                                {
                                                  movement.iva ?
                                                    (

                                                      <Td isNumeric border="none" w="121px">
                                                        {formatCurrency(detail.price * detail.quantity * (1 + detail.product?.ivaCondition?.tax!))}
                                                      </Td>
                                                    ) :
                                                    (
                                                      <Td isNumeric border="none" w="121px">
                                                        {formatCurrency(detail.price * detail.quantity)}
                                                      </Td>

                                                    )
                                                }
                                              </Tr>
                                            );
                                          })}
                                        </Tbody>
                                      </Table>
                                    </TableContainer>
                                  </Td>
                                </Tr>

                                {movement.discount > 0 && (
                                  <Tr>
                                    <Td colSpan={5} px="0">
                                      <TableContainer w="843px">
                                        <Table size="sm">
                                          <Thead>
                                            <Tr>
                                              <Th
                                                borderBottomWidth="1"
                                                borderColor="black"
                                                borderStyle="solid"
                                                colSpan={4}
                                                color="black"
                                                w="843px"
                                              >
                                                Descuentos
                                              </Th>
                                            </Tr>
                                          </Thead>
                                          <Tbody>
                                            <Tr >
                                              <Td border="none" w="150px">
                                                {formatCurrency(movement.discount)}
                                              </Td>
                                            </Tr>
                                          </Tbody>
                                        </Table>
                                      </TableContainer>
                                    </Td>
                                  </Tr>)
                                }

                                {movement.recharge > 0 && (
                                  <Tr>
                                    <Td colSpan={5} px="0">
                                      <TableContainer w="843px">
                                        <Table size="sm">
                                          <Thead>
                                            <Tr>
                                              <Th
                                                borderBottomWidth="1"
                                                borderColor="black"
                                                borderStyle="solid"
                                                colSpan={4}
                                                color="black"
                                                w="843px"
                                              >
                                                Recargos
                                              </Th>
                                            </Tr>
                                          </Thead>
                                          <Tbody>
                                            <Tr >
                                              <Td border="none" w="150px">
                                                {formatCurrency(movement.recharge)}
                                              </Td>
                                            </Tr>
                                          </Tbody>
                                        </Table>
                                      </TableContainer>
                                    </Td>
                                  </Tr>)
                                }
                                {
                                  movement.otherTributes > 0 &&

                                  <Tr>
                                    <Td colSpan={5} px="0">
                                      <TableContainer w="843px">
                                        <Table size="sm">
                                          <Thead>
                                            <Tr>
                                              <Th
                                                borderBottomWidth="1"
                                                borderColor="black"
                                                borderStyle="solid"
                                                colSpan={4}
                                                color="black"
                                                w="843px"
                                              >
                                                Otros Impuestos
                                              </Th>
                                            </Tr>
                                          </Thead>
                                          <Tbody>
                                            {movement.otherTributesDetails?.map((detail) => (
                                              <Tr key={nanoid()}>
                                                <Td border="none" w="150px">
                                                  {formatCurrency(detail.amount)}
                                                </Td>
                                                <Td border="none" w="693px">
                                                  {detail.otherTribute?.description}
                                                </Td>
                                              </Tr>
                                            ))}
                                          </Tbody>
                                        </Table>
                                      </TableContainer>
                                    </Td>
                                  </Tr>
                                }

                                <Tr>
                                  <Td colSpan={5} px="0">
                                    <TableContainer w="843px">
                                      <Table size="sm">
                                        <Thead>
                                          <Tr>
                                            <Th
                                              borderBottomWidth="1"
                                              borderColor="black"
                                              borderStyle="solid"
                                              colSpan={4}
                                              color="black"
                                              w="843px"
                                            >
                                              Forma de Pago
                                            </Th>
                                          </Tr>
                                        </Thead>
                                        <Tbody>
                                          {movement.paymentMethodDetails?.map((detail) => (
                                            <Tr key={nanoid()}>
                                              <Td border="none" w="150px">
                                                {formatCurrency(detail.amount)}
                                              </Td>
                                              <Td border="none" w="693px">
                                                {detail.paymentMethod.code}
                                              </Td>
                                            </Tr>
                                          ))}
                                        </Tbody>
                                      </Table>
                                    </TableContainer>
                                  </Td>
                                </Tr>

                                {movement.info !== '' && (
                                  <Tr>
                                    <Td colSpan={5} px="0">
                                      <TableContainer w="843px">
                                        <Table size="sm">
                                          <Thead>
                                            <Tr>
                                              <Th
                                                borderBottomWidth="1"
                                                borderColor="black"
                                                borderStyle="solid"
                                                colSpan={4}
                                                color="black"
                                                w="843px"
                                              >
                                                Información extra
                                              </Th>
                                            </Tr>
                                          </Thead>
                                          <Tbody>
                                            <Tr>
                                              <Td border="none" w="843px">
                                                {movement.info}
                                              </Td>
                                            </Tr>
                                          </Tbody>
                                        </Table>
                                      </TableContainer>
                                    </Td>
                                  </Tr>
                                )}
                              </>
                            )}
                          </React.Fragment>
                        ))}
                      </Tbody>
                      {/*  <Tfoot>
                        <Tr>
                          <Th isNumeric colSpan={3} fontSize={14} >
                            {formatCurrency(cashRegister.sales + cashRegister.discounts - cashRegister.recharges - cashRegister.otherTributes)}
                          </Th>
                          <Th isNumeric fontSize={14} >
                            {formatCurrency(cashRegister.discounts)}
                          </Th>
                          <Th isNumeric fontSize={14} >
                            {formatCurrency(cashRegister.recharges)}
                          </Th>
                          <Th isNumeric fontSize={14} >
                            {formatCurrency(cashRegister.otherTributes)}
                          </Th>
                          <Th isNumeric fontSize={16} >
                            {formatCurrency(cashRegister.sales)}
                          </Th>
                        </Tr>
                      </Tfoot> */}
                    </Table>
                  </TableContainer>
                </Stack>
              </Stack>
            </Stack>
          </Flex>
        </>
      )}
    </DashBoard>
  );
};
