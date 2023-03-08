import { ReactNode, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const stepsDefault = [
  'Sign up with your preferred credentials',
  'Complete registration',
  'Increase your chance to win',
];

interface MadStepperProps {
  steps: Array<string>;
  activeStep: number;
}

const MadStepper: React.FC<MadStepperProps> = ({ steps = stepsDefault, activeStep }) => {
  const [skipped, setSkipped] = useState(new Set());

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => {
          let stepProps: {
            completed?: boolean;
          } = {};
          let labelProps: { optional?: string | ReactNode } = {};
          if (isStepOptional(index)) {
            labelProps['optional'] = <Typography variant="caption">Optional</Typography>;
          }
          if (isStepSkipped(index)) {
            stepProps['completed'] = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel className="desc-label">
                {index <= activeStep ? (
                  <span className="!text-primary-60">{label}</span>
                ) : (
                  <span className="!text-archive-Neutral-Variant60">{label}</span>
                )}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default MadStepper;
