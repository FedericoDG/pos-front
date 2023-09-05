import { Button, Card, CardBody, Text, HStack, Stack, Heading } from '@chakra-ui/react';
import { useCallback, useEffect } from 'react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { formatCurrency } from '../../utils';
import { useCreatePriceManyPercentage } from '../../hooks';

import { useUpdatePricePercentageContext } from '.';

export const FinishSale = () => {
  const { cart, goToPrevious, priceList, setPriceList, emptyCart, setActiveStep } =
    useUpdatePricePercentageContext();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const onSucces = () => {
    toast.info('Precios actualizados', {
      theme: 'colored',
      position: toast.POSITION.BOTTOM_LEFT,
      autoClose: 3000,
      closeOnClick: true,
    });
    queryClient.invalidateQueries({ queryKey: ['products', 'pricelists'] });
    setPriceList(null);
    emptyCart();
    setActiveStep(1);
    navigate('/panel/lista-de-precios/actualizar-porcentaje/');
  };

  const { mutateAsync } = useCreatePriceManyPercentage(onSucces);

  const handleSubmit = useCallback(() => {
    const mappedCart = cart.map((product) => ({
      pricelistId: priceList?.id!,
      productId: product.id!,
      price: Number(product.newPrice.toFixed(2)),
    }));

    mutateAsync({ cart: mappedCart });
  }, [cart, mutateAsync, priceList?.id]);

  const onReset = () => {
    setPriceList(null);
    emptyCart();
    setActiveStep(1);
  };

  useEffect(() => {
    const handleUserKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        return handleSubmit();
      }
    };

    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [handleSubmit]);

  return (
    <Stack bg="white" p="4" rounded="md" shadow="md">
      <Button
        colorScheme="brand"
        leftIcon={<ArrowBackIcon />}
        mb={2}
        minW="150px"
        mr="auto"
        size="lg"
        onClick={() => goToPrevious()}
      >
        VOLVER
      </Button>
      <div
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        }}
      >
        {cart.map((product) => (
          <Card key={product.id} px={4} py={2}>
            <Heading size="md">{product.name}</Heading>
            <CardBody display={'flex'} justifyContent={'space-between'}>
              <Text color={'gray.600'} fontWeight={400}>
                {formatCurrency(product.price)}
              </Text>
              <ArrowForwardIcon />
              <Text fontWeight={700}>{formatCurrency(product.newPrice)}</Text>
            </CardBody>
          </Card>
        ))}
      </div>
      <HStack mt={4}>
        <Button w="full" onClick={onReset}>
          CANCELAR
        </Button>
        <Button colorScheme="brand" w="full" onClick={handleSubmit}>
          ACTUALIZAR PRECIOS
        </Button>
      </HStack>
    </Stack>
  );
};
