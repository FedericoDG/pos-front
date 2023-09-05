import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { useUpdatePricePercentageContext } from '.';

interface Props {
  children: ReactNode;
  step: number;
}

export const StepperWrapper = ({ children, step }: Props) => {
  const { activeStep } = useUpdatePricePercentageContext();

  if (activeStep !== step) return null;

  return <Box>{children}</Box>;
};
