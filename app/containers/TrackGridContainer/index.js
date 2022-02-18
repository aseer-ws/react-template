/**
 *
 * TrackGridContainer
 *
 */

import Container from '@app/components/Container';
import For from '@app/components/For';
import If from '@app/components/If';
import { T } from '@app/components/T';
import TrackCard from '@app/components/TrackCard';
import { Card, Input, notification, Skeleton } from 'antd';
import { debounce, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { injectSaga } from 'redux-injectors';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { trackProviderCreators } from '@app/containers/TrackProvider/reducer';
import trackProviderSaga from '@app/containers/TrackProvider/saga';
import {
  selectArtist,
  selectTrackCount,
  selectTracks,
  selectTracksError
} from '@app/containers/TrackProvider/selectors';

const { Search } = Input;

const CustomCard = styled(Card)`
  && {
    user-select: none;
    ${(props) => props.margintop && `margin-top: ${props.margintop}rem`}
  }
`;

const StyledLink = styled(Link)`
  && {
    text-align: center;
  }
`;

const StyledArtistSearch = styled(Search)`
  && {
    max-width: 18.75rem;
    border-radius: 0.3rem;
    padding: 0.5rem;
  }
`;

const StyledHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledTracksContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media screen and (min-width: 790px) {
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (min-width: 1000px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const { requestGetTracks, clearTracks } = trackProviderCreators;

export const CORS_ERROR_MESSAGE = 'iTunes API CORS issue';

export function TrackGridContainer({
  artist,
  tracks,
  trackCount,
  tracksError,
  dispatchGetTracks,
  maxWidth,
  padding,
  dispatchClearTracks
}) {
  const [loading, setLoading] = useState(false);
  const currentTrackRef = useRef(null);

  function onTrackToggle(trackRef) {
    if (currentTrackRef?.current !== trackRef.current && !currentTrackRef?.current?.paused) {
      currentTrackRef?.current?.pause();
      currentTrackRef.current = trackRef?.current;
    } else {
      currentTrackRef.current = null;
    }
  }

  useEffect(() => {
    if (!isEmpty(artist) && isEmpty(tracks)) {
      dispatchGetTracks(artist);
    }
  }, []);

  useEffect(() => {
    if (loading && !isEmpty(tracks)) {
      setLoading(false);
    }
  }, [tracks, tracksError, loading]);

  const onArtistSearch = (artistName) => {
    if (!artistName) {
      return dispatchClearTracks();
    }
    setLoading(true);
    dispatchGetTracks(artistName);
  };

  useEffect(() => {
    if (tracksError === 'NETWORK_ERROR') {
      notification.error({
        message: CORS_ERROR_MESSAGE,
        description: 'Try back after some time',
        placement: 'bottomRight',
        duration: 5000,
        type: 'error'
      });
    }
  }, [tracksError]);

  const handleDebouncedSearch = debounce(onArtistSearch, 500);

  const renderSongsTrack = () => {
    return (
      <Skeleton loading={loading} active>
        <CustomCard margintop={2}>
          <If condition={!isEmpty(artist)} otherwise={<T id="songs_data_empty" />}>
            <If condition={!isEmpty(artist)} otherwise={<T id="itunes_artist_unavailable" />}>
              <div>
                <T data-testid="tunes-artist" id="itunes_artist_name" values={{ artistName: artist }} />
              </div>
              <If condition={trackCount} otherwise={<T data-testid="empty-track-text" id="itunes_empty_track" />}>
                <div>
                  <T id="itunes_track_count" values={{ trackCount }} />
                </div>
              </If>
            </If>
          </If>
        </CustomCard>
        <If condition={!isEmpty(tracks) && typeof tracks === 'object'}>
          <CustomCard margintop={1}>
            <For
              ParentComponent={StyledTracksContainer}
              of={Object.values(tracks || {})}
              renderItem={(item) => (
                <TrackCard key={item.trackId} skeletonLoading={loading} onTrackToggle={onTrackToggle} {...item} />
              )}
            />
          </CustomCard>
        </If>
      </Skeleton>
    );
  };

  const renderTunesError = () => {
    return (
      <If condition={!isEmpty(tracksError)}>
        <Card>
          <If condition={typeof tracksError === 'string'} otherwise={<div>{JSON.stringify(tracksError, null, 2)}</div>}>
            <T data-testid="tunes-error" text={tracksError} />
          </If>
        </Card>
      </If>
    );
  };

  return (
    <Container maxWidth={maxWidth} padding={padding}>
      <Helmet>
        <title>{artist ? `Tracks from ${artist}` : 'TrackGridContainer'}</title>
        <meta name="description" content="Description of TrackGridContainer" />
      </Helmet>
      <StyledLink data-testid="repos-redirect" to="/repos">
        Goto GitHub Repos
      </StyledLink>
      <StyledHeader>
        <T type="heading" marginBottom={10} id="itunes_header" />
        <StyledArtistSearch
          data-testid="artist-search-bar"
          placeholder="input artist name"
          allowClear
          defaultValue={artist}
          onChange={(evt) => handleDebouncedSearch(evt.target.value)}
          onSearch={(term) => handleDebouncedSearch(term)}
        />
      </StyledHeader>
      {renderSongsTrack()}
      {renderTunesError()}
    </Container>
  );
}

TrackGridContainer.propTypes = {
  artist: PropTypes.string,
  tracks: PropTypes.object,
  trackCount: PropTypes.number,
  tracksError: PropTypes.string,
  dispatchGetTracks: PropTypes.func,
  dispatchClearTracks: PropTypes.func,
  maxWidth: PropTypes.number,
  padding: PropTypes.number
};

TrackGridContainer.defaultProps = {
  maxWidth: 1000,
  padding: 2,
  dispatchGetTracks: () => {}
};

const mapStateToProps = createStructuredSelector({
  artist: selectArtist(),
  tracks: selectTracks(),
  trackCount: selectTrackCount(),
  tracksError: selectTracksError()
});

export function mapDispatchToProps(dispatch) {
  return {
    dispatchGetTracks: (artistName) => dispatch(requestGetTracks(artistName)),
    dispatchClearTracks: () => dispatch(clearTracks())
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  memo,
  injectIntl,
  injectSaga({ key: 'trackProvider', saga: trackProviderSaga })
)(TrackGridContainer);

export const TrackGridContainerTest = compose(injectIntl)(TrackGridContainer);
