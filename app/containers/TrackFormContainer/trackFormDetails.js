import React from 'react';
import { Button, message, DatePicker, InputNumber, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import For from '@app/components/For';
import { GENRE_ENUM } from './reducer';

export const DATE_FORMAT = 'YYYY-MM-DD';
export const INVALID_TYPE_MESSAGE = 'You can only upload JPG/PNG file!';
export const ISLT2M_MESSAGE = 'Image must be smaller than 2MB!';

export const FORM_LOADING_TIP = 'Validating previous step';

export const STEP_TITLES = { track: 0, collection: 1, artist: 2, upload: 3 };
export const STEP_ROUTES = Object.keys(STEP_TITLES);
export const TOTAL_STEPS = STEP_ROUTES.length;

export const TRACK_SUBMIT_SUCCESS = 'Track submit success';
export const TRACK_SUBMIT_FAILED = 'Track submit failed';

export const trackFormSteps = {
  track: [
    {
      itemProps: {
        name: 'trackName',
        label: 'Track Name',
        rules: [{ required: true, whitespace: true }]
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
        rules: [{ required: true }]
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
  collection: [
    {
      itemProps: {
        name: 'collectionName',
        label: 'Collection Name',
        rules: [{ required: true, whitespace: true }]
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
  artist: [
    {
      itemProps: {
        name: 'artistName',
        label: 'Artist Name',
        rules: [{ required: true, whitespace: true }]
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
  upload: [
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
        action: 'todos',
        customRequest: ({ onSuccess }) => {
          onSuccess();
        },
        children: (
          <Button data-testid="upload-dummy-btn" icon={<UploadOutlined />}>
            Click to Upload
          </Button>
        )
      }
    }
  ]
};

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

const validateMessages = {
  required: '${label} is required!',
  enum: '${label} must be one of',
  whitespace: '${label} cannot be empty',
  types: {
    number: '${label} is not a valid number!',
    url: '${label} is not a valid url!'
  },
  number: {
    range: '${label} must be between ${min} and ${max}'
  }
};

export const trackFormProps = {
  id: 'track-form',
  layout: 'horizontal',
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
  validateMessages
};

export default trackFormSteps;
