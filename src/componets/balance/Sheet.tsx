/* eslint-disable prettier/prettier */
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Link,
  Stack,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import * as XLSX from 'xlsx';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { ImPrinter } from 'react-icons/im';
import { BsDownload } from 'react-icons/bs';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';

import { useGetBalance } from '../../hooks';
import { Loading } from '../common';
import { formatCurrency, formatDate, getInvoiceLetter, getInvoceLetterById } from '../../utils';
import { getRole } from '../../utils/getRole';

import { SelectedInvoice, useBalanceContext } from '.';

export const Sheet = () => {
  const { user, client, from, to, goToPrevious, invoices } = useBalanceContext();

  const [enabledUserFilter, setEnabledUserFilter] = useState(false);
  const [enabledClientFilter, setEnabledClientFilter] = useState(false);

  const printRef = useRef<any | null>(null);
  const printRef2 = useRef<any | null>(null);
  const movementDetailsTable = useRef<any | null>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handlePrint2 = useReactToPrint({
    content: () => printRef2.current,
  });

  const getInvoiceList = (list: SelectedInvoice[]) =>
    list.map((el) => getInvoceLetterById(el.value!)).join(', ');

  const data = {
    userId: user?.value!,
    clientId: client?.value!,
    invoices: JSON.stringify(invoices.map((el) => el.value)),
    from,
    to,
  };


  const { data: balance, isFetching, isSuccess } = useGetBalance(data);

  const handleDownload = () => {
    const libro = XLSX.utils.book_new();
    const hoja = XLSX.utils.json_to_sheet([]);

    const tabla2: any[] = [];


    balance?.movements.forEach((el) => {
      tabla2.push({
        Fecha: formatDate(el.createdAt),
        Concepto: el.concept,
        Comprobante: el.cashMovement?.cae
          ? `${getInvoiceLetter(el.cashMovement?.cbteTipo!)} ${el.cashMovement?.posNumber
            ?.toString()
            .padStart(3, '0')}-${el.cashMovement?.invoceNumberAfip?.toString().padStart(8, '0')}`
          : `${getInvoiceLetter(el.cashMovement?.cbteTipo!)} ${el.cashMovement?.posNumber
            ?.toString()
            .padStart(3, '0')}-${el.cashMovement?.id?.toString().padStart(8, '0')}`,
        Cliente: el.client?.name,
        Usuario: `${el.user?.name} ${el.user?.lastname}`,
        Monto: el.concept === 'Venta' ? el.cashMovement!.total : el.cashMovement!.total * -1,
      });
    });


    XLSX.utils.sheet_add_json(hoja, tabla2);

    XLSX.utils.book_append_sheet(libro, hoja, 'Detalles de Movimientos');

    setTimeout(() => {
      XLSX.writeFile(libro, `ingresos_${from}_${to}.xlsx`);
    }, 500);
  };

  if (isSuccess) toast('Ingresos recuperados');

  return (
    <Stack w="full">
      {isFetching || !balance ? (
        <Loading />
      ) : (
        <>
          <HStack>
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
          </HStack>
          <Stack m="0 auto" mt={8}>
            <HStack alignItems="flex-start" justifyContent="space-between" w="full">
              <Stack>
                <FormControl alignItems="center" display="flex">
                  <Switch
                    id="filter"
                    isChecked={enabledUserFilter}
                    onChange={(e) => setEnabledUserFilter(e.target.checked)}
                  />
                  <FormLabel htmlFor="filter" mb="0" ml="2">
                    Ver tabla de Vendedores/Choferes
                  </FormLabel>
                </FormControl>
                <FormControl alignItems="center" display="flex">
                  <Switch
                    id="filter"
                    isChecked={enabledClientFilter}
                    onChange={(e) => setEnabledClientFilter(e.target.checked)}
                  />
                  <FormLabel htmlFor="filter" mb="0" ml="2">
                    Ver tabla de Clientes
                  </FormLabel>
                </FormControl>
              </Stack>
              <Stack>
                <HStack justifyContent="flex-end">
                  <Button
                    colorScheme="linkedin"
                    leftIcon={<ImPrinter />}
                    size="sm"
                    onClick={handlePrint}
                  >
                    IMPRIMIR
                  </Button>
                </HStack>
              </Stack>
            </HStack>

            <Stack ref={printRef} my={8} w="210mm">
              <Stack alignItems="flex-start">
                <Heading fontWeight={500} size="md" textAlign="center" w="full">
                  INFORME DE INGRESOS
                </Heading>
                <HStack justifyContent="space-between" w="full">
                  <Text fontSize="lg">{`COMPROBANTES: ${getInvoiceList(invoices)}`}</Text>
                  <Text fontSize="lg">{`${formatDate(balance?.from)} AL ${formatDate(
                    balance?.to
                  )}`}</Text>
                </HStack>
                <Divider />
              </Stack>
              {
                balance?.movements.length > 0 ?
                  <>
                    <HStack alignItems="flex-end">
                      <TableContainer my={4} w="66.66%">
                        <Table size="sm">
                          <Thead>
                            <Tr>
                              <Th bg="gray.700" color="white">
                                Medio de Pago
                              </Th>
                              <Th isNumeric bg="gray.700" color="white">
                                TOTAL
                              </Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            <Tr>
                              <Td>Efectivo</Td>
                              <Td isNumeric>{formatCurrency(balance?.incomes.totalCash!)}</Td>
                            </Tr>
                            <Tr>
                              <Td>Débito</Td>
                              <Td isNumeric>{formatCurrency(balance?.incomes.totalDebit!)}</Td>
                            </Tr>
                            <Tr>
                              <Td>Crédito</Td>
                              <Td isNumeric>{formatCurrency(balance?.incomes.totalCredit!)}</Td>
                            </Tr>
                            <Tr>
                              <Td>Transferencia</Td>
                              <Td isNumeric>{formatCurrency(balance?.incomes.totalTransfer!)}</Td>
                            </Tr>
                            <Tr>
                              <Td borderColor="black">Mercado Pago</Td>
                              <Td isNumeric borderColor="black">
                                {formatCurrency(balance?.incomes.totalMercadoPago!)}
                              </Td>
                            </Tr>
                          </Tbody>
                          <Tfoot>
                            <Tr>
                              <Th />
                              <Th isNumeric fontSize={16}>
                                {formatCurrency(balance?.incomes.totalIncomes!)}
                              </Th>
                            </Tr>
                          </Tfoot>
                        </Table>
                      </TableContainer>
                    </HStack>
                    <HStack alignItems="flex-start">
                      <TableContainer my={2} w="full">
                        <Table size="sm" w="full">
                          <Thead>
                            <Tr>
                              <Th bg="gray.700" color="white">
                                Remito
                              </Th>
                              <Th isNumeric bg="gray.700" color="white">
                                TOTAL
                              </Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            <Tr>
                              <Td fontSize={16}>Monto</Td>
                              <Td isNumeric fontSize={16}>
                                {formatCurrency(balance?.invoices.invoiceNoAFIPTotal!)}
                              </Td>
                            </Tr>
                            <Tr>
                              <Td fontSize={16}>Cantidad</Td>
                              <Td isNumeric fontSize={16}>
                                {balance?.invoices.invoiceNoAFIPCount!}
                              </Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </TableContainer>

                      <TableContainer my={2} w="full">
                        <Table size="sm">
                          <Thead>
                            <Tr>
                              <Th bg="gray.700" color="white">
                                AFIP
                              </Th>
                              <Th isNumeric bg="gray.700" color="white">
                                TOTAL
                              </Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            <Tr>
                              <Td fontSize={16}>Monto</Td>
                              <Td isNumeric fontSize={16}>
                                {formatCurrency(balance?.invoices.invoiceAFIPTotal!)}
                              </Td>
                            </Tr>
                            <Tr>
                              <Td fontSize={16}>Cantidad</Td>
                              <Td isNumeric fontSize={16}>
                                {balance?.invoices.invoiceAFIPCount!}
                              </Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </TableContainer>

                      <TableContainer my={2} w="full">
                        <Table size="sm">
                          <Thead>
                            <Tr>
                              <Th bg="gray.700" color="white">
                                Comprobantes
                              </Th>
                              <Th isNumeric bg="gray.700" color="white">
                                TOTAL
                              </Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {
                              balance?.invoices.invoiceATotal! > 0 &&
                              <Tr>
                                <Td>Factura A</Td>
                                <Td isNumeric>{formatCurrency(balance?.invoices.invoiceATotal!)}</Td>
                              </Tr>
                            }
                            {
                              balance?.invoices.invoiceMTotal! > 0 &&
                              <Tr>
                                <Td>Factura M</Td>
                                <Td isNumeric>{formatCurrency(balance?.invoices.invoiceMTotal!)}</Td>
                              </Tr>
                            }
                            {
                              balance?.invoices.invoiceBTotal! > 0 &&
                              <Tr>
                                <Td>Factura B</Td>
                                <Td isNumeric>{formatCurrency(balance?.invoices.invoiceBTotal!)}</Td>
                              </Tr>
                            }
                            {
                              balance?.invoices.invoiceXTotal! > 0 &&
                              <Tr>
                                <Td>Comprobante X</Td>
                                <Td isNumeric>{formatCurrency(balance?.invoices.invoiceXTotal!)}</Td>
                              </Tr>
                            }
                            {
                              balance?.invoices.invoiceNCATotal! > 0 &&
                              <Tr>
                                <Td>N. de Crédito A</Td>
                                <Td isNumeric>{formatCurrency(balance?.invoices.invoiceNCATotal!)}</Td>
                              </Tr>
                            }
                            {
                              balance?.invoices.invoiceNCMTotal! > 0 &&
                              <Tr>
                                <Td>N. de Crédito M</Td>
                                <Td isNumeric>{formatCurrency(balance?.invoices.invoiceNCMTotal!)}</Td>
                              </Tr>
                            }
                            {
                              balance?.invoices.invoiceNCBTotal! > 0 &&
                              <Tr>
                                <Td>N. de Crédito B</Td>
                                <Td isNumeric>{formatCurrency(balance?.invoices.invoiceNCBTotal!)}</Td>
                              </Tr>
                            }
                            {
                              balance?.invoices.invoiceNCXTotal! > 0 &&
                              <Tr>
                                <Td>N. de Crédito X</Td>
                                <Td isNumeric>{formatCurrency(balance?.invoices.invoiceNCXTotal!)}</Td>
                              </Tr>
                            }
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </HStack>
                    {enabledUserFilter && (
                      <TableContainer my={2} w="full">
                        <Table size="sm">
                          <Thead>
                            <Tr>
                              <Th bg="gray.700" color="white">
                                Vendedor/Chofer
                              </Th>
                              <Th bg="gray.700" color="white">
                                Email
                              </Th>
                              <Th bg="gray.700" color="white">
                                Rol
                              </Th>
                              <Th isNumeric bg="gray.700" color="white">
                                Total
                              </Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {balance?.users.map((el) => (
                              <Tr key={nanoid()}>
                                <Td>
                                  {el.name} {el.lastname}
                                </Td>
                                <Td>{el.email}</Td>
                                <Td>{getRole(el.role?.name!)}</Td>
                                <Td isNumeric>{formatCurrency(el.total)}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    )}
                    {enabledClientFilter && (
                      <TableContainer my={2} w="full">
                        <Table size="sm">
                          <Thead>
                            <Tr>
                              <Th bg="gray.700" color="white">
                                Cliente
                              </Th>
                              <Th bg="gray.700" color="white">
                                Tipo
                              </Th>
                              <Th bg="gray.700" color="white">
                                Número
                              </Th>
                              <Th isNumeric bg="gray.700" color="white">
                                Total
                              </Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {balance?.clients.map((el) => (
                              <Tr key={nanoid()}>
                                <Td>{el.name}</Td>
                                <Td>{el.identification?.description}</Td>
                                <Td>{el.document}</Td>
                                <Td isNumeric>{formatCurrency(el.total)}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    )}
                    <HStack className="no-print" justifyContent="flex-end" mt={8}>
                      <Button
                        colorScheme="green"
                        leftIcon={<BsDownload />}
                        size="sm"
                        onClick={handleDownload}
                      >
                        DESCARGAR EXCEL
                      </Button>
                      <Button
                        colorScheme="linkedin"
                        leftIcon={<ImPrinter />}
                        size="sm"
                        onClick={handlePrint2}
                      >
                        IMPRIMIR
                      </Button>
                    </HStack>
                    <Stack ref={printRef2}>
                      <Text textAlign="center" w="full">DETALLE DE MOVIMIENTOS</Text>
                      <TableContainer my={2} w="full">
                        <Table ref={movementDetailsTable} className="lastCellPB" size="sm">
                          <Thead>
                            <Tr>
                              <Th bg="gray.700" color="white" fontSize={14}>
                                Fecha
                              </Th>
                              <Th bg="gray.700" color="white" fontSize={14}>
                                Concepto
                              </Th>
                              <Th bg="gray.700" color="white" fontSize={14} textAlign="center">
                                Comprobante
                              </Th>
                              <Th bg="gray.700" color="white" fontSize={14}>
                                Cliente
                              </Th>
                              <Th bg="gray.700" color="white" fontSize={14}>
                                Usuario
                              </Th>
                              <Th isNumeric bg="gray.700" color="white" fontSize={14}>
                                Total
                              </Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {balance?.movements.map((el) => (
                              <Tr key={nanoid()}>
                                <Td fontSize={14}>{formatDate(el.createdAt)}</Td>
                                <Td color={el.concept === 'Venta' ? 'black' : 'red.600'} fontSize={14}>
                                  {el.concept}
                                </Td>
                                {el.concept === 'Venta' || el.concept === 'N. de Crédito' ? (
                                  el.cashMovement?.cae ? (
                                    <Td fontSize={14} textAlign="center">
                                      <Link
                                        color="black"
                                        fontSize={14}
                                        fontWeight={400}
                                        href={`/panel/caja/detalles/venta/afip/${el.cashMovement?.id}`}
                                        target="_blank"
                                        variant="link"
                                        w="full"
                                      >
                                        {getInvoiceLetter(el.cashMovement?.cbteTipo!)}{' '}
                                        {el.cashMovement?.posNumber?.toString().padStart(3, '0')}
                                        {'-'}
                                        {el.cashMovement?.invoceNumberAfip?.toString().padStart(8, '0')}
                                      </Link>
                                    </Td>
                                  ) : (
                                    <Td fontSize={14} textAlign="center">
                                      <Link
                                        color="black"
                                        fontSize={14}
                                        fontWeight={400}
                                        href={`/panel/caja/detalles/venta/${el.cashMovement?.id}`}
                                        target="_blank"
                                        variant="link"
                                        w="full"
                                      >
                                        {getInvoiceLetter(el.cashMovement?.cbteTipo!)}{' '}
                                        {el.cashMovement?.posNumber?.toString().padStart(3, '0')}
                                        {'-'}
                                        {el.cashMovement?.id?.toString().padStart(8, '0')}
                                      </Link>
                                    </Td>
                                  )
                                ) : (
                                  <Td fontSize={14} textAlign="center">
                                    {' '}
                                  </Td>
                                )}
                                <Td fontSize={14}>
                                  {el.client?.name}
                                </Td>
                                <Td fontSize={14}>
                                  {el.user?.name} {el.user?.lastname}
                                </Td>
                                {el.concept === 'Venta' ? (
                                  <Td isNumeric fontSize={14}>
                                    {formatCurrency(el.cashMovement!.total)}
                                  </Td>
                                ) : (
                                  <Td isNumeric color="red.600" fontSize={14}>
                                    {formatCurrency(el.amount * -1)}
                                  </Td>
                                )}
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </Stack>
                  </>
                  :
                  <Text fontSize={'xl'} mt={8} textAlign={'center'} textColor={'gray.900'} w="full">
                    NO EXISTEN DATOS PARA LAS FECHA, USUARIO, CLIENTE Y COMPROBANTES SELECCIONADOS
                  </Text>
              }
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );
};
