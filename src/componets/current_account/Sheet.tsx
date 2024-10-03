/* eslint-disable prettier/prettier */
import {
  Badge,
  Button,
  Divider,
  Heading,
  HStack,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { ImPrinter } from 'react-icons/im';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';

import { useGetCurrentAccount, useGetPaymentMethods2 } from '../../hooks';
import { Loading } from '../common';
import { formatCurrency, formatDate } from '../../utils';

import { Modal, useCurrentAccountContext } from '.';

export const Sheet = () => {
  const { client, from, to, goToPrevious } = useCurrentAccountContext();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();

  const printRef = useRef<any | null>(null);

  const data2 = {
    clientId: client?.value!,
    from,
    to,
  };

  const { data, isFetching } = useGetCurrentAccount(data2);
  const { data: paymentMethods, isFetching: isFetching2 } = useGetPaymentMethods2();



  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handleClose = () => {
    onClose();
  };

  return (
    <Stack m="0 auto" py="8" w="1024px">
      <HStack justifyContent={'center'}>
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
        <Button
          alignSelf={'flex-end'}
          colorScheme="linkedin"
          leftIcon={<ImPrinter />}
          size="sm"
          onClick={handlePrint}
        >
          IMPRIMIR
        </Button>
      </HStack>

      {
        !data || !paymentMethods || isFetching || isFetching2 ? <Loading /> :
          <Stack ref={printRef}>
            <HStack justifyContent="space-between" w="full">
              <Heading fontWeight={500} size="md">
                Cuenta Corriente
              </Heading>
              <Text fontSize="md">{`${formatDate(from)} AL ${formatDate(to)}`}</Text>
            </HStack>
            <Divider />
            <TableContainer w="full">
              <Table size="sm">
                <caption>Cliente</caption>
                <Thead>
                  <Tr>
                    <Th bg="gray.700" color="white">
                      Razón Social
                    </Th>
                    <Th bg="gray.700" color="white">
                      CUIT
                    </Th>
                    <Th bg="gray.700" color="white">
                      Teléfono
                    </Th>
                    <Th bg="gray.700" color="white">
                      Celular
                    </Th>
                    <Th bg="gray.700" color="white">
                      Email
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>{data?.currentAccount.client.name}</Td>
                    <Td>{data?.currentAccount.client.document}</Td>
                    <Td>{data?.currentAccount.client.phone}</Td>
                    <Td>{data?.currentAccount.client.mobile}</Td>
                    <Td>{data?.currentAccount.client.email}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>

            <HStack alignItems={'center'} justify={'space-between'}>
              <TableContainer marginTop={4} w="50%">
                <Table size="md">
                  <caption>Balance Cuenta Corriente</caption>
                  <Thead>
                    <Tr>
                      <Th isNumeric bg="gray.700" color="white">
                        CARGOS
                      </Th>
                      <Th isNumeric bg="gray.700" color="white">
                        PAGOS
                      </Th>
                      <Th isNumeric bg="gray.700" color="white">
                        TOTAL
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td isNumeric>{formatCurrency(data?.charges)}</Td>
                      <Td isNumeric>{formatCurrency(data?.payments)}</Td>
                      <Td isNumeric>{formatCurrency(data?.total)}</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
              <Button className="no-print" colorScheme="brand" isDisabled={data.total === 0} size={'lg'} variant={'solid'} onClick={onOpen}>
                CARGAR UN PAGO
              </Button>
            </HStack>

            <TableContainer w="full">
              <Table size="sm">
                <caption>Movimientos</caption>
                <Thead>
                  <Tr>
                    <Th bg="gray.700" color="white">
                      Fecha
                    </Th>
                    <Th isNumeric bg="gray.700" color="white">
                      MONTO
                    </Th>
                    <Th isNumeric bg="gray.700" color="white">
                      MONTO PREVIO
                    </Th>
                    <Th bg="gray.700" color="white">
                      TIPO
                    </Th>
                    <Th bg="gray.700" color="white">
                      MÉTODO DE PAGO
                    </Th>
                    <Th bg="gray.700" color="white">
                      COMPROBANTE
                    </Th>
                    <Th bg="gray.700" color="white">
                      DETALLES
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.currentAccountDetails.map((el) => (
                    <Tr key={nanoid()}>
                      <Td>{formatDate(el.createdAt)}</Td>
                      <Td isNumeric color={el.type === 'PAYMENT' ? 'green.500' : 'red.500'}>
                        {`${el.type === 'PAYMENT'
                          ? formatCurrency(el.amount)
                          : formatCurrency(el.amount * -1)
                          }`}
                      </Td>
                      <Td isNumeric>{formatCurrency(el.prevAmount === 0 ? el.prevAmount : el.prevAmount * -1)}</Td>
                      <Td>{`${el.type === 'PAYMENT' ? 'Pago' : 'Cargo'}`}</Td>
                      <Td>{el.type === 'PAYMENT' ? el.paymentMethod?.code : ''}</Td>
                      {
                        el.type === 'PAYMENT' &&
                        <Td>
                          <Badge cursor={'pointer'} onClick={() => navigate(`/panel/cuenta-corriente/recibo/${el.id}`)}>Ver Comprobante de Pago</Badge>
                        </Td>
                      }
                      {
                        el.type === 'CHARGE' && el.cashMovement?.invoceTypeId === 4 &&
                        <Td>
                          <Badge cursor={'pointer'} onClick={() => navigate(`/panel/caja/detalles/venta/${el.cashMovement?.id}`)}>Ver Comprobante X</Badge>
                        </Td>
                      }
                      {
                        el.type === 'CHARGE' && el.cashMovement?.invoceTypeId === 1 &&
                        <Td>
                          <Badge cursor={'pointer'} onClick={() => navigate(`/panel/caja/detalles/venta/afip/${el.cashMovement?.id}`)}>Ver Factura A</Badge>
                        </Td>
                      }
                      {
                        el.type === 'CHARGE' && el.cashMovement?.invoceTypeId === 2 &&
                        <Td>
                          <Badge cursor={'pointer'} onClick={() => navigate(`/panel/caja/detalles/venta/afip/${el.cashMovement?.id}`)}>Ver Factura B</Badge>
                        </Td>
                      }
                      {
                        el.type === 'CHARGE' && el.cashMovement?.invoceTypeId === 29 &&
                        <Td>
                          <Badge cursor={'pointer'} onClick={() => navigate(`/panel/caja/detalles/venta/afip/${el.cashMovement?.id}`)}>Ver Factura C</Badge>
                        </Td>
                      }
                      <Td>{el.details}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Modal currentAccountId={data.currentAccount.id!} handleClose={handleClose} isOpen={isOpen} max={data.total * -1} paymentMetods={paymentMethods} />
          </Stack>
      }
      <pre>{JSON.stringify(data?.currentAccountDetails, null, 2)}</pre>
    </Stack >
  );
};
