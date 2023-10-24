import {
  Button,
  HStack,
  Link,
  Stack,
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
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { ImPrinter } from 'react-icons/im';
import { BsDownload } from 'react-icons/bs';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';

import { useGetAfip, useGetBalance } from '../../hooks';
import { Loading } from '../common';
import { formatCurrency, formatDate, getInvoiceLetter } from '../../utils';
import { getRole } from '../../utils/getRole';

import { useBalanceContext } from '.';

export const Sheet = () => {
  const { user, client, payment, from, to, goToPrevious } = useBalanceContext();
  const { data: afip, isFetching: isFetchingAfip } = useGetAfip();

  const printRef = useRef<any | null>(null);

  const navigate = useNavigate();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const data = {
    userId: user?.value!,
    clientId: client?.value!,
    paymentMethodId: payment?.value!,
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

  return (
    <Stack w="full">
      {isFetching || isFetchingAfip ? (
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
            <Stack ref={printRef} py="8">
              <TableContainer w="210mm">
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th bg="gray.700" color="white">
                        Desde
                      </Th>
                      <Th bg="gray.700" color="white">
                        Hasta
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>{formatDate(balance?.from)}</Td>
                      <Td>{formatDate(balance?.to)}</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>

              <HStack alignItems="flex-start">
                <TableContainer my={2} w="full">
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th bg="gray.700" color="white">
                          Ingresos
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
                        <Th isNumeric color="green.600" fontSize={16}>
                          {formatCurrency(balance?.incomes.totalIncomes!)}
                        </Th>
                      </Tr>
                    </Tfoot>
                  </Table>
                </TableContainer>

                <TableContainer my={2} w="full">
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th bg="gray.700" color="white">
                          Egresos
                        </Th>
                        <Th isNumeric bg="gray.700" color="white">
                          TOTAL
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>Compras</Td>
                        <Td isNumeric>{formatCurrency(balance?.outcomes.purchases!)}</Td>
                      </Tr>
                      <Tr>
                        <Td borderColor="black">Baja/Pérdida</Td>
                        <Td isNumeric borderColor="black">
                          {formatCurrency(balance?.outcomes.destroys!)}
                        </Td>
                      </Tr>
                    </Tbody>
                    <Tfoot>
                      <Tr>
                        <Th />
                        <Th isNumeric color="red.600" fontSize={16}>
                          {formatCurrency(balance?.outcomes.totalOutcomes!)}
                        </Th>
                      </Tr>
                    </Tfoot>
                  </Table>
                </TableContainer>
                <TableContainer mt={2} w="full">
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th bg="gray.700" color="white">
                          Balance
                        </Th>
                        <Th isNumeric bg="gray.700" color="white">
                          TOTAL
                        </Th>
                      </Tr>
                    </Thead>
                    <Tfoot>
                      <Tr>
                        <Th fontSize={14} />
                        <Th isNumeric fontSize={16}>
                          {formatCurrency(
                            balance?.incomes.totalIncomes! - balance?.outcomes.totalOutcomes!
                          )}
                        </Th>
                      </Tr>
                    </Tfoot>
                  </Table>
                </TableContainer>
              </HStack>

              <HStack alignItems="flex-start">
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
                          Facturas
                        </Th>
                        <Th isNumeric bg="gray.700" color="white">
                          TOTAL
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {afip?.invoiceM === 0 ? (
                        <>
                          <Tr>
                            <Td>
                              A <span style={{ fontSize: 12 }}> (Monto)</span>
                            </Td>
                            <Td isNumeric>{formatCurrency(balance?.invoices.invoiceATotal!)}</Td>
                          </Tr>
                          <Tr>
                            <Td>
                              A <span style={{ fontSize: 12 }}> (Cantidad)</span>
                            </Td>
                            <Td isNumeric>{balance?.invoices.invoiceACount!}</Td>
                          </Tr>
                        </>
                      ) : (
                        <>
                          <Tr>
                            <Td>
                              M <span style={{ fontSize: 12 }}> (Monto)</span>
                            </Td>
                            <Td isNumeric>{formatCurrency(balance?.invoices.invoiceMTotal!)}</Td>
                          </Tr>
                          <Tr>
                            <Td>
                              M <span style={{ fontSize: 12 }}> (Cantidad)</span>
                            </Td>
                            <Td isNumeric>{balance?.invoices.invoiceMCount!}</Td>
                          </Tr>
                        </>
                      )}
                      <Tr>
                        <Td>
                          B <span style={{ fontSize: 12 }}> (Monto)</span>
                        </Td>
                        <Td isNumeric>{formatCurrency(balance?.invoices.invoiceBTotal!)}</Td>
                      </Tr>
                      <Tr>
                        <Td>
                          B <span style={{ fontSize: 12 }}> (Cantidad)</span>
                        </Td>
                        <Td isNumeric>{balance?.invoices.invoiceBCount!}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>

                <TableContainer my={2} w="full">
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th bg="gray.700" color="white">
                          Notas de Crédito
                        </Th>
                        <Th isNumeric bg="gray.700" color="white">
                          TOTAL
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {afip?.invoiceM === 0 ? (
                        <>
                          <Tr>
                            <Td>
                              A <span style={{ fontSize: 12 }}> (Monto)</span>
                            </Td>
                            <Td isNumeric>{formatCurrency(balance?.invoices.invoiceNCATotal!)}</Td>
                          </Tr>
                          <Tr>
                            <Td>
                              A <span style={{ fontSize: 12 }}> (Cantidad)</span>
                            </Td>
                            <Td isNumeric>{balance?.invoices.invoiceNCACount!}</Td>
                          </Tr>
                        </>
                      ) : (
                        <>
                          <Tr>
                            <Td>
                              M <span style={{ fontSize: 12 }}> (Monto)</span>
                            </Td>
                            <Td isNumeric>{formatCurrency(balance?.invoices.invoiceNCMTotal!)}</Td>
                          </Tr>
                          <Tr>
                            <Td>
                              M <span style={{ fontSize: 12 }}> (Cantidad)</span>
                            </Td>
                            <Td isNumeric>{balance?.invoices.invoiceNCMCount!}</Td>
                          </Tr>
                        </>
                      )}
                      <Tr>
                        <Td>
                          B<span style={{ fontSize: 12 }}> (Monto)</span>
                        </Td>
                        <Td isNumeric>{formatCurrency(balance?.invoices.invoiceNCBTotal!)}</Td>
                      </Tr>
                      <Tr>
                        <Td>
                          B<span style={{ fontSize: 12 }}> (Cantidad)</span>
                        </Td>
                        <Td isNumeric>{balance?.invoices.invoiceNCBCount!}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </HStack>

              <HStack alignItems="flex-start">
                <TableContainer my={2} w="full">
                  <Table size="sm" w="259px">
                    <Thead>
                      <Tr>
                        <Th bg="gray.700" color="white">
                          NO AFIP
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
              </HStack>

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

              <TableContainer my={2} w="full">
                <Table size="sm">
                  <Text as="caption" fontSize="sm">
                    DETALLE DE MOVIMIENTOS
                  </Text>
                  <Thead>
                    <Tr>
                      <Th bg="gray.700" color="white" fontSize={10}>
                        Fecha
                      </Th>
                      <Th bg="gray.700" color="white" fontSize={10}>
                        Tipo
                      </Th>
                      <Th bg="gray.700" color="white" fontSize={10}>
                        Forma de pago
                      </Th>
                      <Th bg="gray.700" color="white" fontSize={10}>
                        Concepto
                      </Th>
                      <Th bg="gray.700" color="white" fontSize={10} textAlign="center">
                        Comprobante
                      </Th>
                      <Th bg="gray.700" color="white" fontSize={10}>
                        Usuario
                      </Th>
                      <Th isNumeric bg="gray.700" color="white" fontSize={10}>
                        Total
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {balance?.movements.map((el) => (
                      <Tr key={nanoid()}>
                        <Td fontSize={12}>{formatDate(el.createdAt)}</Td>
                        <Td color={el.type === 'IN' ? 'green.600' : 'red.600'} fontSize={12}>
                          {getType(el.type)}
                        </Td>
                        <Td fontSize={12}>{el.paymentMethod?.code}</Td>
                        <Td fontSize={12}>{el.concept}</Td>
                        {el.concept === 'Venta' || el.concept === 'N. de Crédito' ? (
                          el.cashMovement?.cae ? (
                            <Td fontSize={12} textAlign="center">
                              <Link
                                color="black"
                                fontSize={12}
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
                            <Td fontSize={12} textAlign="center">
                              <Link
                                color="black"
                                fontSize={12}
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
                          <Td fontSize={12} textAlign="center">
                            {' '}
                          </Td>
                        )}
                        <Td fontSize={12}>
                          {el.user?.name} {el.user?.lastname}
                        </Td>
                        <Td isNumeric fontSize={12}>
                          {formatCurrency(el.amount)}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              {/* <pre>{JSON.stringify(balance, null, 2)}</pre> */}
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );
};
