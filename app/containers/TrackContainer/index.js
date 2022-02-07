/**
 *
 * TrackContainer
 *
 */

import If from '@app/components/If';
import { T } from '@app/components/T';
import { TrackGenre } from '@app/components/TrackCard';
import { colors } from '@app/themes';
import { Col, Image, Row, Skeleton } from 'antd';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { memo, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { compose } from 'redux';
import { injectSaga } from 'redux-injectors';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { Container } from '../TrackGridContainer';
import { trackProviderCreators } from '../TrackProvider/reducer';
import { trackContainerSaga } from '../TrackProvider/saga';
import { selectTrack, selectTrackError } from '../TrackProvider/selectors';

const StyledImageContainer = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

const StyledImage = styled(Image)`
  && {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
`;

const TrackName = styled(T)`
  && {
    color: ${colors.gotoStories};
    font-size: 2.5rem;
    font-weight: bolder;
  }
`;
const ArtistName = styled(T)`
  && {
    font-size: 1.2rem;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;
const CollectionName = styled(T)`
  && {
    margin-bottom: 0.5rem;
    color: grey;
  }
`;
const ReleaseDate = styled(T)`
  & {
    margin-bottom: 0.6rem;
  }
`;
const TrackPrice = styled(T)`
  && {
    color: ${colors.error};
    font-size: 1.1rem;
  }
`;

const StyledAudio = styled.audio`
  display: block;
  margin-top: 1rem;
`;

const { requestGetTrack } = trackProviderCreators;

export function TrackContainer({ dispatchGetTrack, track, maxWidth, padding, trackError }) {
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    if (!isEmpty(track) || !isEmpty(trackError)) {
      setLoading(false);
    }
    let loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => {
      clearTimeout(loadingTimeout);
    };
  }, [track, trackError]);

  useEffect(() => {
    if (dispatchGetTrack) {
      dispatchGetTrack(params.trackId);
    }
  }, [params.trackId]);

  return (
    <Container maxWidth={maxWidth} padding={padding}>
      <Helmet>
        <title>TrackContainer</title>
        <meta name="description" content="Description of TrackContainer" />
      </Helmet>
      <Skeleton data-testid="loader" loading={loading} active>
        <Row gutter={25}>
          <Col sm={24} md={6}>
            <StyledImageContainer>
              <StyledImage
                width="95%"
                height="95%"
                src={track?.artworkUrl100 ?? ''}
                fallback="https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc="
              />
            </StyledImageContainer>
          </Col>
          <Col sm={24} md={18}>
            <If
              condition={!isEmpty(track?.trackName)}
              otherwise={<T data-testid="track_name_unavailable" id="track_name_unavailable" />}
            >
              <TrackName data-testid="track-name" text={track?.trackName} />
            </If>
            <If
              condition={!isEmpty(track?.artistName)}
              otherwise={<T data-testid="artist_name_unavailable" id="artist_name_unavailable" />}
            >
              <ArtistName data-testid="artist-name" text={track?.artistName} />
            </If>
            <If
              condition={!isEmpty(track?.collectionName)}
              otherwise={<T data-testid="collection_name_unavailable" id="collection_name_unavailable" />}
            >
              <CollectionName data-testid="collection-name" text={track?.collectionName} />
            </If>
            <If
              condition={typeof track?.trackPrice === 'number'}
              otherwise={<T data-testid="track_price_unavailable" id="track_price_unavailable" />}
            >
              <TrackPrice data-testid="track-price" text={`${track?.trackPrice} ${track?.currency}`} />
            </If>
            <If
              condition={!isEmpty(track?.releaseDate)}
              otherwise={<T data-testid="release_date_unavailable" id="release_date_unavailable" />}
            >
              <ReleaseDate data-testid="release-date" text={new Date(track?.releaseDate).toLocaleDateString('en-IN')} />
            </If>
            <If
              condition={!isEmpty(track?.primaryGenreName)}
              otherwise={<T data-testid="track_genre_unavailable" id="track_genre_unavailable" />}
            >
              <TrackGenre data-testid="track-genre" text={track?.primaryGenreName} />
            </If>
            <If condition={!isEmpty(track?.previewUrl)} otherwise={<T id="track_preview_unavailable" />}>
              <StyledAudio controls src={track?.previewUrl}>
                Your browser does not support <code>audio</code> element
              </StyledAudio>
            </If>
          </Col>
        </Row>
      </Skeleton>
    </Container>
  );
}

TrackContainer.propTypes = {
  dispatchGetTrack: PropTypes.func,
  track: PropTypes.object,
  trackError: PropTypes.any,
  maxWidth: PropTypes.number,
  padding: PropTypes.number
};

const mapStateToProps = createStructuredSelector({
  track: selectTrack(),
  trackError: selectTrackError()
});

export function mapDispatchToProps(dispatch) {
  return {
    dispatchGetTrack: (trackId) => dispatch(requestGetTrack(trackId))
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  memo,
  injectSaga({ key: 'trackContainer', saga: trackContainerSaga })
)(TrackContainer);

export const TrackContainerTest = compose(injectIntl)(TrackContainer);
