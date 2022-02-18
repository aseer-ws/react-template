/**
 *
 * TrackContainer
 *
 */

import CollectionModal from '@app/components/CollectionModal';
import Container from '@app/components/Container';
import If from '@app/components/If';
import { getLimitLineCSS, T } from '@app/components/T';
import { colors, media } from '@app/themes';
import { Card, Col, Image, Row, Skeleton, Statistic } from 'antd';
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
import { trackProviderCreators } from '@app/containers/TrackProvider/reducer';
import trackProviderSaga from '@app/containers/TrackProvider/saga';
import { selectTrack, selectTrackError } from '@app/containers/TrackProvider/selectors';

const TrackContent = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  gap: 1rem;
  align-items: center;

  ${media.lessThan('tablet')`
    flex-direction: column !important;
  `}
`;

const StyledImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  flex: 0.4;
`;

const StyledImage = styled(Image)`
  && {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`;

const StyledAudio = styled.audio`
  display: block;
  margin-top: 1rem;
`;

const TrackDetails = styled.div`
  flex: 0.6;
`;

const TrackName = styled(T)`
  && {
    color: ${colors.gotoStories};
    font-size: 1.6rem;
    margin-bottom: 0.5rem;
    font-weight: 700;
  }
`;
const ArtistName = styled(T)`
  && {
    margin-top: 0rem;
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.6rem;
    opacity: 0.5;
  }
`;

const ReleaseDate = styled(T)`
  && {
    margin-bottom: 0.2rem;
    font-weight: bold;
    color: #444;
    width: 100%;
  }
`;

const CollectionName = styled.p`
  && {
    margin: 0.5rem 0;
    cursor: pointer;
    ${getLimitLineCSS(3)}
    animation: blink infinite 1.5s;

    @keyframes blink {
      0% {
        color: ${colors.gotoStories};
      }
      50% {
        opacity: 0.5;
      }
      100% {
        color: ${colors.text};
      }
    }

    &:hover {
      color: ${colors.success};
    }
  }
`;

const TrackGenre = styled(T)`
  && {
    margin-top: 0.5rem;
    font-size: smaller;
    font-weight: bold;
    padding: 0.5rem;
    background-color: #d8fa43;
    width: max-content;
    border-radius: 999px;
  }
`;

const { requestGetTrack } = trackProviderCreators;

export function dateFormat(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

const valueStyle = { fontSize: '1.2rem' };

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
        <title>
          {track?.trackName
            ? `${track?.trackName}${track?.artistName && ` by ${track?.artistName}`}`
            : 'TrackContainer'}
        </title>
        <meta name="description" content={track?.trackName ?? 'Description of TrackContainer'} />
      </Helmet>
      <Skeleton data-testid="loader" loading={loading} active>
        <Card>
          <TrackContent>
            <StyledImageContainer>
              <StyledImage
                width="95%"
                height="95%"
                src={track?.artworkUrl100 ?? ''}
                fallback="https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc="
              />
            </StyledImageContainer>
            <TrackDetails>
              <If
                condition={!isEmpty(track?.trackName)}
                otherwise={<TrackName data-testid="track_name_unavailable" id="track_name_unavailable" />}
              >
                <TrackName noOfLines={3} title={track?.trackName} data-testid="track-name" text={track?.trackName} />
              </If>
              <If
                condition={!isEmpty(track?.artistName)}
                otherwise={<ArtistName data-testid="artist_name_unavailable" id="artist_name_unavailable" />}
              >
                <ArtistName data-testid="artist-name" text={track?.artistName} />
              </If>
              <If
                condition={!isEmpty(track?.releaseDate)}
                otherwise={<ReleaseDate data-testid="release_date_unavailable" id="release_date_unavailable" />}
              >
                <ReleaseDate data-testid="release-date" text={`Release Date: ${dateFormat(track?.releaseDate)}`} />
              </If>
              <If
                condition={!isEmpty(track?.collectionName)}
                otherwise={<T data-testid="collection_name_unavailable" id="collection_name_unavailable" />}
              >
                <CollectionModal
                  collectionId={track?.collectionId}
                  collectionName={track?.collectionName}
                  collectionPrice={track?.collectionPrice}
                  collectionViewUrl={track?.collectionViewUrl}
                >
                  <CollectionName noOFLines={3} data-testid="collection-name">
                    {track?.collectionName}
                  </CollectionName>
                </CollectionModal>
              </If>
              <Row>
                <Col span={8}>
                  <Statistic
                    data-testid="track-price"
                    suffix="$"
                    precision={2}
                    title="Track Price"
                    value={track?.trackPrice}
                    valueStyle={valueStyle}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    data-testid="track-time"
                    precision={2}
                    suffix=" s"
                    title="Track Time"
                    value={track?.trackTimeMillis / 1000}
                    valueStyle={valueStyle}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    data-testid="track-country"
                    precision={2}
                    title="Country"
                    value={track?.country}
                    valueStyle={valueStyle}
                  />
                </Col>
              </Row>
              <If condition={typeof track?.trackPrice !== 'number'}>
                <T data-testid="track_price_unavailable" id="track_price_unavailable" />
              </If>

              <If
                condition={!isEmpty(track?.primaryGenreName)}
                otherwise={<TrackGenre data-testid="track_genre_unavailable" id="track_genre_unavailable" />}
              >
                <TrackGenre data-testid="track-genre" text={track?.primaryGenreName} />
              </If>
              <If condition={!isEmpty(track?.previewUrl)} otherwise={<T id="track_preview_unavailable" />}>
                <StyledAudio loading="lazy" preload="none" controls src={track?.previewUrl}>
                  Your browser does not support <code>audio</code> element
                </StyledAudio>
              </If>
            </TrackDetails>
          </TrackContent>
        </Card>
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
  injectSaga({ key: 'trackProvider', saga: trackProviderSaga })
)(TrackContainer);

export const TrackContainerTest = compose(injectIntl)(TrackContainer);
