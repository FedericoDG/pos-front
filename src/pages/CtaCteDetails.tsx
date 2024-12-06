import { useParams } from 'react-router-dom';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Button,
  Flex,
  HStack,
  Link,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { ImPrinter } from 'react-icons/im';
import { BsDownload } from 'react-icons/bs';
import * as XLSX from 'xlsx';

import { DashBoard, Loading } from '../componets/common';
import { useCurrentAccountPayments } from '../hooks';
import { formatCurrency, formatDate, formatDateAndHour } from '../utils';

export const CtaCteDetails = () => {
  const { id } = useParams();
  const printRef = useRef<any | null>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handleDownload = () => {
    const libro = XLSX.utils.book_new();
    const hoja = XLSX.utils.json_to_sheet([]);

    const tabla2: any[] = [];

    data?.details.forEach((el) => {
      tabla2.push({
        Fecha: formatDate(el.createdAt),
        Monto: el.amount,
        Metodo: el.paymentMethod.code,
        Comprobante: `R - ${el.id?.toString().padStart(8, '0')}`,
        Cliente: el.client.name,
      });
    });

    XLSX.utils.sheet_add_json(hoja, tabla2);

    XLSX.utils.book_append_sheet(libro, hoja, 'Cobros Cuenta Corriente');

    setTimeout(() => {
      XLSX.writeFile(libro, `Listado_cobros_cta_cte.xlsx`);
    }, 500);
  };

  const { data, isFetching } = useCurrentAccountPayments(Number(id));

  const isIndeterminate = isFetching;

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Cobros Cuenta Corriente">
      {!data ? (
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
            <HStack justifyContent="flex-start">
              {/*   <FormControl alignItems="center" display="flex">
                <Switch
                  id="filter"
                  isChecked={enabledFilter}
                  onChange={(e) => setEnabledFilter(e.target.checked)}
                />
                <FormLabel htmlFor="filter" mb="0" ml="2">
                  Desplegar detalles
                </FormLabel>
              </FormControl> */}
            </HStack>
            <Button
              alignSelf={'flex-end'}
              colorScheme="linkedin"
              leftIcon={<ImPrinter />}
              size="sm"
              onClick={handlePrint}
            >
              IMPRIMIR
            </Button>
          </Stack>
          {data.details.length > 0 ? (
            <Stack ref={printRef} py="8" w="1024px">
              <Stack>
                <Text fontWeight="semibold" mt={4} textAlign="right">
                  Caja del: {formatDateAndHour(data.details[0].cashRegister.openingDate)} hs.
                  {data.details[0].cashRegister.closingDate !== null
                    ? ` hasta el: ${formatDateAndHour(
                      data.details[0].cashRegister.closingDate
                    )} hs.`
                    : ''}
                </Text>
                <Text mt={4} textAlign="left">
                  USUARIO
                </Text>
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
                        {<Td>{data.details[0].cashRegister.user.lastname}</Td>}
                        <Td>{data.details[0].cashRegister.user.name}</Td>
                        {data.details[0].cashRegister.user.role.name! === 'USER' && (
                          <Td>USUARIO</Td>
                        )}
                        {data.details[0].cashRegister.user.role.name! === 'DRIVER' && (
                          <Td>CHOFER</Td>
                        )}
                        {data.details[0].cashRegister.user.role.name! === 'SELLER' && (
                          <Td>VENDEDOR</Td>
                        )}
                        {data.details[0].cashRegister.user.role.name! === 'ADMIN' && (
                          <Td>ADMINISTRADOR</Td>
                        )}
                        {data.details[0].cashRegister.user.role.name! === 'SUPERADMIN' && (
                          <Td>SUPER</Td>
                        )}
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </Stack>

              <Stack>
                <HStack alignItems="center" justifyContent="space-between" mt={8}>
                  <Text mt={4} textAlign="left">
                    COBROS
                  </Text>
                  <Button
                    className="no-print"
                    colorScheme="green"
                    leftIcon={<BsDownload />}
                    size="sm"
                    onClick={handleDownload}
                  >
                    DESCARGAR EXCEL
                  </Button>
                </HStack>
                <TableContainer w="full">
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th bg="gray.700" color="white">
                          Fecha
                        </Th>
                        <Th isNumeric bg="gray.700" color="white">
                          Monto
                        </Th>
                        <Th bg="gray.700" color="white">
                          Método de pago
                        </Th>
                        <Th bg="gray.700" color="white">
                          Comprobante
                        </Th>
                        <Th bg="gray.700" color="white">
                          Cliente
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data.details.map((detail) => (
                        <Tr key={detail.id}>
                          <Td>{formatDate(detail.createdAt)}</Td>
                          <Td isNumeric>{formatCurrency(detail.amount)}</Td>
                          <Td>{detail.paymentMethod.code}</Td>
                          <Td>
                            <Link
                              color="black"
                              fontSize={14}
                              fontWeight={400}
                              href={`/ panel / cuenta - corriente / recibo / ${detail.id}`}
                              target="_blank"
                              variant="link"
                              w="full"
                            >
                              R - {detail.id?.toString().padStart(8, '0')}
                            </Link>
                          </Td>
                          <Td>{detail.client.name}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Stack>
              <Stack>
                <Text mt={4} textAlign="left">
                  RESUMEN
                </Text>
                <TableContainer w="50%">
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th bg="gray.700" color="white">
                          Forma de Pago
                        </Th>
                        <Th isNumeric bg="gray.700" color="white">
                          Monto
                        </Th>
                      </Tr>
                    </Thead>
                    {
                      <Tbody>
                        <Tr>
                          <Td color="#4a5568">Efectivo</Td>
                          {
                            <Td isNumeric color="#4a5568">
                              {formatCurrency(data.paymentResume.Efectivo)}
                            </Td>
                          }
                        </Tr>
                        <Tr>
                          <Td color="#4a5568">Débito</Td>
                          {
                            <Td isNumeric color="#4a5568">
                              {formatCurrency(data.paymentResume.Débito || 0)}
                            </Td>
                          }
                        </Tr>
                        <Tr>
                          <Td color="#4a5568">Crédito</Td>
                          {
                            <Td isNumeric color="#4a5568">
                              {formatCurrency(data.paymentResume.Crédito || 0)}
                            </Td>
                          }
                        </Tr>
                        <Tr>
                          <Td color="#4a5568">Transferencia</Td>
                          {
                            <Td isNumeric color="#4a5568">
                              {formatCurrency(data.paymentResume.Transferencia || 0)}
                            </Td>
                          }
                        </Tr>
                        <Tr>
                          <Td color="#4a5568">MercadoPago</Td>
                          {
                            <Td isNumeric color="#4a5568">
                              {formatCurrency(data.paymentResume.MercadoPago || 0)}
                            </Td>
                          }
                        </Tr>
                        <Tr>
                          <Td color="#4a5568" fontWeight="bold">
                            Total
                          </Td>
                          {
                            <Td isNumeric color="#4a5568" fontWeight="bold">
                              {formatCurrency(
                                (data.paymentResume.Efectivo || 0) +
                                (data.paymentResume.Débito || 0) +
                                (data.paymentResume.Crédito || 0) +
                                (data.paymentResume.Transferencia || 0) +
                                (data.paymentResume.MercadoPago || 0)
                              )}
                            </Td>
                          }
                        </Tr>
                      </Tbody>
                    }
                  </Table>
                </TableContainer>
              </Stack>
            </Stack>
          ) : (
            <Stack alignItems="center" justifyContent="center" minH="50vh">
              <Text fontSize={'2xl'}>Esta caja aún no ha realizado cobros</Text>
            </Stack>
          )}
        </Flex>
      )}
    </DashBoard>
  );
};
