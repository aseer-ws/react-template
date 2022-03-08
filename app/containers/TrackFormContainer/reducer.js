import produce from 'immer';
import { createActions } from 'reduxsauce';

export const GENRE_ENUM = ['Jaz', 'HipHop', 'Electronics', 'Pop'];

export const initialValues = {
  trackName: '',
  trackPrice: 1,
  primaryGenreName: GENRE_ENUM[0],
  releaseDate: '22/01/2015',
  trackViewUrl: '',
  collectionName: '',
  collectionPrice: 2,
  collectionViewUrl: '',
  artistName: '',
  artistViewUrl: ''
};

export const fillValues = {
  trackName: 'Track A',
  trackPrice: 2,
  primaryGenreName: GENRE_ENUM[0],
  releaseDate: '02/11/2018',
  trackViewUrl: 'https://tracka.com',
  collectionName: 'Collection B',
  collectionPrice: 12,
  collectionViewUrl: 'https://collectionb.com',
  artistName: 'Artist C',
  artistViewUrl: 'https://artistc.com'
};

export const initialState = {
  formValues: initialValues
};

export const { Types: trackFormContainerTypes, Creators: trackFormContainerCreators } = createActions({
  setFormValues: ['formValues'],
  resetForm: {},
  fillForm: {}
});

const trackFormContainerReducer = function (state = initialState, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case trackFormContainerTypes.SET_FORM_VALUES:
        draft.formValues = { ...state.formValues, ...action.formValues };
        break;
      case trackFormContainerTypes.RESET_FORM:
        draft.formValues = initialValues;
        break;
      case trackFormContainerTypes.FILL_FORM:
        draft.formValues = fillValues;
        break;
      default:
        return initialState;
    }
  });
};

export default trackFormContainerReducer;
