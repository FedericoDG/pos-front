import { Box, Heading, Stack, Text, Button, Divider, Icon } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { MdOutlineRemoveShoppingCart } from 'react-icons/md';
import { ImCancelCircle } from 'react-icons/im';

import { formatCurrency } from '../../utils';
import { ProductWithPrice } from '../../interfaces';

import { useUpdatePricePercentageContext } from './context';

interface Props {
  refetch: () => void;
  products: ProductWithPrice[];
}

export const Basket = ({ refetch, products }: Props) => {
  const { cart, removeItem, totalCartItems, goToNext, addItem, percentage } =
    useUpdatePricePercentageContext();

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

  const handleAddAll = () => {
    products.forEach((product) =>
      addItem({ ...product, newPrice: product.price * (1 + percentage / 100) })
    );
  };

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
      {cart.length > 0 ? (
        <Stack w="full">
          <Heading color="brand.500" fontSize="28" pt="2" textAlign="center">
            LISTA DE PRODUCTOS
          </Heading>
          <Stack maxH="486px" overflowY="auto">
            {cart.map((item) => {
              return (
                <Stack key={nanoid()} fontFamily="mono" fontSize={14} position="relative" py="1">
                  <Box px="2">
                    <Stack
                      alignItems="center"
                      direction="row"
                      justifyContent="space-between"
                      px="2"
                    >
                      <Text fontWeight="bold">{item.name}</Text>
                    </Stack>
                    <Text px="2">precio: {formatCurrency(item.price)}</Text>
                    <Text px="2">precio2: {formatCurrency(item.newPrice)}</Text>
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
          <Text fontFamily="mono" fontSize="xl" fontWeight="normal" px="2" textAlign="right">
            productos: ({totalCartItems})
          </Text>
          <Stack p="2">
            <Button
              colorScheme="brand"
              rightIcon={<ArrowForwardIcon />}
              size="lg"
              variant="solid"
              w="full"
              onClick={goToNext}
            >
              FINALIZAR ACTUALIZACIÓN
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
          <Button colorScheme="brand" isDisabled={percentage <= 0} onClick={handleAddAll}>
            AGREGAR TODOS
          </Button>
        </Stack>
      )}
    </Stack>
  );
};
