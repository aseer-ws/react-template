import React from 'react';
import { Card, Col } from 'antd';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import If from '../If';
import { T } from '../T';

const CustomCard = styled(Card)`
  && {
    padding: 0.5rem;
    height: 100%;
  }
`;

const StyledCol = styled(Col)`
  && {
    min-height: 100px;
    height: 100%;
  }
`;

function TrackCard({ trackId, trackName, collectionName, trackPrice, releaseDate }) {
  return (
    <StyledCol md={12} lg={8} style={{ height: '100%' }}>
      <CustomCard>
        <If condition={!isEmpty(trackName)} otherwise={<T id="track_name_unavailable" />}>
          <T id="track_name" values={{ trackName }} />
        </If>
        <p>Collection name: {collectionName}</p>
        <p></p>
      </CustomCard>
    </StyledCol>
  );
}

TrackCard.propTypes = {
  trackId: PropTypes.number,
  collectionName: PropTypes.string,
  trackName: PropTypes.string,
  trackPrice: PropTypes.number,
  releaseDate: PropTypes.string
};

export default TrackCard;
