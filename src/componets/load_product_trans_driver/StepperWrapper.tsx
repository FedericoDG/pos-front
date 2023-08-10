import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { useProductTransContext } from '.';

interface Props {
  children: ReactNode;
  step: number;
}

export const StepperWrapper = ({ children, step }: Props) => {
  const { activeStep } = useProductTransContext();

  if (activeStep !== step) return null;

  return <Box>{children}</Box>;
};
