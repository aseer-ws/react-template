import { fromJS } from 'immutable';
import { selectTunesContainerDomain } from '../selectors';

describe('TunesContainer selector tests', () => {
  let mockedState;

  beforeEach(() => {
    mockedState = {
      tunesContainer: fromJS({})
    };
  });

  it('should select the user state', () => {
    expect(selectTunesContainerDomain(mockedState)).toEqual(mockedState.tunesContainer);
  });
});
