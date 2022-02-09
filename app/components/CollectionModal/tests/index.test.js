import { renderWithIntl } from '@app/utils/testUtils';
import { waitFor } from '@testing-library/react';
import React from 'react';
import { fireEvent } from 'react-testing-library';
import CollectionModal, { OK_TEXT } from '..';

describe('<CollectionModal test', () => {
  it('should open the mdoal when modal button is clicked', async () => {
    const { getByTestId, baseElement } = renderWithIntl(<CollectionModal />);
    fireEvent.click(getByTestId('modal-trigger'));
    await waitFor(() => expect(baseElement.getElementsByClassName('ant-modal-body').length).toBe(1));
  });

  it('should close the modal when clicked on close button', async () => {
    const { getByTestId, baseElement } = renderWithIntl(<CollectionModal />);
    fireEvent.click(getByTestId('modal-trigger'));
    fireEvent.click(baseElement.getElementsByClassName('ant-modal-close')[0]);
    await waitFor(() => expect(baseElement.getElementsByClassName('ant-modal-body').length).toBe(1));
  });

  it('should redirect to collection view page when click more info button', async () => {
    const collectionUrl = 'https://example.com';
    const { getByTestId, baseElement } = renderWithIntl(<CollectionModal collectionViewUrl={collectionUrl} />);
    fireEvent.click(getByTestId('modal-trigger'));
    const btnElements = baseElement.getElementsByClassName('ant-btn-primary');
    let openSpy = jest.fn();
    window.open = openSpy;
    let redirectBtn;
    for (let btn of btnElements) {
      // look for span element within buttons which has this textContent
      if (btn.children[0].textContent === OK_TEXT) {
        redirectBtn = btn;
      }
    }
    expect(redirectBtn).toBeInTheDocument();
    fireEvent.click(redirectBtn);
    await waitFor(() => expect(openSpy).toBeCalledWith(collectionUrl, '_blank'));
  });
});
