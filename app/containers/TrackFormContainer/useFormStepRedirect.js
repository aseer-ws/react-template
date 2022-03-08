import { useEffect } from 'react';
import trackFormSteps, { STEP_ROUTES, STEP_TITLES } from './trackFormDetails';
import { defaultValidateMessages } from 'rc-field-form/lib/utils/messages';
import { validateRules } from 'rc-field-form/lib/utils/validateUtil';
import history from '@app/utils/history';

export default function useFormStepRedirect(stepTitle, formValues, displayForm) {
  async function validatePrevSteps(currentStep) {
    const namePaths = [];
    const pathValues = [];
    const pathRules = [];

    STEP_ROUTES.slice(0, currentStep).forEach((step) => {
      const steps = Object.values(trackFormSteps[step]);
      for (let step of steps) {
        const { rules, name } = step.itemProps;
        namePaths.push([name]);
        pathValues.push(formValues[name]);
        pathRules.push(rules);
      }
    });
    if (namePaths.length) {
      try {
        const promises = namePaths.map(async (namePath, index) => {
          // console.log({ namePath, value: pathValues[index], rules: pathRules[index] });
          await validateRules(namePath, pathValues[index], pathRules[index], {
            validateMessages: { ...defaultValidateMessages }
          });
        });
        await Promise.all(promises);
        displayForm();
      } catch (errInfo) {
        history.replace({ pathname: '/add-track', search: '?stepTitle=track' });
      }
    }
  }

  useEffect(() => {
    if (!STEP_ROUTES.includes(stepTitle)) {
      stepTitle = 'track';
      history.replace({ pathname: '/add-track', search: '?stepTitle=track' });
    } else {
      if (STEP_TITLES[stepTitle] === 0) {
        displayForm();
      } else {
        validatePrevSteps(STEP_TITLES[stepTitle]);
      }
    }
  }, []);
}
