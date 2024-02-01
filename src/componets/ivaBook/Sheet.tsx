/* eslint-disable prettier/prettier */
import {
  Button,
  Divider,
  HStack,
  Heading,
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
import * as XLSX from 'xlsx';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { ImPrinter } from 'react-icons/im';
import { BsDownload } from 'react-icons/bs';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';

import { useGetLibroIva } from '../../hooks';
import { Loading } from '../common';
import { formatCurrency, formatDate, getCFiscal, getInvoceLetterById, getInvoiceNameAndLetter } from '../../utils';


import { SelectedInvoice, useBalanceContext } from '.';

export const Sheet = () => {
  const { from, to, goToPrevious, invoices } = useBalanceContext();



  const printRef = useRef<any | null>(null);
  const movementDetailsTable = useRef<any | null>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });



  const data = {
    invoices: JSON.stringify(invoices.map((el) => el.value)),
    from,
    to,
  };


  const { data: libroIva, isFetching, isSuccess } = useGetLibroIva(data);

  const creditNotesIds = [5, 6, 7, 8];

  const handleDownload = () => {
    const libro = XLSX.utils.book_new();
    const hoja = XLSX.utils.json_to_sheet([]);

    const tabla2: any[] = [];


    libroIva?.movements.forEach((el) => {
      tabla2.push({
        Fecha: formatDate(el.createdAt),
        Tipo: getInvoiceNameAndLetter(el.cbteTipo),
        ["Número"]: `${(el.posNumber).toString().padStart(3, '0')}-${(el.invoceNumberAfip).toString().padStart(8, '0')}`,
        ["Razón Social"]: el.client.name,
        Documento: el.client.document,
        ["C. Fiscal"]: getCFiscal(el.client.ivaTypeId),
        Neto: el.subTotal,
        ["IVA 21%"]: el.ivaDetails['0.21'],
        ["IVA 10.5%"]: el.ivaDetails['0.105'],
        ["IVA 27%"]: el.ivaDetails['0.27'],
        ["IVA 5%"]: el.ivaDetails['0.05'],
        ["IVA 2.5%"]: el.ivaDetails['0.025'],
        Total: creditNotesIds.includes(el.invoceTypeId) ? (el.total * -1) : (el.total)
      });
    });


    XLSX.utils.sheet_add_json(hoja, tabla2);

    XLSX.utils.book_append_sheet(libro, hoja, 'Libro IVA');

    setTimeout(() => {
      XLSX.writeFile(libro, `libro-iva_${from}_${to}.xlsx`);
    }, 500);
  };

  const getInvoiceList = (list: SelectedInvoice[]) =>
    list.map((el) => getInvoceLetterById(el.value!)).join(', ');

  if (isSuccess) toast('Libro IVA recuperado');

  return (
    <Stack w="full">
      {isFetching || !libroIva ? (
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
            <HStack alignItems="flex-start" justifyContent="flex-end" w="full">
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

            <Stack ref={printRef} my={8} w="210mm">
              <Stack alignItems="flex-start">
                <Heading fontWeight={500} size="md" textAlign="center" w="full">
                  LIBRO IVA
                </Heading>
                <HStack justifyContent="space-between" w="full">
                  <Text fontSize="lg">{`COMPROBANTES: ${getInvoiceList(invoices)}`}</Text>
                  <Text fontSize="lg">{`${formatDate(libroIva?.from)} AL ${formatDate(
                    libroIva?.to
                  )}`}</Text>
                </HStack>
                <Divider />
              </Stack>
              {
                libroIva.movements.length > 0 ?
                  <Stack>
                    <TableContainer my={2} w="full">
                      <Table ref={movementDetailsTable} className="lastCellPB" size="sm">
                        <Thead>
                          <Tr>
                            <Th bg="gray.700" color="white" fontSize={12}>
                              Fecha
                            </Th>
                            <Th bg="gray.700" color="white" fontSize={12}>
                              Tipo
                            </Th>
                            <Th bg="gray.700" color="white" fontSize={12}>
                              Número
                            </Th>
                            <Th bg="gray.700" color="white" fontSize={12}>
                              Razón Social
                            </Th>
                            <Th bg="gray.700" color="white" fontSize={12}>
                              Documento
                            </Th>
                            <Th isNumeric bg="gray.700" color="white" fontSize={12}>
                              Neto
                            </Th>
                            <Th isNumeric bg="gray.700" color="white" fontSize={12}>
                              IVA
                            </Th>
                            <Th isNumeric bg="gray.700" color="white" fontSize={12}>
                              Total
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {
                            libroIva?.movements.map(el => (
                              <Tr key={nanoid()}>
                                <Td fontSize={12}>{formatDate(el.createdAt!)}</Td>
                                <Td color={el.isCreditNote ? 'red.600' : 'black'} fontSize={12}>{getInvoiceNameAndLetter(el.cbteTipo)}</Td>
                                <Td fontSize={12}>
                                  {el.posNumber.toString().padStart(3, '0')}
                                  {'-'}
                                  {(el.invoceNumberAfip).toString().padStart(8, '0')}
                                </Td>
                                <Td fontSize={12}>{el.client.name}</Td>
                                <Td fontSize={12}>{el.client.document}</Td>
                                <Td isNumeric color={el.isCreditNote ? 'red.600' : 'black'} fontSize={12}>{creditNotesIds.includes(el.invoceTypeId) ? formatCurrency(el.subTotal * -1) : formatCurrency(el.subTotal)}</Td>
                                <Td isNumeric color={el.isCreditNote ? 'red.600' : 'black'} fontSize={12}>{creditNotesIds.includes(el.invoceTypeId) ? formatCurrency(el.iva) : formatCurrency(el.iva)}</Td>
                                <Td isNumeric color={el.isCreditNote ? 'red.600' : 'black'} fontSize={12}>{creditNotesIds.includes(el.invoceTypeId) ? formatCurrency(el.total) : formatCurrency(el.total)}</Td>
                              </Tr>
                            ))
                          }
                          <Tr>
                            <Td isNumeric border={0} colSpan={6} fontSize={12} fontWeight={600}>{formatCurrency(libroIva.totalSubTotal)}</Td>
                            <Td isNumeric border={0} fontSize={12} fontWeight={600}>{formatCurrency(libroIva.totalIva)}</Td>
                            <Td isNumeric border={0} fontSize={12} fontWeight={600}>{formatCurrency(libroIva.totalTotal)}</Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                    <TableContainer w="50%">
                      <Table className="lastCellPB" size="sm">
                        <Thead>
                          <Tr>
                            <Th bg="gray.700" color="white" fontSize={12}>Tipo</Th>
                            <Th isNumeric bg="gray.700" color="white" fontSize={12}>Total</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {
                            libroIva.total021 > 0 &&
                            <Tr>
                              <Td>
                                IVA 21%
                              </Td>
                              <Td isNumeric>
                                {formatCurrency(libroIva.total021)}
                              </Td>
                            </Tr>
                          }
                          {
                            libroIva.total0105 > 0 &&
                            <Tr>
                              <Td>
                                IVA 10.5%
                              </Td>
                              <Td isNumeric>
                                {formatCurrency(libroIva.total0105)}
                              </Td>
                            </Tr>
                          }
                          {
                            libroIva.total027 > 0 &&
                            <Tr>
                              <Td>
                                IVA 27%
                              </Td>
                              <Td isNumeric>
                                {formatCurrency(libroIva.total027)}
                              </Td>
                            </Tr>
                          }
                          {
                            libroIva.total005 > 0 &&
                            <Tr>
                              <Td>
                                IVA 5%
                              </Td>
                              <Td isNumeric>
                                {formatCurrency(libroIva.total005)}
                              </Td>
                            </Tr>
                          }
                          {
                            libroIva.total0025 > 0 &&
                            <Tr>
                              <Td>
                                IVA 2.5%
                              </Td>
                              <Td isNumeric>
                                {formatCurrency(libroIva.total0025)}
                              </Td>
                            </Tr>
                          }
                          {
                            libroIva.total0 > 0 &&
                            <Tr>
                              <Td>
                                IVA 0%
                              </Td>
                              <Td isNumeric>
                                {formatCurrency(libroIva.total0)}
                              </Td>
                            </Tr>
                          }
                          {
                            libroIva.totalIva > 0 &&
                            <Tr>
                              <Td isNumeric border={0} colSpan={2} fontWeight={600}>
                                {formatCurrency(libroIva.totalIva)}
                              </Td>
                            </Tr>
                          }
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </Stack>
                  :
                  <Text fontSize={'xl'} mt={8} textAlign={'center'} textColor={'gray.900'} w="full">
                    NO EXISTEN DATOS PARA LAS FECHAS Y COMPROBANTES SELECCIONADOS
                  </Text>
              }
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );
};
