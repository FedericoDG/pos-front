/* eslint-disable prettier/prettier */
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
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CashMovement, Settings } from '../../interfaces';
import { formatTwoDigits } from '../../utils/formatCurrency';

import { FacturaA } from './FacturaA';
import { TicketA } from './TicketA';

interface Props {
  settings: Settings;
  cashMovement: CashMovement;
}

export const A = ({ cashMovement, settings }: Props) => {
  const [showTicket, setShowTicket] = useState(true);
  const printRef = useRef<any | null>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });


  const iva = useMemo(
    () =>
      cashMovement.cashMovementDetails?.reduce(
        (acc, el) => acc + el.totalIVA,
        0
      ) || 0,
    [cashMovement.cashMovementDetails]
  );

  const iva2 = useMemo(() => {
    const fede = cashMovement.cashMovementDetails?.reduce((acc: any, el) => {
      acc[el.tax] ??= 0;
      acc[el.tax] += el.totalIVA;

      return acc;
    }, {});

    const arr = [];

    for (const key in fede) {
      arr.push({
        percent: 'IVA ' + formatTwoDigits(parseFloat(key) * 100) + '%',
        value: Math.round(fede[key] * 100) / 100,
      });
    }

    return arr.filter((el) => el.percent !== 'IVA 0,00%');
  }, [cashMovement.cashMovementDetails]);

  const someDiscount = cashMovement.cashMovementDetails?.some(el => el.totalDiscount > 0);

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
    <Flex
      alignItems="center"
      bg="white"
      flexDir={{ base: 'column' }}
      justifyContent="center"
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
          <TicketA cashMovement={cashMovement} iva={iva} iva2={iva2} printRef={printRef} settings={settings} />
          :
          <FacturaA cashMovement={cashMovement} iva={iva} iva2={iva2} printRef={printRef} settings={settings} someDiscount={someDiscount} />
      }
    </Flex>
  );
};
