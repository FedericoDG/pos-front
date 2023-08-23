import {
  Box,
  Stack,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper as ChakraStepper,
  StepSeparator,
  StepStatus,
  StepTitle,
} from '@chakra-ui/react';

import { usePurchasesContext } from '.';

export const Steps = () => {
  const { steps, activeStep } = usePurchasesContext();

  return (
    <Stack
      _dark={{ bg: 'gray.700', color: 'whitesmoke' }}
      bg="white"
      mb="4"
      p="4"
      rounded="md"
      shadow="md"
      w="full"
    >
      <ChakraStepper colorScheme="brand" index={activeStep} size="lg" w="full">
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                active={<StepNumber />}
                complete={<StepIcon />}
                incomplete={<StepNumber />}
              />
            </StepIndicator>

            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </ChakraStepper>
    </Stack>
  );
};
