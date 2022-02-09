import { Descriptions, Modal } from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: transparent;
  margin-bottom: 0.5rem;
  border: none;
  cursor: pointer;
  outline: none;
  padding-left: 0;
`;

export const OK_TEXT = 'More Info';

function CollectionModal({ collectionId, collectionName, collectionPrice, collectionViewUrl, children }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    window.open(collectionViewUrl, '_blank');
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <StyledButton data-testid="modal-trigger" onClick={showModal}>
        {children}
      </StyledButton>
      <Modal
        data-testid="collection-modal"
        title="Collection Details"
        visible={isModalVisible}
        onOk={handleOk}
        okText={OK_TEXT}
        onCancel={handleCancel}
        closable
      >
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item span={2} label="Collection ID">
            {collectionId}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Collection Name">
            {collectionName}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Collection Price">
            {collectionPrice} $
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
}

CollectionModal.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  collectionId: PropTypes.number,
  collectionName: PropTypes.string,
  collectionPrice: PropTypes.number,
  collectionViewUrl: PropTypes.string
};

export default CollectionModal;
