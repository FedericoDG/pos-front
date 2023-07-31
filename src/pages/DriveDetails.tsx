import { useParams } from 'react-router-dom';
import { Button, Flex, Stack } from '@chakra-ui/react';
import { ImPrinter } from 'react-icons/im';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

import { DashBoard, Loading } from '../componets/common';
import { useGetWarehouse } from '../hooks';

export const DriverDetails = () => {
  const { id } = useParams();

  const printRef = useRef<any | null>(null);

  const { data: driver, isFetching: isFetchingDriver } = useGetWarehouse(Number(id));

  const isIndeterminate = isFetchingDriver;

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Detalle de Chofer">
      {!driver ? (
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
          <Button
            alignSelf={'flex-end'}
            colorScheme="linkedin"
            leftIcon={<ImPrinter />}
            size="sm"
            onClick={handlePrint}
          >
            Imprimir
          </Button>
          <Stack ref={printRef} minW="1024px" py="8">
            <pre>
              {JSON.stringify(
                driver.stocks?.filter((el) => el.stock > 0),
                null,
                2
              )}
            </pre>
          </Stack>
        </Flex>
      )}
    </DashBoard>
  );
};
