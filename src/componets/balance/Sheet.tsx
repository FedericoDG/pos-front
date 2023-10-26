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

import { useGetBalance } from '../../hooks';
import { Loading } from '../common';
import { formatCurrency, formatDate, getInvoiceLetter, getInvoceLetterById } from '../../utils';
import { getRole } from '../../utils/getRole';

import { SelectedInvoice, useBalanceContext } from '.';

export const Sheet = () => {
  const { user, client, from, to, goToPrevious, invoices } = useBalanceContext();

  const printRef = useRef<any | null>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const data = {
    userId: user?.value!,
    clientId: client?.value!,
    invoices: JSON.stringify(invoices.map((el) => el.value)),
    from,
    to,
  };

  const getType = (type: string) => {
    if (type === 'IN') return 'Ingreso';

    return 'Egreso';
  };

  const { data: balance, isFetching } = useGetBalance(data);

  const handleDownload = () => {
    const libro = XLSX.utils.book_new();

    // Hoja 1
    const hoja = XLSX.utils.json_to_sheet([]);

    XLSX.utils.sheet_add_json(hoja, [
      {
        INGRESOS: balance?.incomes.totalIncomes,
        EGRESOS: balance?.outcomes.totalOutcomes,
        TOTAL: balance?.incomes.totalIncomes! - balance?.outcomes.totalOutcomes!,
      },
    ]);

    XLSX.utils.sheet_add_json(hoja, [{ a: 'Detalles de Ingresos' }], {
      origin: 5,
      skipHeader: true,
    });

    XLSX.utils.sheet_add_json(
      hoja,
      [
        {
          efectivo: balance?.incomes.totalCash,
          débito: balance?.incomes.totalDebit,
          crédito: balance?.incomes.totalCredit,
          transferencia: balance?.incomes.totalTransfer,
          mercado_pago: balance?.incomes.totalMercadoPago,
        },
      ],
      { origin: 3 }
    );

    // Hoja 2
    const tabla2 =
      balance?.movements.map((el) => ({
        fecha: formatDate(el.createdAt),
        monto: el.amount,
        tipo: getType(el.type),
        forma_de_pago: `${el.paymentMethod?.code!}`,
        concepto: el.concept,
        usuario: `${el.user?.name} ${el.user?.lastname}`,
      })) || [];

    const hoja2 = XLSX.utils.json_to_sheet(tabla2);

    // Agregar Hojas
    XLSX.utils.book_append_sheet(libro, hoja, 'Balance');
    XLSX.utils.book_append_sheet(libro, hoja2, 'Detalles de Movimientos');

    setTimeout(() => {
      XLSX.writeFile(libro, `balance_${from}_${to}.xlsx`);
    }, 500);
  };

  const getInvoiceList = (list: SelectedInvoice[]) =>
    list.map((el) => getInvoceLetterById(el.value!)).join(', ');

  const [enabledUserFilter, setEnabledUserFilter] = useState(false);
  const [enabledClientFilter, setEnabledClientFilter] = useState(false);

  return (
    <Stack w="full">
      {isFetching ? (
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
          <Stack m="0 auto">
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
                    colorScheme="green"
                    leftIcon={<BsDownload />}
                    size="sm"
                    onClick={handleDownload}
                  >
                    Descargar Excel
                  </Button>
                  <Button
                    colorScheme="linkedin"
                    leftIcon={<ImPrinter />}
                    size="sm"
                    onClick={handlePrint}
                  >
                    Imprimir
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
                  <Text fontSize="lg">{`${formatDate(balance?.from)} AL ${formatDate(
                    balance?.to
                  )}`}</Text>
                  <Text fontSize="lg">{`COMPROBANTES: ${getInvoiceList(invoices)}`}</Text>
                </HStack>
                <Divider />
              </Stack>
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
                          Presupuesto
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
                          {formatCurrency(balance?.invoices.invoiceXTotal!)}
                        </Td>
                      </Tr>
                      <Tr>
                        <Td fontSize={16}>Cantidad</Td>
                        <Td isNumeric fontSize={16}>
                          {balance?.invoices.invoiceXCount!}
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
                      <Tr>
                        <Td>Factura A</Td>
                        <Td isNumeric>{formatCurrency(balance?.invoices.invoiceATotal!)}</Td>
                      </Tr>
                      <Tr>
                        <Td>Factura M</Td>
                        <Td isNumeric>{formatCurrency(balance?.invoices.invoiceMTotal!)}</Td>
                      </Tr>
                      <Tr>
                        <Td>Factura B</Td>
                        <Td isNumeric>{formatCurrency(balance?.invoices.invoiceBTotal!)}</Td>
                      </Tr>
                      <Tr>
                        <Td>N. de Crédito A</Td>
                        <Td isNumeric>{formatCurrency(balance?.invoices.invoiceNCATotal!)}</Td>
                      </Tr>
                      <Tr>
                        <Td>N. de Crédito M</Td>
                        <Td isNumeric>{formatCurrency(balance?.invoices.invoiceNCMTotal!)}</Td>
                      </Tr>
                      <Tr>
                        <Td>N. de Crédito B</Td>
                        <Td isNumeric>{formatCurrency(balance?.invoices.invoiceNCBTotal!)}</Td>
                      </Tr>
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
              <TableContainer my={2} w="full">
                <Table className="lastCellPB" size="sm">
                  <Text as="caption" fontSize="sm">
                    DETALLE DE MOVIMIENTOS
                  </Text>
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
                          {el.user?.name} {el.user?.lastname}
                        </Td>
                        {el.concept === 'Venta' ? (
                          <Td isNumeric fontSize={14}>
                            {formatCurrency(el.amount)}
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
              {/* <pre>{JSON.stringify(balance, null, 2)}</pre> */}
              SH
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );
};
