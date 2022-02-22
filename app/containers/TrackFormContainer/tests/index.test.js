/**
 *
 * Tests for TrackFormContainer container
 *
 *
 */

import history from '@app/utils/history';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderProvider, timeout } from '@utils/testUtils';
import { message, notification } from 'antd';
import React from 'react';
import {
  INVALID_TYPE_MESSAGE,
  ISLT2M_MESSAGE,
  mapDispatchToProps,
  TrackFormContainerTest as TrackFormContainer,
  trackFormSteps
} from '../index';
import { initialValues, trackFormContainerCreators } from '../reducer';

const getMessageElm = (baseElement, status) => baseElement.querySelector(`.ant-message-${status}`);
const getNotifElm = (baseElement) => baseElement.querySelector('.ant-notification-notice-content');

const notificationContentClass = '.ant-notification-notice-content';

const expectMessage = (baseElement, status, msg) => {
  return expect(getMessageElm(baseElement, status)?.children[1].textContent).toBe(msg);
};
describe('<TrackFormContainer /> container tests', () => {
  let fillSpy;
  let resetSpy;
  let setFormSpy;
  let routeProps;
  let dummyFile;

  beforeAll(() => {
    // jest.useFakeTimers();
    window.HTMLCanvasElement.prototype.getContext = function () {};
    window.URL.createObjectURL = function () {};
    history.location.pathname = '/add-track/track';
    fillSpy = jest.fn();
    resetSpy = jest.fn();
    setFormSpy = jest.fn();

    routeProps = {
      history,
      path: '/add-track/:stepTitle?'
    };
  });

  afterEach(() => {
    fillSpy?.mockReset();
    resetSpy?.mockReset();
    setFormSpy?.mockReset();
    message.destroy();
    notification.destroy();
    // jest.useRealTimers();
  });

  it('should render and match the snapshot', () => {
    const { baseElement } = renderProvider(
      <TrackFormContainer
        formValues={initialValues}
        fillForm={fillSpy}
        resetForm={resetSpy}
        setFormValues={setFormSpy}
        maxWidth={800}
      />,
      routeProps
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should redirect first step if stepTitle params id is not provided', async () => {
    history.location.pathname = '/add-track';
    renderProvider(
      <TrackFormContainer
        formValues={initialValues}
        fillForm={fillSpy}
        resetForm={resetSpy}
        setFormValues={setFormSpy}
        maxWidth={800}
      />,
      routeProps
    );
    await waitFor(() => expect(history.location.pathname).toBe('/add-track/track'));
  });

  it('should not move the next step if clicked on next step button without filling in data', async () => {
    const { getByTestId } = renderProvider(
      <TrackFormContainer
        formValues={initialValues}
        fillForm={fillSpy}
        resetForm={resetSpy}
        setFormValues={setFormSpy}
        maxWidth={800}
      />,
      routeProps
    );
    await waitFor(() => expect(history.location.pathname).toBe('/add-track/track'));
    const nextbtn = getByTestId('submit-btn');
    fireEvent.click(nextbtn);
    await waitFor(() => expect(history.location.pathname).toBe('/add-track/track'));
  });

  it('should move to the next step if clicked on next step button with valid form data', async () => {
    const { getByTestId } = renderProvider(
      <TrackFormContainer
        formValues={initialValues}
        fillForm={fillSpy}
        resetForm={resetSpy}
        setFormValues={setFormSpy}
        maxWidth={800}
      />,
      routeProps
    );
    await waitFor(() => expect(history.location.pathname).toBe('/add-track/track'));

    // validate current step fields to success
    fireEvent.change(document.getElementById('trackName'), { target: { value: 'Track A' } });
    fireEvent.change(document.getElementById('trackViewUrl'), { target: { value: 'https://tracka.com' } });

    const nextbtn = getByTestId('submit-btn');
    fireEvent.click(nextbtn);
    await waitFor(() => expect(history.location.pathname).toBe('/add-track/collection'));
  });

  it('should fill the form and move to step 4 if clicked fill btn', async () => {
    const { getByTestId } = renderProvider(
      <TrackFormContainer
        formValues={initialValues}
        fillForm={fillSpy}
        resetForm={resetSpy}
        setFormValues={setFormSpy}
        maxWidth={800}
      />,
      routeProps
    );
    const fillBtn = getByTestId('fill-btn');
    fireEvent.click(fillBtn);
    const formItemToBeDisplayed = getByTestId(`${trackFormSteps[3][0].itemProps.name}_test`);
    expect(formItemToBeDisplayed).toBeInTheDocument();
  });

  it('should move to previous step if clicked on previous button', async () => {
    history.location.pathname = '/add-track/collection';
    const { getByTestId } = renderProvider(
      <TrackFormContainer
        formValues={initialValues}
        fillForm={fillSpy}
        resetForm={resetSpy}
        setFormValues={setFormSpy}
        maxWidth={800}
      />,
      routeProps
    );
    const prevBtn = getByTestId('prev-btn');
    fireEvent.click(prevBtn);
    await waitFor(() => expect(history.location.pathname).toBe('/add-track/track'));
  });

  it('should reset the form back to initialValues if clicked on reset button', async () => {
    const { getByTestId } = renderProvider(
      <TrackFormContainer
        formValues={initialValues}
        fillForm={fillSpy}
        resetForm={resetSpy}
        setFormValues={setFormSpy}
        maxWidth={800}
      />,
      routeProps
    );
    const fillBtn = getByTestId('fill-btn');
    fireEvent.click(fillBtn);
    const resetBtn = getByTestId('reset-btn');
    fireEvent.click(resetBtn);
    await waitFor(() => expect(history.location.pathname).toBe('/add-track/track'));
    const loopField = ['trackName', 'trackViewUrl'];
    for (let key of loopField) {
      expect(document.getElementById(key).value).toEqual(String(initialValues[key]));
    }
  });

  it('should show invalid file type message when selected file is not of type image', async () => {
    const { baseElement, getByTestId, getByText } = renderProvider(
      <TrackFormContainer
        formValues={initialValues}
        fillForm={fillSpy}
        resetForm={resetSpy}
        setFormValues={setFormSpy}
        maxWidth={800}
      />,
      routeProps
    );
    const fillBtn = getByTestId('fill-btn');
    fireEvent.click(fillBtn);
    await waitFor(() => expect(history.location.pathname).toBe('/add-track/upload'));

    const uploadInput = getByTestId('uploader');

    dummyFile = new File(['<h1>Welcome</h1>', '<p>World</p>'], 'index.html', { type: 'text/html' });
    fireEvent.change(uploadInput, {
      target: {
        files: [dummyFile]
      }
    });

    await waitFor(() => expectMessage(baseElement, 'error', INVALID_TYPE_MESSAGE));
  });

  it('should show error popup message when selected file size is greater than 2MB', async () => {
    const { baseElement, getByTestId } = renderProvider(
      <TrackFormContainer
        formValues={initialValues}
        fillForm={fillSpy}
        resetForm={resetSpy}
        setFormValues={setFormSpy}
        maxWidth={800}
      />,
      routeProps
    );
    const fillBtn = getByTestId('fill-btn');
    fireEvent.click(fillBtn);
    await waitFor(() => expect(history.location.pathname).toBe('/add-track/upload'));

    const uploadInput = getByTestId('uploader');
    dummyFile = new File(['somestuff'], 'camera.jpeg', { type: 'image/jpeg' });
    Object.defineProperty(dummyFile, 'size', { value: 2.1 * 1024 * 1024 });
    fireEvent.change(uploadInput, {
      target: {
        files: [dummyFile]
      }
    });

    await waitFor(() => expectMessage(baseElement, 'error', ISLT2M_MESSAGE));
  });

  // it.only('should show message for failed image upload', async () => {
  //   const { baseElement, getByTestId } = renderProvider(
  //     <TrackFormContainer
  //       formValues={initialValues}
  //       fillForm={fillSpy}
  //       resetForm={resetSpy}
  //       setFormValues={setFormSpy}
  //       maxWidth={800}
  //     />,
  //     routeProps
  //   );
  //   const fillBtn = getByTestId('fill-btn');
  //   fireEvent.click(fillBtn);
  //   await waitFor(() => expect(history.location.pathname).toBe('/add-track/upload'));

  //   const uploadInput = getByTestId('uploader');
  //   dummyFile = new File(['somestuff2'], 'camera.jpeg', { type: 'image/jpeg' });
  //   Object.defineProperty(dummyFile, 'size', { value: 10 });
  //   fireEvent.change(uploadInput, {
  //     target: {
  //       files: [dummyFile]
  //     }
  //   });
  //   await waitFor(() => expectMessage(baseElement, 'error', `${dummyFile.name} file upload failed.`));
  // });

  it('should submit values to dummyApi and gives error notification', async () => {
    const { getByTestId, baseElement, getByText } = renderProvider(
      <TrackFormContainer
        formValues={initialValues}
        fillForm={fillSpy}
        resetForm={resetSpy}
        setFormValues={setFormSpy}
        maxWidth={800}
      />,
      routeProps
    );
    const fillBtn = getByTestId('fill-btn');
    fireEvent.click(fillBtn);
    await waitFor(() => expect(history.location.pathname).toBe('/add-track/upload'));

    const uploadInput = getByTestId('uploader');
    dummyFile = new File(['somestuff2'], 'camera.jpeg', { type: 'image/jpeg' });
    fireEvent.change(uploadInput, {
      target: {
        files: [dummyFile]
      }
    });
    await waitFor(() => expect(getByText(INVALID_TYPE_MESSAGE)).not.toBeNull());

    // await waitFor(() => expectMessage(baseElement, 'error', `${dummyFile.name} file upload failed.`));

    const submitBtn = getByTestId('submit-btn');
    process.env.TEST_MOCK_STATUS_CODE = 400;
    fireEvent.click(submitBtn);
    await waitFor(() => expect(baseElement.querySelector(notificationContentClass)).toBeInTheDocument());
  });

  it('should maptchDispatchToProps should dispatch action of specific type', () => {
    let dispatchSpy = jest.fn();
    const { setFormValues, resetForm, fillForm } = trackFormContainerCreators;
    const props = mapDispatchToProps(dispatchSpy);

    props.setFormValues({ artworkUrl: 'https://image.com' });
    expect(dispatchSpy).toBeCalledWith(setFormValues({ artworkUrl: 'https://image.com' }));
    props.fillForm();
    expect(dispatchSpy).toBeCalledWith(fillForm());
    props.resetForm();
    expect(dispatchSpy).toBeCalledWith(resetForm());
  });

  it('should submit values to dummyApi and gives success notification and opens modal and resets form on closing', async () => {
    const { getByTestId, baseElement } = renderProvider(
      <TrackFormContainer
        formValues={initialValues}
        fillForm={fillSpy}
        resetForm={resetSpy}
        setFormValues={setFormSpy}
        maxWidth={800}
      />,
      routeProps
    );
    const fillBtn = getByTestId('fill-btn');
    fireEvent.click(fillBtn);
    await waitFor(() => expect(history.location.pathname).toBe('/add-track/upload'));

    const uploadInput = getByTestId('uploader');
    dummyFile = new File(['abcde', 'sutffagain'], 'camera1.jpeg', { type: 'image/jpeg' });
    fireEvent.change(uploadInput, {
      target: {
        files: [dummyFile]
      }
    });
    await timeout(200);
    await waitFor(() => expectMessage(baseElement, 'error', `${dummyFile.name} file upload failed.`));

    const submitBtn = getByTestId('submit-btn');
    process.env.TEST_MOCK_STATUS_CODE = 200;
    fireEvent.click(submitBtn);
    await waitFor(() => expect(getNotifElm(baseElement)).toBeInTheDocument());
    await waitFor(() => expect(getByTestId('track-modal')).toBeInTheDocument());
    fireEvent.click(getByTestId('close-modal'));
    await waitFor(() => expect(history.location.pathname).toBe('/add-track/track'));
  });

  // it('should submit values to dummyApi and gives error notification', async () => {
  //   const { getByTestId, baseElement, debug } = renderProvider(
  //     <TrackFormContainer
  //       formValues={initialValues}
  //       fillForm={fillSpy}
  //       resetForm={resetSpy}
  //       setFormValues={setFormSpy}
  //       maxWidth={800}
  //     />,
  //     routeProps
  //   );
  //   const fillBtn = getByTestId('fill-btn');
  //   fireEvent.click(fillBtn);
  //   await waitFor(() => expect(history.location.pathname).toBe('/add-track/upload'));

  //   const uploadInput = getByTestId('uploader');
  //   dummyFile = new File(['somestuff2'], 'camera.jpeg', { type: 'image/jpeg' });
  //   fireEvent.change(uploadInput, {
  //     target: {
  //       files: [dummyFile]
  //     }
  //   });
  //   debug();
  //   await waitFor(() => expectMessage(baseElement, 'error', `${dummyFile.name} file upload failed.`));

  //   const submitBtn = getByTestId('submit-btn');
  //   process.env.TEST_MOCK_STATUS_CODE = 400;
  //   fireEvent.click(submitBtn);
  //   await waitFor(() => expect(getNotifElm(baseElement)).toBeInTheDocument());
  // });
});
