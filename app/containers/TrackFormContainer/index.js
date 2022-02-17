/**
 *
 * TrackFormContainer Container
 *
 */

import { ArrowLeftOutlined, ArrowRightOutlined, UploadOutlined } from '@ant-design/icons';
import Container from '@app/components/Container';
import For from '@app/components/For';
import { T } from '@app/components/T';
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Space,
  Steps,
  Upload
} from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';

const StyledHeader = styled.header`
  height: 5rem;
  display: grid;
  align-items: center;
  padding-bottom: '2rem';
`;

const StyledHeaderText = styled(T)`
  text-align: center;
`;

const CenterButton = styled(Button)`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const SpreadSpace = styled(Space)`
  && {
    justify-content: center;
  }
`;

const UnstyledButton = styled.button`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
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

const GENRE_ENUM = ['Jaz', 'HipHop', 'Electronics', 'Pop'];

const trackFormDetails = {
  initialValues: {
    trackName: '',
    trackPrice: 1,
    primaryGenreName: GENRE_ENUM[0],
    releaseDate: moment('2021-10-09', 'YYYY-MM-DD'),
    trackViewUrl: '',
    collectionName: '',
    collectionPrice: 2,
    collectionViewUrl: '',
    artistName: '',
    artistViewUrl: '',
    artworkUrl: ''
  },
  fillValues: {
    trackName: 'Track A',
    trackPrice: 2,
    primaryGenreName: GENRE_ENUM[0],
    releaseDate: moment('2022-01-09', 'YYYY-MM-DD'),
    trackViewUrl: 'https://tracka.com',
    collectionName: 'Collection B',
    collectionPrice: 12,
    collectionViewUrl: 'https://collectionb.com',
    artistName: 'Artist C',
    artistViewUrl: 'https://artistc.com',
    artworkUrl: ''
  },
  steps: {
    0: {
      trackName: {
        itemProps: {
          name: 'trackName',
          label: 'Track Name',
          rules: [{ required: true }]
        },
        componentProps: {
          placeholder: 'Fill in track name'
        }
      },
      trackPrice: {
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
      trackGenre: {
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
      releaseDate: {
        itemProps: {
          name: 'releaseDate',
          label: 'Release Date',
          rules: [{ required: true, type: 'date' }]
        },
        component: DatePicker
      },
      trackViewUrl: {
        itemProps: {
          name: 'trackViewUrl',
          label: 'Track URL',
          rules: [{ required: true, type: 'url' }]
        },
        componentProps: {
          placeholder: 'https://track.com'
        }
      }
    },
    1: {
      collectionName: {
        itemProps: {
          name: 'collectionName',
          label: 'Collection Name',
          rules: [{ required: true }]
        },
        componentProps: {
          placeholder: 'Fill in collection name'
        }
      },
      collectionPrice: {
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
      collectionViewUrl: {
        itemProps: {
          name: 'collectionViewUrl',
          label: 'Collection URL',
          rules: [{ required: true, type: 'url' }]
        },
        componentProps: {
          placeholder: 'https://collection.com'
        }
      }
    },
    2: {
      artistName: {
        itemProps: {
          name: 'artistName',
          label: 'Artist Name',
          rules: [{ required: true }]
        },
        componentProps: {
          placeholder: 'Fill in artist name'
        }
      },
      artistViewUrl: {
        itemProps: {
          name: 'artistViewUrl',
          label: 'Artist URL',
          rules: [{ required: true, type: 'url' }]
        },
        componentProps: {
          placeholder: 'https://artist.com'
        }
      }
    },
    3: {
      artworkUrl: {
        itemProps: {
          name: 'artworkUrl',
          label: 'Track Image',
          rules: [{ required: true }]
        },
        component: Upload,
        componentProps: {
          beforeUpload,
          children: <Button icon={<UploadOutlined />}>Click to Upload</Button>
        }
      }
    }
  }
};

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const totalSteps = Object.keys(trackFormDetails.steps).length;

export function TrackFormContainer({ maxWidth }) {
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);

  function handleSubmit(values) {
    alert(JSON.stringify(values));
  }

  function handleReset() {
    form.resetFields();
  }

  function handleFillForm() {
    form.setFieldsValue(trackFormDetails.fillValues);
  }

  function prev() {
    setStep(step - 1);
  }

  async function next(e) {
    const namePaths = Object.values(trackFormDetails.steps[step]).map((entry) => entry.itemProps.name);

    try {
      await form.validateFields(namePaths);
      setStep(step + 1);
    } catch (errorInfo) {
      // do nothing
    }
  }

  async function handleStepChange(targetStep) {
    if (targetStep > step + 1) {
      return;
    }
    if (targetStep > step) {
      const namePaths = Object.values(trackFormDetails.steps[step]).map((entry) => entry.itemProps.name);

      try {
        await form.validateFields(namePaths);
      } catch (errorInfo) {
        return;
      }
    }
    setStep(targetStep);
  }

  function onFileChange(info) {
    if (info.file.status !== 'uploading') {
      message.info(info.file.name, info.fileList);
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imgUrl) => {
        form.setFieldsValue({ artworkUrl: imgUrl });
        message.success(`${info.file.name} file uploaded successfully`);
      });
    } else if (info.file.status === 'error') {
      getBase64(info.file.originFileObj, (imgUrl) => {
        form.setFieldsValue({ artworkUrl: imgUrl });
        message.error(`${info.file.name} file upload failed.`);
      });
    }
  }

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

        {/* Form */}
        <Form
          id="track-form"
          form={form}
          layout="horizontal"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          initialValues={trackFormDetails.initialValues}
          validateMessages={validateMessages}
          validateTrigger={['onChange', 'onBlur']}
          onFinish={handleSubmit}
        >
          {/* Steps */}
          <Steps
            size="large"
            current={step}
            status="process"
            style={{ marginBottom: '2rem' }}
            onChange={handleStepChange}
          >
            {['Track', 'Collection', 'Artist', 'Upload'].map((stepTitle) => (
              <Steps.Step key={stepTitle} title={<UnstyledButton>{stepTitle}</UnstyledButton>} />
            ))}
          </Steps>
          {/* Step Form Inputs */}
          {new Array(totalSteps).fill(0).map((_, loopStep) =>
            Object.values(trackFormDetails.steps[loopStep]).map(
              ({ itemProps, component: Component = Input, componentProps }) => (
                <Form.Item
                  style={{ display: loopStep !== step && 'none' }}
                  key={`loopStep_${itemProps.name}`}
                  {...itemProps}
                >
                  <Component
                    {...componentProps}
                    {...(itemProps.name === 'artworkUrl' ? { onChange: onFileChange } : {})}
                  />
                </Form.Item>
              )
            )
          )}

          <Divider />
          {/* Form Footer/Navigator */}
          <Form.Item wrapperCol={{ span: 24 }}>
            <SpreadSpace style={{ textAlign: 'center', width: '100%' }}>
              <CenterButton
                size="large"
                disabled={step === 0}
                htmlType="button"
                onClick={prev}
                shape="circle"
                icon={<ArrowLeftOutlined />}
              />
              <Button disabled={step !== totalSteps - 1} type="primary" htmlType="submit">
                Submit
              </Button>
              <Button htmlType="button" onClick={handleReset}>
                Reset
              </Button>
              <Button type="dashed" htmlType="button" onClick={handleFillForm}>
                Fill form
              </Button>
              <CenterButton
                size="large"
                disabled={step === totalSteps - 1}
                htmlType="button"
                onClick={next}
                shape="circle"
                icon={<ArrowRightOutlined />}
              />
            </SpreadSpace>
          </Form.Item>
        </Form>
      </Card>
    </Container>
  );
}

TrackFormContainer.propTypes = {
  maxWidth: PropTypes.number
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(TrackFormContainer);

export const TrackFormContainerTest = compose(injectIntl)(TrackFormContainer);
