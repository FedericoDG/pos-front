/* eslint-disable prettier/prettier */
import {
  Button,
  Divider,
  Heading,
  HStack,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { ImPrinter } from 'react-icons/im';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';

import { formatCurrency } from '../../utils';
import { Client } from '../../interfaces';

interface Props {
  currentAccount: {
    id: number;
    clientId: number;
    balance: number;
    client: Client;
    createdAt: string;
    updatedAt: string;
  }[];
}

export const SheetResume = ({ currentAccount }: Props) => {


  const navigate = useNavigate();

  const printRef = useRef<any | null>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });


  return (
    <Stack m="0 auto" py="8" w="1024px">
      <HStack justifyContent={'end'}>
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


      <Stack ref={printRef}>
        <HStack justifyContent="space-between" w="full">
          <Heading fontWeight={500} size="md">
            Cuenta Corriente
          </Heading>
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
                <Th isNumeric bg="gray.700" color="white">
                  Saldo Cta. Cte.
                </Th>
                <Th bg="gray.700" className='no-print' color="white" textAlign='center'>
                  Acciones
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {
                currentAccount?.map(item => (
                  <Tr key={nanoid()}>
                    <Td>{item.client.name}</Td>
                    <Td>{item.client.document}</Td>
                    <Td isNumeric color={item.balance > 0 ? 'red.500' : 'black'}>{formatCurrency(item.balance)}</Td>
                    <Td className='no-print' textAlign='center'>
                      <Button size={'sm'} onClick={() => navigate(`/panel/cliente/${item.client.id}`)}>
                        Ver Detalles
                      </Button>
                    </Td>
                  </Tr>
                ))
              }
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </Stack >
  );
};
