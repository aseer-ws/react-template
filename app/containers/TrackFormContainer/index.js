/**
 *
 * TrackFormContainer Container
 *
 */

import Container from '@app/components/Container';
import If from '@app/components/If';
import { T } from '@app/components/T';
import TrackModal from '@app/components/TrackFormModal';
import { submitTune } from '@app/services/tunesApi';
import history from '@app/utils/history';
import { Button, Card, Divider, Form, Input, message, notification, Space, Spin, Steps } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { memo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { fillValues, initialValues, trackFormContainerCreators } from './reducer';
import { selectFormValues } from './selectors';
import trackFormSteps, {
  DATE_FORMAT,
  FORM_LOADING_TIP,
  STEP_ROUTES,
  STEP_TITLES,
  TOTAL_STEPS,
  trackFormProps,
  TRACK_SUBMIT_FAILED,
  TRACK_SUBMIT_SUCCESS
} from './trackFormDetails';
import useFormStepRedirect from './useFormStepRedirect';

const StyledHeader = styled.header`
  height: 5rem;
  display: grid;
  align-items: center;
  padding-bottom: '2rem';
`;

const StyledHeaderText = styled(T)`
  text-align: center;
`;

const SpreadSpace = styled(Space)`
  && {
    justify-content: center;
  }
`;

const CenteredStep = styled(Steps.Step)`
  && {
    .ant-steps-item-title {
      font-size: 0.65rem;
      font-weight: bold;
    }
    .ant-steps-icon {
      top: 50%;
      transform: translateY(-50%);
      display: grid;
      place-items: center;
    }
  }
`;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export function TrackFormContainer({ maxWidth, formValues, setFormValues, resetForm, fillForm }) {
  const stepTitle = new URLSearchParams(history.location.search).get('stepTitle');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showTrack, setShowTrack] = useState(false);
  const [loadingForm, setLoadingForm] = useState(stepTitle !== 'track');

  const displayForm = () => setLoadingForm(false);
  const toggleSpin = () => setLoading((load) => !load);

  useFormStepRedirect(stepTitle, formValues, displayForm);

  const moveToStep = (step) => {
    history.push(`/add-track?stepTitle=${STEP_ROUTES[step]}`);
  };

  const handleSubmit = async (values) => {
    toggleSpin();
    setFormValues(values);
    if (stepTitle === STEP_ROUTES[TOTAL_STEPS - 1]) {
      const res = await submitTune({ ...formValues, ...values });
      if (res.ok) {
        notification.success({ message: TRACK_SUBMIT_SUCCESS });
        setShowTrack(true);
      } else {
        notification.error({ message: TRACK_SUBMIT_FAILED, description: res.data });
      }
    } else {
      moveToStep(STEP_TITLES[stepTitle] + 1);
    }
    toggleSpin();
  };

  const handleReset = () => {
    resetForm();
    form.setFieldsValue({ ...initialValues, releaseDate: moment(initialValues.releaseDate, DATE_FORMAT) });
    moveToStep(0);
  };

  const handleFillForm = () => {
    fillForm();
    form.setFieldsValue({ ...fillValues, releaseDate: moment(fillValues.releaseDate, DATE_FORMAT) });
    moveToStep(TOTAL_STEPS - 1);
  };

  const handlePrev = () => {
    moveToStep(STEP_TITLES[stepTitle] - 1);
  };

  const onFileChange = function (info) {
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imgUrl) => {
        form.setFieldsValue({ artworkUrl: imgUrl });
        message.success(`${info.file.name} file uploaded.`);
      });
    }
  };

  const formContainer = (
    <>
      <Steps
        current={STEP_TITLES[stepTitle]}
        status="process"
        data-testid="step-parent"
        style={{ marginBottom: '2rem' }}
      >
        {STEP_ROUTES.map((stepTitle, index) => (
          <CenteredStep data-testid={`${index}_step`} key={stepTitle} title={String(stepTitle).toUpperCase()} />
        ))}
      </Steps>
      <Form
        {...trackFormProps}
        form={form}
        initialValues={{ ...formValues, releaseDate: moment(formValues?.releaseDate, DATE_FORMAT) }}
        onFinish={handleSubmit}
      >
        {/* Step Form Inputs */}
        {trackFormSteps[stepTitle]?.map(({ itemProps, component: Component = Input, componentProps }) => (
          <Form.Item
            data-testid={`${itemProps.name}_test`}
            key={`loopStep_${itemProps.name}`}
            {...itemProps}
            {...(itemProps.name === 'artworkUrl' ? { getValueFromEvent: onFileChange } : {})}
          >
            <Component data-testid={itemProps.name} {...componentProps} />
          </Form.Item>
        ))}
        <SpreadSpace style={{ textAlign: 'center', width: '100%', margin: '1rem auto' }}>
          <If condition={loading}>
            <Spin />
            <T text={STEP_ROUTES[TOTAL_STEPS - 1] === stepTitle ? 'Submitting' : 'Validating'} />
          </If>
        </SpreadSpace>
        <Divider />
        {/* Form Footer/Navigator */}
        <Form.Item wrapperCol={{ span: 24 }}>
          <SpreadSpace direction="vertical" size={10} style={{ textAlign: 'center', width: '100%' }}>
            <Space>
              <Button
                data-testid="prev-btn"
                disabled={STEP_TITLES[stepTitle] === 0}
                htmlType="button"
                onClick={handlePrev}
              >
                Prev
              </Button>
              <Button data-testid="submit-btn" type="primary" htmlType="submit">
                {stepTitle === STEP_ROUTES[TOTAL_STEPS - 1] ? 'Submit' : 'Next'}
              </Button>
            </Space>
            {/* {process.env.NODE_ENV === 'development' && ( */}
            <Space>
              <>
                <Button data-testid="reset-btn" htmlType="button" onClick={handleReset}>
                  Reset
                </Button>
                <Button data-testid="fill-btn" type="dashed" htmlType="button" onClick={handleFillForm}>
                  Fill form
                </Button>
              </>
            </Space>
            {/* )} */}
          </SpreadSpace>
        </Form.Item>
      </Form>
    </>
  );

  return (
    <Container maxWidth={maxWidth}>
      <Helmet>
        <title>Add Track</title>
        <meta name="description" content="Add new Track" />
      </Helmet>
      <Card>
        <StyledHeader>
          <StyledHeaderText type="heading" id="add_track_header_text" />
        </StyledHeader>

        <Spin size="large" spinning={loadingForm} tip={FORM_LOADING_TIP}>
          {formContainer}
        </Spin>
        <TrackModal
          handleCancel={() => setShowTrack(false)}
          trackDetails={formValues}
          isVisible={showTrack}
          afterClose={handleReset}
        />
      </Card>
    </Container>
  );
}

TrackFormContainer.propTypes = {
  maxWidth: PropTypes.number.isRequired,
  formValues: PropTypes.object.isRequired,
  setFormValues: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  fillForm: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  formValues: selectFormValues()
});

const { setFormValues, fillForm, resetForm } = trackFormContainerCreators;

export function mapDispatchToProps(dispatch) {
  return {
    setFormValues: (fieldValues) => dispatch(setFormValues(fieldValues)),
    resetForm: () => dispatch(resetForm()),
    fillForm: () => dispatch(fillForm())
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(TrackFormContainer);

export const TrackFormContainerTest = compose(injectIntl)(TrackFormContainer);

// [DONE] move to next step on enter
// [DONE] remove step state. on single source of truth
// [DONE] submit next prev button mystery
// theming
// mobile experience
// accessibility
