import {
  Box,
  Heading,
  Stack,
  Text,
  Button,
  Divider,
  Icon,
  HStack,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import { ArrowForwardIcon, WarningIcon } from '@chakra-ui/icons';
import { MdOutlineRemoveShoppingCart } from 'react-icons/md';
import { ImCancelCircle } from 'react-icons/im';
import { toast } from 'sonner';

import { formatCurrency } from '../../utils';
import { useCheckCart, useGetAfip } from '../../hooks';
import { Loading } from '../common';

import { usePosContext } from './context';

interface Props {
  refetch: () => void;
}

export const Basket = ({ refetch }: Props) => {
  const {
    cart,
    client,
    removeItem,
    totalCart,
    totalCartItems,
    goToNext,
    warehouse,
    updateCartWithError,
    iva,
  } = usePosContext();

  useEffect(() => {
    const handleUserKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        return goToNext();
      }
    };

    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [goToNext]);

  const cb = (error: number[]) => {
    if (error.length > 0) {
      updateCartWithError(error);
      refetch();
      toast.error('No hay suficiente stock en algunos productos');
    } else {
      goToNext();
    }
  };

  const { mutate } = useCheckCart(cb);

  const handleSubmit = () => {
    const mappedCart = cart.map((item) => ({
      productId: item.id!,
      quantity: item.quantity,
      price: item.price,
      allow: item.allownegativestock === 'ENABLED' ? true : false,
    }));

    mutate({ warehouseId: warehouse?.id!, cart: mappedCart });
  };

  const { data: settings, isLoading } = useGetAfip();

  useEffect(() => {
    if (!settings) return;

    if (client?.document === '00000000' && totalCart > settings?.maxPerInvoice) {
      console.log('ERROR');
    }
  }, [client?.document, settings, totalCart]);

  return (
    <Stack
      bg="white"
      border="1px solid whitesmoke"
      justifyContent="center"
      pb="4"
      px="4"
      rounded="md"
      w="35%"
    >
      {isLoading ? (
        <Loading minH="334px" />
      ) : cart.length > 0 ? (
        <Stack w="full">
          <Heading color="brand.500" fontSize="28" pt="2" textAlign="center">
            LISTA DE PRODUCTOS
          </Heading>
          {client?.document === '00000000' && totalCart > settings?.maxPerInvoice! && (
            <Alert status="error">
              <AlertIcon />
              {`El importe máximo de facturación para identificar a consumidores finales es de ${formatCurrency(
                settings?.maxPerInvoice!
              )}`}
            </Alert>
          )}
          <Stack maxH="448px" overflowY="auto">
            {cart.map((item) => {
              return (
                <Stack key={nanoid()} fontFamily="mono" fontSize={14} position="relative" py="1">
                  <Box px="2">
                    <Stack
                      alignItems="center"
                      bg={item.error ? 'red.500' : 'brand.700'}
                      direction="row"
                      justifyContent="space-between"
                      px="2"
                    >
                      {item.hasDiscount ? (
                        <HStack>
                          <Text color={item.error ? 'white' : 'whitesmoke'} fontWeight="bold">
                            {item.name}
                          </Text>
                          <Text color={item.error ? 'white' : 'plum'} fontWeight="bold">
                            desc: {item.discount}%
                          </Text>
                        </HStack>
                      ) : (
                        <Text color={item.error ? 'white' : 'whitesmoke'} fontWeight="bold">
                          {item.name}
                        </Text>
                      )}
                      {item.error && <WarningIcon color="white" h={4} marginX="1" w={4} />}
                    </Stack>
                    <Text px="2">
                      cantidad: {item.quantity} {item.unit?.code}
                    </Text>
                    <Text px="2">precio: {formatCurrency(item.price)}</Text>
                    {item.totalDiscount > 0 && (
                      <>
                        <Text px="2">descuento: {formatCurrency(item.totalDiscount * -1)}</Text>
                        <Text px="2">
                          subtotal:{' '}
                          {formatCurrency(item.price * item.quantity - item.totalDiscount)}
                        </Text>
                      </>
                    )}
                    {iva && (
                      <Text px="2">
                        iva:{' '}
                        {formatCurrency(
                          (item.price * item.quantity - item.totalDiscount) * item.tax
                        )}{' '}
                        ({item.tax * 100}
                        %)
                      </Text>
                    )}
                    <Text px="2" textDecoration="underline">
                      total:{' '}
                      {formatCurrency(
                        (item.price * item.quantity - item.totalDiscount) * (1 + item.tax)
                      )}
                    </Text>
                  </Box>
                  <Box position="absolute" right={0} top={'50%'}>
                    <Button
                      colorScheme="red"
                      fontSize={14}
                      leftIcon={<ImCancelCircle />}
                      pr="3"
                      size={'xs'}
                      variant="ghost"
                      onClick={() => removeItem(item.id!)}
                    >
                      QUITAR
                    </Button>
                  </Box>
                </Stack>
              );
            })}
          </Stack>
          <Divider />
          <Text fontFamily="mono" fontSize="xl" fontWeight="bold" px="2" textAlign="right">
            {formatCurrency(totalCart)}
          </Text>
          <Text fontFamily="mono" fontSize="xl" fontWeight="normal" px="2" textAlign="right">
            productos: ({totalCartItems})
          </Text>
          <Stack p="2">
            <Button
              colorScheme="brand"
              isDisabled={client?.document === '00000000' && totalCart > settings?.maxPerInvoice!}
              rightIcon={<ArrowForwardIcon />}
              size="lg"
              variant="solid"
              w="full"
              onClick={handleSubmit}
            >
              IR A FINZALIZAR VENTA
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Stack alignItems={'center'} display={'flex'} justifyContent={'center'}>
          <Heading color="gray.300" fontSize="28" pt="2" textAlign="center">
            LISTA VACÍA
          </Heading>
          <Icon as={MdOutlineRemoveShoppingCart} boxSize={240} color="gray.300" />
          <Heading color="gray.300" fontSize="24" pt="2" textAlign="center">
            AGREGUE PRODUCTOS
          </Heading>
        </Stack>
      )}
    </Stack>
  );
};
