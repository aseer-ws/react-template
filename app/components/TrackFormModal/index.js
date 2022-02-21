import React from 'react';

import { Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import TrackCard from '../TrackCard';

function TrackModal({ handleCancel, isVisible, trackDetails, afterClose }) {
  return (
    <Modal
      data-testid="track-modal"
      title="Submitted TrackCard"
      footer={
        <Button data-testid="close-modal" onClick={handleCancel}>
          Close
        </Button>
      }
      visible={isVisible}
      afterClose={afterClose}
      closable
    >
      <TrackCard {...trackDetails} artworkUrl100={trackDetails?.artworkUrl} />
    </Modal>
  );
}

TrackModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  trackDetails: PropTypes.object.isRequired,
  afterClose: PropTypes.func.isRequired
};

export default TrackModal;
