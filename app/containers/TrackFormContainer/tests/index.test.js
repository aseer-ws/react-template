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
import { mapDispatchToProps, TrackFormContainerTest as TrackFormContainer } from '../index';
import { initialValues, trackFormContainerCreators } from '../reducer';
import { INVALID_TYPE_MESSAGE, ISLT2M_MESSAGE, TRACK_SUBMIT_FAILED, TRACK_SUBMIT_SUCCESS } from '../trackFormDetails';

describe('<TrackFormContainer /> container tests', () => {
  let fillSpy;
  let resetSpy;
  let setFormSpy;
  let routeProps;
  let dummyFile;

  beforeAll(() => {
    window.HTMLCanvasElement.prototype.getContext = function () {};
    window.URL.createObjectURL = function () {};
    fillSpy = jest.fn();
    resetSpy = jest.fn();
    setFormSpy = jest.fn();

    routeProps = {
      history,
      path: '/add-track'
    };
  });
  beforeEach(() => {
    history.location.pathname = '/add-track';
    history.location.search = '?stepTitle=track';
  });

  afterEach(() => {
    fillSpy?.mockReset();
    resetSpy?.mockReset();
    setFormSpy?.mockReset();
    message.destroy();
    notification.destroy();
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

  it('should redirect first step if stepTitle query param is not provided', async () => {
    history.location.search = '';
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
    await waitFor(() => expect(history.location.search).toBe('?stepTitle=track'));
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
    await timeout(300);

    const nextbtn = getByTestId('submit-btn');
    fireEvent.click(nextbtn);
    await waitFor(() => expect(history.location.search).toBe('?stepTitle=track'));
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

    // await waitFor(() => getByText(FORM_LOADING_TIP).not.toBeInTheDocument());
    await timeout(300);

    // validate current step fields to success
    fireEvent.change(document.getElementById('trackName'), { target: { value: 'Track A' } });
    fireEvent.change(document.getElementById('trackViewUrl'), { target: { value: 'https://tracka.com' } });

    const nextbtn = getByTestId('submit-btn');
    fireEvent.click(nextbtn);
    await waitFor(() => expect(history.location.search).toBe('?stepTitle=collection'));
  });

  it('should be able to move to second step through url if first if already form fields are valid', async () => {
    const { rerender, getByTestId } = renderProvider(
      <TrackFormContainer
        formValues={initialValues}
        fillForm={fillSpy}
        resetForm={resetSpy}
        setFormValues={setFormSpy}
        maxWidth={800}
      />,
      routeProps
    );

    await timeout(300);

    // validate current step fields to success
    fireEvent.change(document.getElementById('trackName'), { target: { value: 'Track A' } });
    fireEvent.change(document.getElementById('trackViewUrl'), { target: { value: 'https://tracka.com' } });

    const nextbtn = getByTestId('submit-btn');
    fireEvent.click(nextbtn);

    await timeout(500);

    renderProvider(
      <TrackFormContainer
        formValues={initialValues}
        fillForm={fillSpy}
        resetForm={resetSpy}
        setFormValues={setFormSpy}
        maxWidth={800}
      />,
      routeProps,
      rerender
    );
    await timeout(500);

    expect(document.getElementById('collectionName')).toBeInTheDocument();
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
    // await waitFor(() => getByText(FORM_LOADING_TIP).toBeNull());
    await timeout(300);

    const fillBtn = getByTestId('fill-btn');
    fireEvent.click(fillBtn);
    await waitFor(() => expect(history.location.search).toBe('?stepTitle=upload'));
  });

  it('should move to previous step if clicked on previous button', async () => {
    history.location.search = '?stepTitle=collection';

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
    // await waitFor(() => getByText(FORM_LOADING_TIP).toBeNull());
    await timeout(300);

    const prevBtn = getByTestId('prev-btn');

    fireEvent.click(prevBtn);
    await waitFor(() => expect(history.location.search).toBe('?stepTitle=track'));
  });

  it('should be able to move to second step through url if first if already form fields are valid', () => {
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
    // await waitFor(() => getByText(FORM_LOADING_TIP).toBeNull());
    await timeout(300);

    const fillBtn = getByTestId('fill-btn');
    fireEvent.click(fillBtn);
    const resetBtn = getByTestId('reset-btn');
    fireEvent.click(resetBtn);
    await waitFor(() => expect(history.location.search).toBe('?stepTitle=track'));
    const loopField = ['trackName', 'trackViewUrl'];
    for (let key of loopField) {
      expect(document.getElementById(key).value).toEqual(String(initialValues[key]));
    }
  });

  it('should show invalid file type message when selected file is not of type image', async () => {
    const { getByTestId, getByText, rerender } = renderProvider(
      <TrackFormContainer
        formValues={initialValues}
        fillForm={fillSpy}
        resetForm={resetSpy}
        setFormValues={setFormSpy}
        maxWidth={800}
      />,
      routeProps
    );
    // await waitFor(() => getByText(FORM_LOADING_TIP).toBeNull());
    await timeout(300);

    const fillBtn = getByTestId('fill-btn');
    fireEvent.click(fillBtn);

    await waitFor(() => expect(history.location.search).toBe('?stepTitle=upload'));
    await timeout(500);
    renderProvider(
      <TrackFormContainer
        formValues={initialValues}
        fillForm={fillSpy}
        resetForm={resetSpy}
        setFormValues={setFormSpy}
        maxWidth={800}
      />,
      routeProps,
      rerender
    );

    const uploadInput = getByTestId('uploader');

    dummyFile = new File(['<h1>Welcome</h1>', '<p>World</p>'], 'index.html', { type: 'text/html' });
    fireEvent.change(uploadInput, {
      target: {
        files: [dummyFile]
      }
    });

    await waitFor(() => expect(getByText(INVALID_TYPE_MESSAGE)).not.toBeNull());
  });

  it('should show error popup message when selected file size is greater than 2MB', async () => {
    const { getByText, getByTestId, rerender } = renderProvider(
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
    await waitFor(() => expect(history.location.search).toBe('?stepTitle=upload'));
    await timeout(500);

    renderProvider(
      <TrackFormContainer
        formValues={initialValues}
        fillForm={fillSpy}
        resetForm={resetSpy}
        setFormValues={setFormSpy}
        maxWidth={800}
      />,
      routeProps,
      rerender
    );

    const uploadInput = getByTestId('uploader');
    dummyFile = new File(['somestuff'], 'camera.jpeg', { type: 'image/jpeg' });
    Object.defineProperty(dummyFile, 'size', { value: 2.1 * 1024 * 1024 });
    fireEvent.change(uploadInput, {
      target: {
        files: [dummyFile]
      }
    });

    await waitFor(() => expect(getByText(ISLT2M_MESSAGE)).not.toBeNull());
  });

  it('should submit values to dummyApi and gives success notification and opens modal and resets form on closing', async () => {
    const { getByTestId, getByText, rerender } = renderProvider(
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
    await waitFor(() => expect(history.location.search).toBe('?stepTitle=upload'));
    await timeout(500);

    renderProvider(
      <TrackFormContainer
        formValues={initialValues}
        fillForm={fillSpy}
        resetForm={resetSpy}
        setFormValues={setFormSpy}
        maxWidth={800}
      />,
      routeProps,
      rerender
    );

    const uploadInput = getByTestId('uploader');
    dummyFile = new File(['abcde', 'sutffagain'], 'camera1.jpeg', { type: 'image/jpeg' });
    fireEvent.change(uploadInput, {
      target: {
        files: [dummyFile]
      }
    });
    await timeout(200);
    await waitFor(() => expect(getByText(`${dummyFile.name} file uploaded.`)).not.toBeNull());

    const submitBtn = getByTestId('submit-btn');
    process.env.TEST_MOCK_STATUS_CODE = 200;
    fireEvent.click(submitBtn);
    await waitFor(() => expect(getByText(TRACK_SUBMIT_SUCCESS)).not.toBeNull());
    await waitFor(() => expect(getByTestId('track-modal')).toBeInTheDocument());
    fireEvent.click(getByTestId('close-modal'));
    await waitFor(() => expect(history.location.search).toBe('?stepTitle=track'));
  });

  it('should submit values to dummyApi and gives error notification', async () => {
    const { getByTestId, getByText, rerender } = renderProvider(
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
    await waitFor(() => expect(history.location.search).toBe('?stepTitle=upload'));
    await timeout(500);

    renderProvider(
      <TrackFormContainer
        formValues={initialValues}
        fillForm={fillSpy}
        resetForm={resetSpy}
        setFormValues={setFormSpy}
        maxWidth={800}
      />,
      routeProps,
      rerender
    );

    const uploadInput = getByTestId('uploader');
    dummyFile = new File(['somestuff2'], 'camera.jpeg', { type: 'image/jpeg' });
    fireEvent.change(uploadInput, {
      target: {
        files: [dummyFile]
      }
    });
    await waitFor(() => expect(getByText(`${dummyFile.name} file uploaded.`)).not.toBeNull());

    const submitBtn = getByTestId('submit-btn');
    process.env.TEST_MOCK_STATUS_CODE = 400;
    fireEvent.click(submitBtn);
    await waitFor(() => expect(getByText(TRACK_SUBMIT_FAILED)).not.toBeNull());
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