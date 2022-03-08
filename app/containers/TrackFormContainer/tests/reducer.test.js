import trackFormContainerReducer, {
  fillValues,
  initialState,
  initialValues,
  trackFormContainerTypes
} from '../reducer';

describe('trackFormContainerReducer tests', () => {
  let state;

  beforeAll(() => {
    state = initialState;
  });

  it('should return the initial state', () => {
    expect(trackFormContainerReducer(undefined, {})).toBe(initialState);
  });

  it('should update the formValues when action of SET_FORM_VALUES is dispatched', () => {
    const changedState = {
      formValues: {
        ...initialState.formValues,
        trackName: 'Track B',
        trackViewUrl: 'https://sometrack.com'
      }
    };
    expect(
      trackFormContainerReducer(state, {
        type: trackFormContainerTypes.SET_FORM_VALUES,
        formValues: {
          trackName: 'Track B',
          trackViewUrl: 'https://sometrack.com'
        }
      })
    ).toEqual(changedState);
  });

  it('should fill state fill values when action of type FILL_FORM is dispatched', () => {
    expect(
      trackFormContainerReducer(state, {
        type: trackFormContainerTypes.FILL_FORM
      })
    ).toEqual({ formValues: fillValues });
  });

  it('should reset state when action of type RESET_FORM is dispatched', () => {
    expect(
      trackFormContainerReducer(state, {
        type: trackFormContainerTypes.RESET_FORM
      })
    ).toEqual({ formValues: initialValues });
  });
});
