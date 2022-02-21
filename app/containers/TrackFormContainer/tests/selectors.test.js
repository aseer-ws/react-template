import { initialState, initialValues } from '../reducer';
import { selectFormValues, selectTrackFormContainerDomain } from '../selectors';

describe('TrackFormContainer selectors test', () => {
  let mockedState;

  beforeAll(() => {
    mockedState = {
      trackFormContainer: {
        formValues: initialValues
      }
    };
  });

  it('should selectTrackFormContainerDomain select trackFormContainer state from redux state', () => {
    expect(selectTrackFormContainerDomain(mockedState)).toBe(mockedState.trackFormContainer);
  });

  it('should selectTrackFormContainerDomain select trackFormContainer state from redux state', () => {
    expect(selectTrackFormContainerDomain({})).toBe(initialState);
  });

  it('should selectFormValues select formValues from trackFormContainer state', () => {
    const formValuesSelector = selectFormValues();
    expect(formValuesSelector(mockedState)).toEqual(mockedState.trackFormContainer.formValues);
  });
});
