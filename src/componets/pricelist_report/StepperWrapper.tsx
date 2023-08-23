import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { usePriceListContext } from '.';

interface Props {
  children: ReactNode;
  step: number;
}

export const StepperWrapper = ({ children, step }: Props) => {
  const { activeStep } = usePriceListContext();

  if (activeStep !== step) return null;

  return <Box w="full">{children}</Box>;
};
