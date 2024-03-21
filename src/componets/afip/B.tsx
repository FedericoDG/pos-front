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
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CashMovement, Settings } from '../../interfaces';

import { FacturaB } from './FacturaB';
import { TicketB } from './TicketB';

interface Props {
  settings: Settings;
  cashMovement: CashMovement;
}

export const B = ({ cashMovement, settings }: Props) => {
  const [showTicket, setShowTicket] = useState(true);

  const printRef = useRef<any | null>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const someDiscount = cashMovement.cashMovementDetails?.some((el) => el.totalDiscount > 0);

  const newSubTotal =
    cashMovement.cashMovementDetails?.reduce(
      (acc, el) => acc + (el.price * el.quantity - el.totalDiscount) * (1 + el.tax),
      0
    ) || 0;

  const newDiscount = () => {
    const originalDiscount =
      cashMovement.cashMovementDetails?.reduce(
        (acc, el) => acc + (el.price * el.quantity - el.totalDiscount) * (1 + el.tax),
        0
      ) || 0;

    return (cashMovement.discount + originalDiscount - cashMovement.subtotal) * -1;
  };

  const newRecharge = () => {
    const originalRecharge =
      cashMovement.cashMovementDetails?.reduce(
        (acc, el) => acc + (el.price * el.quantity - el.totalDiscount) * (1 + el.tax),
        0
      ) || 0;

    return cashMovement.recharge + cashMovement.subtotal - originalRecharge;
  };

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
          Imprimir
        </Button>
      </Stack>

      {
        showTicket
          ?
          <TicketB cashMovement={cashMovement} newDiscount={newDiscount} newRecharge={newRecharge} newSubTotal={newSubTotal} printRef={printRef} settings={settings} />
          :
          <FacturaB cashMovement={cashMovement} newDiscount={newDiscount} newRecharge={newRecharge} newSubTotal={newSubTotal} printRef={printRef} settings={settings} someDiscount={someDiscount} />
      }

    </Flex>
  );
};
