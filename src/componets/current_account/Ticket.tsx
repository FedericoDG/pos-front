import { Button, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import { useRef } from 'react';
import { ImPrinter } from 'react-icons/im';
import { useReactToPrint } from 'react-to-print';
import { useParams } from 'react-router-dom';

import { useGetSettings } from '../../hooks';
import { DashBoard, Loading } from '../common';
import { useGetRecibo } from '../../hooks/useCurrentAccounts';
import { formatCurrency, formatDate } from '../../utils';

export const Ticket = () => {
  const { id } = useParams();

  const printRef = useRef<any | null>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const { data: settings, isLoading } = useGetSettings(1);
  const { data: recibo } = useGetRecibo(Number(id));

  return (
    <DashBoard isIndeterminate={false} title="Cuenta Corriente">
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
        <Stack direction="row" justifyContent="flex-end" w="full">
          <Button
            colorScheme="linkedin"
            leftIcon={<ImPrinter />}
            mb="2"
            size="sm"
            onClick={handlePrint}
          >
            Imprimir
          </Button>
        </Stack>
        {!settings || isLoading ? (
          <Loading />
        ) : (
          <Stack
            ref={printRef}
            border="1px solid black"
            color={'black'}
            height="120mm"
            padding="2.5mm"
            width="80mm"
          >
            <Text align="center" backgroundColor="white">
              {settings.name}
            </Text>
            <HStack justifyContent="center" px={2} py={2} w="full">
              <Text
                border="solid black"
                borderWidth={1}
                fontSize="48px"
                lineHeight={1}
                textAlign="center"
                w="16mm"
              >
                R
              </Text>
            </HStack>

            <HStack justify={'flex-end'}>
              <Text>{formatDate(recibo?.currentAccountDetails.createdAt)}</Text>
            </HStack>

            <Stack
              alignItems="flex-start"
              borderBottomWidth={1}
              borderColor="black"
              borderTopWidth={1}
              justifyContent="space-between"
              pos="relative"
            >
              <Text fontSize="small">
                Señores: {recibo?.currentAccountDetails.currentAccount.client.name}
              </Text>
              <Text fontSize="small">
                Domicilio: {recibo?.currentAccountDetails.currentAccount.client?.address}
              </Text>
              <Text fontSize="small">
                {recibo?.currentAccountDetails.currentAccount.client?.identification?.description}:{' '}
                {recibo?.currentAccountDetails.currentAccount.client?.document}
              </Text>
            </Stack>

            <Stack height="full">
              <Text>{`Recibimos la suma de ${formatCurrency(
                recibo?.currentAccountDetails.amount!
              )} en concepto de cancelación parcial de saldo en cuenta corriente.`}</Text>
              <Stack height={'full'}>
                <div style={{ flex: 1 }} />
                <Text>{`SALDO RESTANTE: ${formatCurrency(
                  recibo?.currentAccountDetails.prevAmount! - recibo?.currentAccountDetails.amount!
                )}`}</Text>
              </Stack>
            </Stack>
          </Stack>
        )}
      </Flex>
    </DashBoard>
  );
};
