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
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { ImPrinter } from 'react-icons/im';
import { BsDownload } from 'react-icons/bs';
import { nanoid } from 'nanoid';

import { useGetLibroIva } from '../../hooks';
import { Loading } from '../common';
import { formatCurrency, formatDate, getInvoiceNameAndLetter } from '../../utils';


import { useBalanceContext } from '.';

export const Sheet = () => {
  const { from, to, goToPrevious } = useBalanceContext();



  const printRef = useRef<any | null>(null);
  const printRef2 = useRef<any | null>(null);
  const movementDetailsTable = useRef<any | null>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handlePrint2 = useReactToPrint({
    content: () => printRef2.current,
  });


  const data = {
    from,
    to,
  };

  const { data: libroIva, isFetching } = useGetLibroIva(data);

  const handleDownload = () => {
    const libro = XLSX.utils.book_new();
    const hoja = XLSX.utils.json_to_sheet([]);

    const tabla2: any[] = [{
      A: 'Fecha',
      B: "Concepto",
      C: "Comprobante",
      D: "Cliente",
      E: "Usuario",
      F: "Monto",
    }];


    /*  balance?.movements.forEach((el) => {
       tabla2.push({
         A: formatDate(el.createdAt),
         B: el.concept,
         C: el.cashMovement?.cae
           ? `${getInvoiceLetter(el.cashMovement?.cbteTipo!)} ${el.cashMovement?.posNumber
             ?.toString()
             .padStart(3, '0')}-${el.cashMovement?.invoceNumberAfip?.toString().padStart(8, '0')}`
           : `${getInvoiceLetter(el.cashMovement?.cbteTipo!)} ${el.cashMovement?.posNumber
             ?.toString()
             .padStart(3, '0')}-${el.cashMovement?.id?.toString().padStart(8, '0')}`,
         D: el.client?.name,
         E: `${el.user?.name} ${el.user?.lastname}`,
         F: el.concept === 'Venta' ? el.amount : el.amount * -1,
       });
     }); */


    XLSX.utils.sheet_add_json(hoja, tabla2);

    XLSX.utils.book_append_sheet(libro, hoja, 'Detalles de Movimientos');

    setTimeout(() => {
      XLSX.writeFile(libro, `ingresos_${from}_${to}.xlsx`);
    }, 500);
  };

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
          <Stack m="0 auto" mt={8}>
            <HStack alignItems="flex-start" justifyContent="space-between" w="full">
              <Stack>
                <HStack justifyContent="flex-end">
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
                  LIBRO IVA
                </Heading>
                <HStack justifyContent="space-between" w="full">
                  <Text fontSize="lg">{`${formatDate(libroIva?.from)} AL ${formatDate(
                    libroIva?.to
                  )}`}</Text>
                </HStack>
                <Divider />
              </Stack>
              <HStack className="no-print" justifyContent="flex-end" mt={8}>
                <Button
                  colorScheme="green"
                  leftIcon={<BsDownload />}
                  size="sm"
                  onClick={handleDownload}
                >
                  Descargar Excel (AUN NO FUNCIONA)
                </Button>
                <Button
                  colorScheme="linkedin"
                  leftIcon={<ImPrinter />}
                  size="sm"
                  onClick={handlePrint2}
                >
                  Imprimir
                </Button>
              </HStack>
              <Stack ref={printRef2}>
                {/* <Text textAlign="center" w="full">DETALLE DE MOVIMIENTOS</Text> */}
                <TableContainer my={2} w="full">
                  <Table ref={movementDetailsTable} className="lastCellPB" size="sm">
                    <Thead>
                      <Tr>
                        <Th bg="gray.700" color="white" fontSize={14}>
                          Fecha
                        </Th>
                        <Th bg="gray.700" color="white" fontSize={14}>
                          Tipo
                        </Th>
                        <Th bg="gray.700" color="white" fontSize={14} textAlign="center">
                          Número
                        </Th>
                        <Th bg="gray.700" color="white" fontSize={14}>
                          Razón Social
                        </Th>
                        <Th bg="gray.700" color="white" fontSize={14}>
                          Documento
                        </Th>
                        <Th isNumeric bg="gray.700" color="white" fontSize={14}>
                          Neto
                        </Th>
                        <Th isNumeric bg="gray.700" color="white" fontSize={14}>
                          IVA
                        </Th>
                        <Th isNumeric bg="gray.700" color="white" fontSize={14}>
                          Total
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {
                        libroIva?.movements.map(el => (
                          <Tr key={nanoid()}>
                            <Td>{formatDate(el.createdAt!)}</Td>
                            <Td>{getInvoiceNameAndLetter(el.cbteTipo)}</Td>
                            <Td>
                              {el.posNumber.toString().padStart(3, '0')}
                              {'-'}
                              {(el.invoceNumberAfip).toString().padStart(8, '0')}
                            </Td>
                            <Td>{el.client.name}</Td>
                            <Td>{el.client.document}</Td>
                            <Td>{formatCurrency(el.subTotal)}</Td>
                            <Td>{formatCurrency(el.iva)}</Td>
                            <Td>{formatCurrency(el.total)}</Td>
                          </Tr>
                        ))
                      }
                    </Tbody>
                  </Table>
                </TableContainer>
              </Stack>
              {/* <pre>{JSON.stringify(balance, null, 2)}</pre> */}
              SH
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );
};
