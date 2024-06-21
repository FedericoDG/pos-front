/* eslint-disable prettier/prettier */
import { useNavigate, useParams } from 'react-router-dom';
import {
  Flex,
  Stack,
  Button,
  FormControl,
  Switch,
  FormLabel,
} from '@chakra-ui/react';
import { ImPrinter } from 'react-icons/im';
import { useReactToPrint } from 'react-to-print';
import { useEffect, useRef, useState } from 'react';

import { DashBoard, Loading } from '../componets/common';
import { useGetCashMovement, useGetSettings } from '../hooks';
import { FacturaX, TicketX } from '../componets/afip';

export const SaleDetails = () => {
  const [showTicket, setShowTicket] = useState(true);
  const { id } = useParams();

  const printRef = useRef<any | null>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const { data: cashMovement, isLoading: isLoadingCashMovement } = useGetCashMovement(Number(id!));
  const { data: settings, isLoading: isLoadingSettings } = useGetSettings(1);

  const someDiscount = cashMovement?.cashMovementDetails?.some((el) => el.totalDiscount > 0);

  const navigate = useNavigate();

  useEffect(() => {
    const handleUserKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        return navigate(-1);
      }
    };

    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [navigate]);


  return (
    <DashBoard
      isIndeterminate={isLoadingCashMovement || isLoadingSettings}
      title="Comprobante Interno"
    >
      {!cashMovement || !settings ? (
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
            <FormControl alignItems="center" display="flex">
              <Switch
                id="filter"
                isChecked={showTicket}
                size={'md'}
                onChange={(e) => setShowTicket(e.target.checked)}
              />
              <FormLabel htmlFor="filter" mb="0" ml="2">
                Ver en formato ticket
              </FormLabel>
            </FormControl>

            <Button
              colorScheme="linkedin"
              leftIcon={<ImPrinter />}
              mb="2"
              size="sm"
              onClick={handlePrint}
            >
              IMPRIMIR
            </Button>
          </Stack>
          {
            showTicket
              ?
              <TicketX cashMovement={cashMovement} printRef={printRef} settings={settings} />
              :
              <FacturaX cashMovement={cashMovement} printRef={printRef} settings={settings} someDiscount={someDiscount} />
          }
        </Flex>
      )}
    </DashBoard>
  );
};
