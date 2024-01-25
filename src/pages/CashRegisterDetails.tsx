/* eslint-disable prettier/prettier */
import { useNavigate, useParams } from 'react-router-dom';
import {
  Badge,
  Flex,
  FormControl,
  FormLabel,
  HStack,
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
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { toast } from 'sonner';
import { useQueryClient } from 'react-query';

import { DashBoard, Loading } from '../componets/common';
import { formatCurrency, formatDate, formatDateAndHour } from '../utils';
import { useCashRegister, useCreateAfipInvoce } from '../hooks';
import { useMyContext } from '../context';
import { formatTwoDigits } from '../utils/formatCurrency';
import { CashMovement } from '../interfaces';

interface Algo {
  id: number | undefined;
  open: boolean;
}

export const CashRegisterDetails = () => {
  const { user } = useMyContext();
  const [algo, setAlgo] = useState<Algo[]>([]);
  const [enabledFilter, setEnabledFilter] = useState(true);
  const [enabledFilter2, setEnabledFilter2] = useState(true);
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
  const queryClient = useQueryClient();

  const invoces = useMemo(() => cashRegister?.cashMovements?.filter(el => el.invoceTypeId === 1 || el.invoceTypeId === 2 || el.invoceTypeId === 4), [cashRegister?.cashMovements]);
  const creditNotes = useMemo(() => cashRegister?.cashMovements?.filter(el => el.invoceTypeId === 5 || el.invoceTypeId === 6 || el.invoceTypeId === 7 || el.invoceTypeId === 8), [cashRegister?.cashMovements]);


  const onSuccessAfip = (res: any) => {
    queryClient.invalidateQueries({ queryKey: ['cashRegisters'] });
    toast('Comprobante de AFIP Creado', {
      action: {
        label: 'Ver',
        onClick: () => navigate(`/panel/caja/detalles/venta/afip/${res.body.cashMovement.id}`)
      },
    });
  };

  const onErrorAfip = (error: any) => {
    toast.error(error.response.data.body.message);
  };

  const { mutateAsync: createAfipInvoce } = useCreateAfipInvoce(onSuccessAfip, onErrorAfip);

  const fiscalizar = (movement: CashMovement) => {
    const cart = movement.cashMovementsDetails?.map(el => ({ productId: el.productId, price: el.price, quantity: el.quantity, tax: el.tax }));
    const otherTributes = movement.otherTributesDetails?.map(el => ({ amount: el.amount, id: el.id, otherTributeId: el.otherTributeId })) || [];
    const payments = movement.paymentMethodDetails?.map(el => ({ amount: el.amount, paymentMethodId: el.paymentMethodId }));
    const sale = {
      cart: cart!,
      clientId: movement.clientId,
      discount: movement.discount,
      discountPercent: movement.discountPercent,
      info: movement.info,
      invoceTypeId: movement.invoceTypeId,
      iva: movement.iva,
      otherTributes,
      payments: payments!,
      recharge: movement.recharge,
      rechargePercent: movement.rechargePercent,
      warehouseId: movement.warehouseId,
      cashMovementId: movement.id!,
      movementIds: []
    };

    createAfipInvoce(sale);
  };

  /*   const otherDiscounts = useMemo(() => {
      if (cashRegister?.cashMovements && cashRegister.cashMovements.length > 0) {
  
        const aux = cashRegister?.cashMovements?.map(el => el.cashMovementsDetails?.reduce((acc, el) => acc + el.totalDiscount * (1 + el.tax), 0));
  
        return aux?.reduce((acc, el) => acc! + el!, 0);
      }
  
      return 0;
    }, [cashRegister?.cashMovements]); */

  const newDiscount = (cashMovement: any) => {
    const originalDiscount =
      cashMovement.cashMovementsDetails?.reduce(
        (acc: any, el: any) => acc + (el.price * el.quantity - el.totalDiscount) * (1 + el.tax),
        0
      ) || 0;


    return (Math.max(cashMovement.discount + originalDiscount - cashMovement.subtotal, 0));
  };

  const newRecharge = (cashMovement: any) => {
    const originalRecharge =
      cashMovement.cashMovementsDetails?.reduce(
        (acc: any, el: any) => acc + (el.price * el.quantity - el.totalDiscount) * (1 + el.tax),
        0
      ) || 0;

    return (Math.max(cashMovement.recharge - originalRecharge + cashMovement.subtotal, 0));
  };

  const newTotalDiscount = () => {
    if (isIndeterminate) return;
    let acc = 0;

    for (const coso of cashRegister?.cashMovements!) {
      const fede = coso?.cashMovementsDetails?.reduce((acc, el) => acc + el.totalDiscount * (1 + el.tax), 0) || 0;


      acc += newDiscount(coso) + fede;
    }


    return acc;
  };

  const newTotalRecharge = () => {
    if (isIndeterminate) return;
    let acc = 0;

    for (const coso of cashRegister?.cashMovements!) {
      acc += newRecharge(coso);
    }


    return acc;
  };

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
              <HStack justifyContent="flex-start">
                <FormControl alignItems="center" display="flex" minW="250px" >
                  <Switch
                    id="filter"
                    isChecked={enabledFilter2}
                    onChange={(e) => setEnabledFilter2(e.target.checked)}
                  />
                  <FormLabel htmlFor="filter" mb="0" ml="2">
                    Ver Productos Agrupados
                  </FormLabel>
                </FormControl>
                <FormControl alignItems="center" display="flex">
                  <Switch
                    id="filter"
                    isChecked={enabledFilter}
                    onChange={(e) => setEnabledFilter(e.target.checked)}
                  />
                  <FormLabel htmlFor="filter" mb="0" ml="2">
                    Desplegar detalles
                  </FormLabel>
                </FormControl>
              </HStack>
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
            <Stack ref={printRef} py="8" w="1024px">
              <Stack >
                <TableContainer w="full">
                  <Table size="sm">
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
                          Ventas
                        </Th>
                        <Th isNumeric bg="gray.700" color="white">
                          Notas de Crédito
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
                        <Td >{formatDate(cashRegister.openingDate)}</Td>
                        <Td>
                          {cashRegister.closingDate ? formatDate(cashRegister.closingDate) : ''}
                        </Td>
                        <Td isNumeric color="#4a5568" fontWeight="semibold">
                          {formatCurrency(cashRegister.initialBalance)}
                        </Td>
                        <Td isNumeric color="#4a5568" fontWeight="semibold">
                          {formatCurrency(cashRegister.sales)}
                        </Td>
                        <Td isNumeric color="#4a5568" fontWeight="semibold">
                          {formatCurrency(cashRegister.creditNotes)}
                        </Td>
                        <Td isNumeric color="#4a5568" fontWeight="semibold">
                          {formatCurrency(cashRegister.otherTributes)}
                        </Td>
                        <Td isNumeric color="#4a5568" fontSize={16} fontWeight="bold">
                          {formatCurrency(cashRegister.initialBalance + cashRegister.sales + cashRegister.otherTributes - cashRegister.creditNotes)}
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>

                <HStack alignItems="flex-start">
                  <TableContainer w="full">
                    <Table size="sm" >
                      <Thead>
                        <Tr>
                          <Th bg="gray.700" color="white">Forma de Pago</Th>
                          <Th isNumeric bg="gray.700" color="white">Efectivo</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td color="#4a5568" fontWeight="semibold">
                            Efectivo
                          </Td>
                          <Td isNumeric color="#4a5568" fontWeight="semibold">
                            {formatCurrency(cashRegister.cash)}
                          </Td>
                        </Tr>
                        <Tr>
                          <Td color="#4a5568" fontWeight="semibold">
                            Débito
                          </Td>
                          <Td isNumeric color="#4a5568" fontWeight="semibold">
                            {formatCurrency(cashRegister.debit)}
                          </Td>
                        </Tr>
                        <Tr>
                          <Td color="#4a5568" fontWeight="semibold">
                            Crédito
                          </Td>
                          <Td isNumeric color="#4a5568" fontWeight="semibold">
                            {formatCurrency(cashRegister.credit)}
                          </Td>
                        </Tr>
                        <Tr>
                          <Td color="#4a5568" fontWeight="semibold">
                            Transferencia
                          </Td>
                          <Td isNumeric color="#4a5568" fontWeight="semibold">
                            {formatCurrency(cashRegister.transfer)}
                          </Td>
                        </Tr>
                        <Tr>
                          <Td color="#4a5568" fontWeight="semibold">
                            Mercado Pago
                          </Td>
                          <Td isNumeric color="#4a5568" fontWeight="semibold">
                            {formatCurrency(cashRegister.mercadoPago)}
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                  <TableContainer w="full">
                    <Table size="sm" w="full">
                      <Thead>
                        <Tr>
                          <Th isNumeric bg="gray.700" color="white">Descuentos</Th>
                          <Th isNumeric bg="gray.700" color="white">Recargos</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td isNumeric color="#4a5568" fontWeight="semibold">
                            {formatCurrency(newTotalDiscount()!)}
                          </Td>
                          <Td isNumeric color="#4a5568" fontWeight="semibold">
                            {formatCurrency(newTotalRecharge()!)}
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                </HStack>

                {
                  enabledFilter2 && invoces && invoces.length > 0 &&
                  <>
                    <Text mt={4} textAlign="left">
                      Productos
                    </Text>
                    <HStack alignItems="flex-start">
                      <TableContainer w="full">
                        <Table size="sm" >
                          <Thead>
                            <Tr>
                              <Th bg="gray.700" color="white">Nombre</Th>
                              <Th isNumeric bg="gray.700" color="white">Cantidad</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {
                              cashRegister.uniques?.map((el, idx) => {
                                if (idx % 2 === 0) {
                                  return (
                                    <Tr key={nanoid()}>
                                      <Td color="#4a5568" fontWeight="semibold">
                                        {el.product?.name}
                                      </Td>
                                      <Td isNumeric color="#4a5568" fontWeight="semibold">
                                        {el.quantity} {el.product?.unit?.code}
                                      </Td>
                                    </Tr>
                                  );
                                } else { }
                              })
                            }
                          </Tbody>
                        </Table>
                      </TableContainer>
                      <TableContainer w="full">
                        <Table size="sm" >
                          <Thead>
                            <Tr>
                              <Th bg="gray.700" color="white">Nombre</Th>
                              <Th isNumeric bg="gray.700" color="white">Cantidad</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {
                              cashRegister.uniques?.map((el, idx) => {
                                if (idx % 2 !== 0) {
                                  return (
                                    <Tr key={nanoid()}>
                                      <Td color="#4a5568" fontWeight="semibold">
                                        {el.product?.name}
                                      </Td>
                                      <Td isNumeric color="#4a5568" fontWeight="semibold">
                                        {el.quantity} {el.product?.unit?.code}
                                      </Td>
                                    </Tr>
                                  );
                                } else { }
                              })
                            }
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </HStack>
                  </>
                }

                <Stack>
                  {invoces && invoces.length > 0 &&
                    <TableContainer mt="4" w="full">
                      <Table size="sm">
                        <Text as={'caption'} textAlign="left">
                          Ventas
                        </Text>
                        <Thead>
                          <Tr>
                            <Th bg="gray.700" color="white" w="215px" >Tipo</Th>
                            <Th bg="gray.700" color="white" w="250px">
                              Fecha
                            </Th>
                            <Th isNumeric bg="gray.700" color="white" w="181px">
                              Subtotal
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
                          {invoces.map((movement) => (
                            <React.Fragment key={nanoid()}>
                              <Tr
                                bg='gray.50'
                                cursor="pointer"
                                onClick={() => handleClick(movement.id!)}
                              >
                                <Td>
                                  {
                                    movement.invoceTypeId === 4 &&
                                    <Badge>Comprobante X</Badge>
                                  }
                                  {
                                    movement.invoceTypeId === 1 && movement.cae &&
                                    <Badge colorScheme='green'>Factura A</Badge>
                                  }
                                  {
                                    movement.invoceTypeId === 1 && !movement.cae &&
                                    <Badge colorScheme='red'>Factura A</Badge>
                                  }
                                  {
                                    movement.invoceTypeId === 2 && movement.cae &&
                                    <Badge colorScheme='green'>Factura B</Badge>
                                  }
                                  {
                                    movement.invoceTypeId === 2 && !movement.cae &&
                                    <Badge colorScheme='red'>Factura B</Badge>
                                  }
                                  {
                                    movement.invoceTypeId === 3 && movement.cae &&
                                    <Badge colorScheme='green'>Factura M</Badge>
                                  }
                                  {
                                    movement.invoceTypeId === 3 && movement.cae &&
                                    <Badge colorScheme='red'>Factura M</Badge>
                                  }
                                </Td>
                                <Td>{formatDateAndHour(movement.createdAt)}</Td>
                                <Td isNumeric>{formatCurrency(movement.subtotal - movement.discount + movement.recharge)}</Td>
                                <Td isNumeric>{formatCurrency(movement.otherTributes)}</Td>
                                <Td isNumeric>{formatCurrency(movement.total)}</Td>
                              </Tr>

                              {algo.find((el) => el.id === movement.id)?.open && (
                                <>
                                  <Tr className='no-print'>
                                    <Td borderWidth={0} textAlign='right'>
                                      <Button colorScheme='brand' size='sm' onClick={() => navigate(`/panel/caja/detalles/venta/${movement.id}`)}>Ver Comprobante Interno</Button>
                                    </Td>
                                    {
                                      movement.iva &&
                                      <Td borderWidth={0} textAlign='right'>
                                        <Button colorScheme='brand' display="block" m="0 auto" size='sm' onClick={() => navigate(`/panel/caja/detalles/venta/afip/${movement.id}`)}>Ver Comprobante AFIP</Button>
                                      </Td>
                                    }
                                    {
                                      movement.invoceTypeId !== 5 && movement.invoceTypeId !== 6 && movement.invoceTypeId !== 7 && !movement.creditNote &&
                                      <Td borderWidth={0} textAlign='right'>
                                        <Button colorScheme='orange' size='sm' onClick={() => navigate(`/panel/caja/detalles/nota-credito/${movement.id}`)}>Crear Nota de Crédito</Button>
                                      </Td>
                                    }
                                    {
                                      movement.invoceTypeId !== 5 && movement.invoceTypeId !== 6 && movement.invoceTypeId !== 7 && movement.invoceTypeId !== 7 && movement.invoceTypeId !== 8 && movement.iva && movement.creditNote &&
                                      <Td borderWidth={0} textAlign='right'>
                                        <Button colorScheme='brand' display="block" m="0 auto" size='sm' onClick={() => navigate(`/panel/caja/detalles/venta/afip/${movement.creditNote}`)}>Ver Nota de Crédito</Button>
                                      </Td>
                                    }
                                    {
                                      movement.invoceTypeId !== 5 && movement.invoceTypeId !== 6 && movement.invoceTypeId !== 7 && movement.invoceTypeId !== 7 && movement.invoceTypeId !== 8 && !movement.iva && movement.creditNote &&
                                      <Td borderWidth={0} textAlign='right'>
                                        <Button colorScheme='brand' display="block" m="0 auto" size='sm' onClick={() => navigate(`/panel/caja/detalles/venta/${movement.creditNote}`)}>Ver Nota de Crédito</Button>
                                      </Td>
                                    }
                                    {
                                      movement.iva && !movement.cae &&
                                      <Td borderWidth={0} textAlign='right'>
                                        <Button colorScheme='red' size='sm' onClick={() => fiscalizar(movement)}>Fiscalizar Factura</Button>
                                      </Td>
                                    }
                                  </Tr>
                                  <Tr>
                                    <Td border="none" colSpan={5} px="0">
                                      <TableContainer w="843px" >
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
                                                {movement.client?.email}
                                              </Td>
                                            </Tr>
                                          </Tbody>
                                        </Table>
                                      </TableContainer>
                                    </Td>
                                  </Tr>

                                  <Tr>
                                    <Td border="none" colSpan={5} px="0">
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
                                    <Td border="none" colSpan={5} px="0">
                                      <TableContainer w="843px">
                                        <Table size="sm">
                                          <Thead>
                                            <Tr>
                                              <Th
                                                borderBottomWidth="1"
                                                borderColor="black"
                                                borderStyle="solid"
                                                colSpan={8}
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
                                                    {formatCurrency(detail.price * (1 + detail.tax))}
                                                  </Td>

                                                  <Td isNumeric border="none" w="121px">
                                                    {formatCurrency(detail.price * (1 + detail.tax) * detail.quantity)}
                                                  </Td>
                                                  {
                                                    detail.totalDiscount > 0 &&
                                                    <Td isNumeric border="none" color="red.600" w="121px">
                                                      {formatCurrency(detail.totalDiscount * -1 * (1 + detail.tax))}
                                                    </Td>
                                                  }
                                                  {
                                                    movement.iva && movement.invoceTypeId == 1 &&
                                                    (

                                                      <Td isNumeric border="none" color="blue" w="121px">
                                                        {formatCurrency((detail.price * detail.quantity - detail.totalDiscount) * (detail.product?.ivaCondition?.tax!) * (1 - movement.discountPercent / 100 + movement.rechargePercent / 100))}
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
                                                          {formatCurrency((detail.price * detail.quantity - detail.totalDiscount) * (1 + detail.product?.ivaCondition?.tax!))}
                                                        </Td>
                                                      ) :
                                                      (
                                                        <Td isNumeric border="none" w="121px">
                                                          {formatCurrency(detail.price * detail.quantity - detail.totalDiscount)}
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
                                      <Td border="none" colSpan={5} px="0">
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
                                                  Descuento sobre el total
                                                </Th>
                                              </Tr>
                                            </Thead>
                                            <Tbody>
                                              <Tr >
                                                <Td border="none" w="150px">
                                                  {formatCurrency(newDiscount(movement))}
                                                </Td>
                                                <Td border="none" w="693px">
                                                  {Math.round(movement.discountPercent * 100) / 100}%
                                                  {/*   {Math.round(movement.discountPercent * 100) / 100}% */}
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
                                      <Td border="none" colSpan={5} px="0">
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
                                                  Recargo sobre el total
                                                </Th>
                                              </Tr>
                                            </Thead>
                                            <Tbody>
                                              <Tr >
                                                <Td border="none" w="150px">
                                                  {formatCurrency(newRecharge(movement))}
                                                </Td>
                                                <Td border="none" w="693px">
                                                  {Math.round(movement.rechargePercent * 100) / 100}%
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
                                      <Td border="none" colSpan={5} px="0">
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
                      </Table>
                    </TableContainer>
                  }
                  {creditNotes && creditNotes.length > 0 &&
                    <TableContainer m="0" w="full">
                      <Table size="sm">
                        <Text as={'caption'} textAlign="left">
                          Notas de Crédito
                        </Text>
                        <Thead>
                          <Tr>
                            <Th bg="gray.700" color="white" w="215px" >Tipo</Th>
                            <Th bg="gray.700" color="white" w="250px">
                              Fecha
                            </Th>
                            <Th isNumeric bg="gray.700" color="white">
                              Total
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {creditNotes.map((movement) => (
                            <React.Fragment key={nanoid()}>
                              <Tr
                                bg='gray.50'
                                cursor="pointer"
                                onClick={() => handleClick(movement.id!)}
                              >
                                <Td>
                                  {
                                    movement.invoceTypeId === 5 &&
                                    <Badge bg='gray.50'>Nota de Crédito A</Badge>
                                  }
                                  {
                                    movement.invoceTypeId === 6 &&
                                    <Badge bg='gray.50'>Nota de Crédito B</Badge>
                                  }
                                  {
                                    movement.invoceTypeId === 7 &&
                                    <Badge bg='gray.50'>Nota de Crédito M</Badge>
                                  }
                                  {
                                    movement.invoceTypeId === 8 &&
                                    <Badge bg='gray.50'>Nota de Crédito X</Badge>
                                  }
                                </Td>
                                <Td>{formatDateAndHour(movement.createdAt)}</Td>
                                <Td isNumeric>{formatCurrency(movement.total)}</Td>
                              </Tr>
                              {algo.find((el) => el.id === movement.id)?.open && (
                                <>
                                  <Tr className='no-print'>
                                    <Td borderWidth={0} textAlign='right'>
                                      <Button colorScheme='brand' size='sm' onClick={() => navigate(`/panel/caja/detalles/venta/${movement.id}`)}>Ver Comprobante Interno</Button>
                                    </Td>
                                    {
                                      movement.cae && (
                                        <>
                                          <Td borderWidth={0} textAlign='right'>
                                            <Button colorScheme='brand' display="block" m="0 auto" size='sm' onClick={() => navigate(`/panel/caja/detalles/venta/afip/${movement.id}`)}>Ver Comprobante AFIP</Button>
                                          </Td>
                                        </>
                                      )
                                    }
                                  </Tr>
                                  <Tr>
                                    <Td border="none" colSpan={5} px="0">
                                      <TableContainer w="843px" >
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
                                                {movement.client?.email}
                                              </Td>
                                            </Tr>
                                          </Tbody>
                                        </Table>
                                      </TableContainer>
                                    </Td>
                                  </Tr>

                                  <Tr>
                                    <Td border="none" colSpan={5} px="0">
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
                                    <Td border="none" colSpan={5} px="0">
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
                                      <Td border="none" colSpan={5} px="0">
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
                                                <Td border="none" w="693px">
                                                  {Math.round(movement.discountPercent * 100) / 100}%
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
                                      <Td border="none" colSpan={5} px="0">
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
                                                <Td border="none" w="693px">
                                                  {Math.round(movement.rechargePercent * 100) / 100}%
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
                                      <Td border="none" colSpan={5} px="0">
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
                      </Table>
                    </TableContainer>
                  }
                </Stack>
              </Stack>
            </Stack>
          </Flex>
        </>
      )}
    </DashBoard>
  );
};
