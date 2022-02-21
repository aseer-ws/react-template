/**
 *
 * Tests for TrackFormContainer container
 *
 *
 */

import history from '@app/utils/history';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderProvider } from '@utils/testUtils';
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

const expectMessage = (baseElement, status, msg) =>
  expect(getMessageElm(baseElement, status)?.children[1].textContent).toBe(msg);

const getMessageElm = (baseElement, status) => baseElement.querySelector(`.ant-message-${status}`);
const getNotifElm = (baseElement) => baseElement.querySelector('.ant-notification-notice-content');

describe('<TrackFormContainer /> container tests', () => {
  let fillSpy;
  let resetSpy;
  let setFormSpy;
  let routeProps;

  beforeAll(() => {
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

  afterEach(async () => {
    fillSpy?.mockReset();
    resetSpy?.mockReset();
    setFormSpy?.mockReset();
    message.destroy();
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
    history.location.pathname = '/add-track/upload';
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

    const uploadInput = getByTestId('uploader');

    const dummyHTML = new File(['<h1>Welcome</h1>', '<p>World</p>'], 'index.html', { type: 'text/html' });
    fireEvent.change(uploadInput, {
      target: {
        files: [dummyHTML]
      }
    });

    await waitFor(() => expectMessage(baseElement, 'error', INVALID_TYPE_MESSAGE));
  });

  it('should show error popup message when selected file size is greater than 2MB', async () => {
    history.location.pathname = '/add-track/upload';
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

    const uploadInput = getByTestId('uploader');
    const dummyImage = new File(['somestuff'], 'camera.jpeg', { type: 'image/jpeg' });
    Object.defineProperty(dummyImage, 'size', { value: 2.1 * 1024 * 1024 });
    fireEvent.change(uploadInput, {
      target: {
        files: [dummyImage]
      }
    });

    await waitFor(() => expectMessage(baseElement, 'error', ISLT2M_MESSAGE));
  });

  it('should show message for failed image upload', async () => {
    history.location.pathname = '/add-track/upload';
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

    const uploadInput = getByTestId('uploader');
    const dummyImage = new File(['somestuff2'], 'camera.jpeg', { type: 'image/jpeg' });
    Object.defineProperty(dummyImage, 'size', { value: 10 });
    fireEvent.change(uploadInput, {
      target: {
        files: [dummyImage]
      }
    });

    await waitFor(() => expectMessage(baseElement, 'error', `${dummyImage.name} file upload failed.`));
  });

  // it('should show message for successful image upload', async () => {
  //   history.location.pathname = '/add-track/upload';
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

  //   const uploadInput = getByTestId('uploader');
  //   const dummyImage = new File(['somestuff2'], 'camera.jpeg', { type: 'image/jpeg' });
  //   fireEvent.change(uploadInput, {
  //     target: {
  //       files: [dummyImage]
  //     }
  //   });
  //   console.log({ dummyImage });

  //   await waitFor(() => expectMessage(baseElement, 'success', `${dummyImage.name} file uploaded successfully`));
  // });

  it('should submit values to dummyApi and gives success notification and opens modal', async () => {
    history.location.pathname = '/add-track/upload';
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
    const uploadInput = getByTestId('uploader');
    const dummyImage = new File(['somestuff2'], 'camera.jpeg', { type: 'image/jpeg' });
    fireEvent.change(uploadInput, {
      target: {
        files: [dummyImage]
      }
    });
    await waitFor(() => expectMessage(baseElement, 'error', `${dummyImage.name} file upload failed.`));

    const submitBtn = getByTestId('submit-btn');
    process.env.TEST_MOCK_STATUS_CODE = 200;
    fireEvent.click(submitBtn);
    await waitFor(() => expect(getNotifElm(baseElement)).toBeInTheDocument());
    await waitFor(() => expect(getByTestId('track-modal')).toBeInTheDocument());
    fireEvent.click(getByTestId('close-modal'));
    await waitFor(() => expect(history.location.pathname).toBe('/add-track/track'));
    notification.destroy();
  });

  it('should submit values to dummyApi and gives error notification', async () => {
    history.location.pathname = '/add-track/upload';
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
    const uploadInput = getByTestId('uploader');
    const dummyImage = new File(['somestuff2'], 'camera.jpeg', { type: 'image/jpeg' });
    fireEvent.change(uploadInput, {
      target: {
        files: [dummyImage]
      }
    });
    await waitFor(() => expectMessage(baseElement, 'error', `${dummyImage.name} file upload failed.`));

    const submitBtn = getByTestId('submit-btn');
    process.env.TEST_MOCK_STATUS_CODE = 400;
    fireEvent.click(submitBtn);
    await waitFor(() => expect(getNotifElm(baseElement)).toBeInTheDocument());
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
});
