import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { useBalanceContext } from '.';

interface Props {
  children: ReactNode;
  step: number;
}

export const StepperWrapper = ({ children, step }: Props) => {
  const { activeStep } = useBalanceContext();

  if (activeStep !== step) return null;

  return <Box>{children}</Box>;
};
