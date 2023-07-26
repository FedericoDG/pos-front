import { useParams } from 'react-router-dom';
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
  Tfoot,
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

import { DashBoard, Loading } from '../componets/common';
import { formatCurrency, formatDate, formatDateAndHour } from '../utils';
import { useCashRegister } from '../hooks';

interface Algo {
  id: number | undefined;
  open: boolean;
}

export const CashRegisterDetails = () => {
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

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Detalles de la Caja">
      {!cashRegister ? (
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
            <Stack>
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
                      <Th isNumeric bg="gray.700" color="white" fontSize={12}>
                        Saldo Inicial
                      </Th>
                      <Th isNumeric bg="gray.700" color="white" fontSize={12}>
                        Efectivo
                      </Th>
                      <Th isNumeric bg="gray.700" color="white" fontSize={12}>
                        Débito
                      </Th>
                      <Th isNumeric bg="gray.700" color="white" fontSize={12}>
                        Crédito
                      </Th>
                      <Th isNumeric bg="gray.700" color="white" fontSize={12}>
                        Transferencia
                      </Th>
                      <Th isNumeric bg="gray.700" color="white" fontSize={12}>
                        MercadoPago
                      </Th>
                      <Th isNumeric bg="gray.700" color="white">
                        Total a Rendir
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>{formatDate(cashRegister.openingDate)}</Td>
                      <Td>
                        {cashRegister.closingDate ? formatDate(cashRegister.closingDate) : ''}
                      </Td>
                      <Td isNumeric color="#4a5568" fontSize={12} fontWeight="semibold">
                        {formatCurrency(cashRegister.initialBalance)}
                      </Td>
                      <Td isNumeric color="#4a5568" fontSize={12} fontWeight="semibold">
                        {formatCurrency(cashRegister.cash)}
                      </Td>
                      <Td isNumeric color="#4a5568" fontSize={12} fontWeight="semibold">
                        {formatCurrency(cashRegister.debit)}
                      </Td>
                      <Td isNumeric color="#4a5568" fontSize={12} fontWeight="semibold">
                        {formatCurrency(cashRegister.credit)}
                      </Td>
                      <Td isNumeric color="#4a5568" fontSize={12} fontWeight="semibold">
                        {formatCurrency(cashRegister.transfer)}
                      </Td>
                      <Td isNumeric color="#4a5568" fontSize={12} fontWeight="semibold">
                        {formatCurrency(cashRegister.mercadoPago)}
                      </Td>
                      <Td isNumeric color="#4a5568" fontSize={16} fontWeight="bold">
                        {formatCurrency(cashRegister.initialBalance + cashRegister.finalBalance)}
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>

              <Stack>
                <TableContainer m="0" w="full">
                  <Table size="sm">
                    <Text as={'caption'} textAlign="left">
                      Ventas
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
                            <Td isNumeric>{formatCurrency(movement.total)}</Td>
                          </Tr>

                          {algo.find((el) => el.id === movement.id)?.open && (
                            <>
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
                                            colSpan={4}
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
                                          <Td border="none" w="231px">
                                            {movement.warehouse?.description}
                                          </Td>
                                          <Td border="none" w="462px">
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
                                            colSpan={4}
                                            color="black"
                                            w="843px"
                                          >
                                            Detalle
                                          </Th>
                                        </Tr>
                                      </Thead>
                                      <Tbody>
                                        {movement.cashMovementsDetails?.map((detail) => (
                                          <Tr key={nanoid()}>
                                            <Td border="none" w="150px">
                                              {detail.quantity} {detail.product?.unit!.code}
                                            </Td>
                                            <Td border="none" w="231px">
                                              {formatCurrency(detail.price)}
                                            </Td>
                                            <Td border="none" w="341px">
                                              {detail.product?.name}
                                            </Td>
                                            <Td isNumeric border="none" w="121px">
                                              {formatCurrency(detail.price * detail.quantity)}
                                            </Td>
                                          </Tr>
                                        ))}
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
                    <Tfoot>
                      <Tr>
                        <Th isNumeric colSpan={6} fontSize={16} p="2">
                          {formatCurrency(cashRegister.finalBalance)}
                        </Th>
                      </Tr>
                    </Tfoot>
                  </Table>
                </TableContainer>
              </Stack>
            </Stack>
          </Stack>
        </Flex>
      )}
    </DashBoard>
  );
};
