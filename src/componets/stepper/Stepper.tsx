import {
  Box,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper as ChakraStepper,
  useSteps,
  Button,
} from '@chakra-ui/react';

const steps = [
  { title: 'Paso Uno', description: 'Seleccionar productos' },
  { title: 'Second', description: 'Date & Time' },
  { title: 'Third', description: 'Select Rooms' },
];

function Example() {
  const {
    goToNext,
    goToPrevious,
    getStatus,
    isActiveStep,
    isCompleteStep,
    isIncompleteStep,
    activeStep,
  } = useSteps({
    index: 1,
    count: steps.length,
  });

  return (
    <>
      <ChakraStepper index={activeStep} size="lg">
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
      <Button isDisabled={activeStep === 1} onClick={() => goToPrevious()}>
        Back
      </Button>
      <Button onClick={() => goToNext()}>Next</Button>
      <pre>activeStep: {JSON.stringify(activeStep, null, 2)}</pre>
      <pre>isActiveStep(3): {JSON.stringify(isActiveStep(3), null, 2)}</pre>
      <pre>getStatus(3): {JSON.stringify(getStatus(3), null, 2)}</pre>
      <pre>isCompleteStep(2): {JSON.stringify(isCompleteStep(2), null, 2)}</pre>
      <pre>isIncompleteStep(2): {JSON.stringify(isIncompleteStep(2), null, 2)}</pre>
      {activeStep == 1 && <h1>PASO UNO</h1>}
      {activeStep == 2 && <h1>PASO DOS</h1>}
      {activeStep == 3 && <h1>PASO TRES</h1>}
    </>
  );
}

export const Stepper = () => {
  return (
    <>
      <Example />
    </>
  );
};
