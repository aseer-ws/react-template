/**
 *
 * TrackFormContainer Container
 *
 */

import { UploadOutlined } from '@ant-design/icons';
import Container from '@app/components/Container';
import For from '@app/components/For';
import { T } from '@app/components/T';
import TrackModal from '@app/components/TrackFormModal';
import history from '@app/utils/history';
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  notification,
  Select,
  Space,
  Spin,
  Steps,
  Upload
} from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import uploadTrackApi from './mockApi';
import { fillValues, GENRE_ENUM, initialValues, trackFormContainerCreators } from './reducer';
import { selectFormValues } from './selectors';

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

const validateMessages = {
  required: '${label} is required!',
  enum: '${label} must be one of',
  types: {
    number: '${label} is not a valid number!',
    url: '${label} is not a valid url!'
  },
  number: {
    range: '${label} must be between ${min} and ${max}'
  }
};

export const trackFormSteps = {
  0: [
    {
      itemProps: {
        name: 'trackName',
        label: 'Track Name',
        rules: [{ required: true }]
      },
      componentProps: {
        placeholder: 'Fill in track name'
      }
    },
    {
      itemProps: {
        name: 'trackPrice',
        label: 'Track Price',
        rules: [{ required: true, type: 'number' }]
      },
      componentProps: {
        placeholder: 'Fill in track price',
        min: 0
        // addonAfter: <Tooltip title="Price in USD">$</Tooltip>
      },
      component: InputNumber
    },
    {
      itemProps: {
        name: 'primaryGenreName',
        label: 'Track Genre',
        rules: [{ required: true, type: 'enum', enum: GENRE_ENUM }]
      },
      componentProps: {
        ParentComponent: (props) => <Select {...props} />,
        of: GENRE_ENUM,
        renderItem: (item) => <Select.Option value={item}>{item}</Select.Option>
      },
      component: For
    },
    {
      itemProps: {
        name: 'releaseDate',
        label: 'Release Date',
        rules: [{ required: true, type: 'date' }]
      },
      component: DatePicker,
      componentProps: {
        dateFormat: DATE_FORMAT
      }
    },
    {
      itemProps: {
        name: 'trackViewUrl',
        label: 'Track URL',
        rules: [{ required: true, type: 'url' }]
      },
      componentProps: {
        placeholder: 'https://track.com'
      }
    }
  ],
  1: [
    {
      itemProps: {
        name: 'collectionName',
        label: 'Collection Name',
        rules: [{ required: true }]
      },
      componentProps: {
        placeholder: 'Fill in collection name'
      }
    },
    {
      itemProps: {
        name: 'collectionPrice',
        label: 'Collection Price',
        rules: [{ required: true, type: 'number' }]
      },
      componentProps: {
        placeholder: 'Fill in collection price',
        min: 0
        // addonAfter: <Tooltip title="Price in USD">$</Tooltip>
      },
      component: InputNumber
    },
    {
      itemProps: {
        name: 'collectionViewUrl',
        label: 'Collection URL',
        rules: [{ required: true, type: 'url' }]
      },
      componentProps: {
        placeholder: 'https://collection.com'
      }
    }
  ],
  2: [
    {
      itemProps: {
        name: 'artistName',
        label: 'Artist Name',
        rules: [{ required: true }]
      },
      componentProps: {
        placeholder: 'Fill in artist name'
      }
    },
    {
      itemProps: {
        name: 'artistViewUrl',
        label: 'Artist URL',
        rules: [{ required: true, type: 'url' }]
      },
      componentProps: {
        placeholder: 'https://artist.com'
      }
    }
  ],
  3: [
    {
      itemProps: {
        name: 'artworkUrl',
        label: 'Track Image',
        // valuePropName: 'fileList',
        rules: [{ required: true }],
        extra: 'Only supports JPEG/PNG file'
      },
      component: Upload,
      componentProps: {
        'data-testid': 'uploader',
        listType: 'picture',
        maxCount: 1,
        beforeUpload,
        children: (
          <Button data-testid="upload-dummy-btn" icon={<UploadOutlined />}>
            Click to Upload
          </Button>
        )
      }
    }
  ]
};

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export const INVALID_TYPE_MESSAGE = 'You can only upload JPG/PNG file!';
export const ISLT2M_MESSAGE = 'Image must be smaller than 2MB!';

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error(INVALID_TYPE_MESSAGE);
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error(ISLT2M_MESSAGE);
  }

  return isJpgOrPng && isLt2M;
}

const STEP_TITLES = { track: 0, collection: 1, artist: 2, upload: 3 };
const STEP_ROUTES = Object.keys(STEP_TITLES);
const TOTAL_STEPS = STEP_ROUTES.length;

export const DATE_FORMAT = 'YYYY-MM-DD';

export function TrackFormContainer({ maxWidth, formValues, setFormValues, resetForm, fillForm }) {
  const { stepTitle } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showTrack, setShowTrack] = useState(false);

  useEffect(() => {
    if (!STEP_ROUTES.includes(stepTitle)) {
      history.replace(`/add-track/${STEP_ROUTES[0]}`);
    }
  }, [stepTitle]);

  const toggleSpin = () => setLoading((load) => !load);

  function moveToStep(step) {
    history.push(`/add-track/${STEP_ROUTES[step]}`);
  }

  async function handleSubmit(values) {
    toggleSpin();
    setFormValues(values);
    if (stepTitle === STEP_ROUTES[TOTAL_STEPS - 1]) {
      const res = await uploadTrackApi({ ...formValues, ...values });
      if (res.ok) {
        notification.success({ message: 'Track upload success' });
        setShowTrack(true);
      } else {
        notification.error({ message: 'Track upload failed', description: res.data });
      }
    } else {
      moveToStep(STEP_TITLES[stepTitle] + 1);
    }
    toggleSpin();
  }

  function handleReset() {
    resetForm();
    form.setFieldsValue({ ...initialValues, releaseDate: moment(initialValues.releaseDate, DATE_FORMAT) });
    moveToStep(0);
  }

  function handleFillForm() {
    fillForm();
    form.setFieldsValue({ ...fillValues, releaseDate: moment(fillValues.releaseDate, DATE_FORMAT) });
    moveToStep(TOTAL_STEPS - 1);
  }

  function handlePrev() {
    moveToStep(STEP_TITLES[stepTitle] - 1);
  }

  const onFileChange = useCallback(function (info) {
    if (info.file.status !== 'uploading') {
      message.info(info.file.name);
    }
    if (info.file.status === 'error') {
      getBase64(info.file.originFileObj, (imgUrl) => {
        form.setFieldsValue({ artworkUrl: imgUrl });
        message.error(`${info.file.name} file upload failed.`);
      });
    }
  }, []);

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
        {/* Steps */}
        <Steps
          current={STEP_TITLES[stepTitle || 'track']}
          status="process"
          data-testid="step-parent"
          style={{ marginBottom: '2rem' }}
        >
          {STEP_ROUTES.map((stepTitle, index) => (
            <CenteredStep data-testid={`${index}_step`} key={stepTitle} title={String(stepTitle).toUpperCase()} />
          ))}
        </Steps>

        {/* Form */}
        <Form
          id="track-form"
          form={form}
          layout="horizontal"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          initialValues={{ ...formValues, releaseDate: moment(formValues?.releaseDate, DATE_FORMAT) }}
          validateMessages={validateMessages}
          onFinish={handleSubmit}
          data-modal={showTrack}
        >
          {/* Step Form Inputs */}
          {trackFormSteps[STEP_TITLES[stepTitle || 'track']]?.map(
            ({ itemProps, component: Component = Input, componentProps }) => (
              <Form.Item
                data-testid={`${itemProps.name}_test`}
                key={`loopStep_${itemProps.name}`}
                {...itemProps}
                {...(itemProps.name === 'artworkUrl' ? { getValueFromEvent: onFileChange } : {})}
              >
                <Component data-testid={itemProps.name} {...componentProps} />
              </Form.Item>
            )
          )}
          <SpreadSpace style={{ textAlign: 'center', width: '100%', margin: '1rem auto' }}>
            {loading && (
              <>
                <Spin />
                <T text={STEP_ROUTES[TOTAL_STEPS - 1] === stepTitle ? 'Submitting' : 'Validating'} />
              </>
            )}
          </SpreadSpace>

          <Divider />
          {/* Form Footer/Navigator */}
          <Form.Item wrapperCol={{ span: 24 }}>
            <SpreadSpace direction="vertical" size={10} style={{ textAlign: 'center', width: '100%' }}>
              <Space>
                <Button
                  data-testid="prev-btn"
                  disabled={STEP_TITLES[stepTitle || 'track'] === 0}
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
