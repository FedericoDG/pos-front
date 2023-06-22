import {
  Box,
  Stack,
  Step,
  Stepper as ChakraStepper,
  StepIndicator,
  StepStatus,
  StepNumber,
  StepIcon,
  StepTitle,
  StepDescription,
  StepSeparator,
} from '@chakra-ui/react';

import { useDischargesContext } from '.';

export const Steps = () => {
  const { steps, activeStep } = useDischargesContext();

  return (
    <Stack
      _dark={{ bg: 'gray.700', color: 'whitesmoke' }}
      bg="white"
      mb="4"
      p="4"
      rounded="md"
      shadow="md"
      w="1080px"
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
