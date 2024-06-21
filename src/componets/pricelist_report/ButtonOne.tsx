import { Button } from '@chakra-ui/react';

import { usePriceListContext } from './context';

interface Props {
  activeStep: number;
  goToNext: () => void;
}

export const ButtonOne = ({ goToNext, activeStep }: Props) => {
  const { productList, priceListsList } = usePriceListContext();

  return (
    <Button
      colorScheme="brand"
      isDisabled={
        (activeStep === 1 && productList.length < 1) ||
        (activeStep === 2 && priceListsList.length < 1)
      }
      ml="auto"
      size="lg"
      onClick={() => goToNext()}
    >
      SIGUIENTE PASO
    </Button>
  );
};
