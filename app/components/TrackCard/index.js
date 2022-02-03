import React from 'react';
import { Card, Col, Image, Row, Skeleton } from 'antd';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import If from '../If';
import { T } from '../T';
import * as colors from '@app/themes/colors';

const StyledTrackItem = styled(Col)`
  && {
    height: 100%;
    max-height: 15rem;
  }
`;

const StyledTrackCard = styled(Card)`
  && {
    height: 100%;
  }
`;

const StyledImage = styled(Image)`
  && {
    width: 6.25rem;
    height: 6.25rem;
    border-radius: 50%;

    @media screen and (max-width: 25rem) {
      width: 5rem;
      height: 5rem;
    }
  }
`;

const TrackName = styled(T)`
  && {
    font-size: 1rem;
    color: ${colors.success};
  }
`;
const TrackCollectionName = styled(T)``;
const TrackPrice = styled(T)`
  && {
    color: ${colors.error};
  }
`;
const TrackGenre = styled(T)``;

function TrackCard({ skeletonLoading, trackName, collectionName, artworkUrl100, trackPrice, primaryGenreName }) {
  return (
    <Skeleton loading={skeletonLoading} active>
      <StyledTrackItem data-testid="track-card">
        <StyledTrackCard hoverable>
          <Row gutter={48}>
            <Col span={8}>
              <StyledImage
                preview={false}
                src={artworkUrl100}
                fallback="https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc="
              />
            </Col>
            <Col span={16}>
              <If condition={!isEmpty(trackName)} otherwise={<T id="track_name_unavailable" />}>
                <TrackName data-testid="track-name" marginBottom={10} type="subheading" text={trackName} />
              </If>
              <If condition={!isEmpty(collectionName)} otherwise={<T id="collection_name_unavailable" />}>
                <TrackCollectionName data-testid="collection-name" type="subText" text={collectionName} />
              </If>
              <If condition={typeof trackPrice === 'number'} otherwise={<T id="track_price_unavailable" />}>
                <TrackPrice data-testid="track-price" text={String(trackPrice)} />
              </If>
              <If condition={!isEmpty(primaryGenreName)} otherwise={<T id="track_genre_unavailable" />}>
                <TrackGenre data-testid="track-genre" text={primaryGenreName} />
              </If>
            </Col>
          </Row>
        </StyledTrackCard>
      </StyledTrackItem>
    </Skeleton>
  );
}

TrackCard.propTypes = {
  skeletonLoading: PropTypes.bool,
  trackId: PropTypes.number,
  collectionName: PropTypes.string,
  trackName: PropTypes.string,
  artworkUrl100: PropTypes.string,
  trackPrice: PropTypes.number,
  releaseDate: PropTypes.string,
  primaryGenreName: PropTypes.string
};

export default TrackCard;
