/**
 *
 * TunesContainer
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { injectSaga } from 'redux-injectors';
import selectTunesContainer, { selectTunesArtist, selectTunesError, selectTunesSongs } from './selectors';
import tunesContainerSaga from './saga';
import { tunesContainerCreators } from './reducer';
import { Card, Input, Skeleton } from 'antd';
import { debounce, get, isEmpty } from 'lodash';
import For from '@app/components/For';
import styled from 'styled-components';
import TrackCard from '@app/components/TrackCard';
import If from '@app/components/If';
import { T } from '@app/components/T';

const { Search } = Input;

const CustomCard = styled(Card)`
  && {
    user-select: none;
    ${(props) => props.margintop && `margin-top: ${props.margintop}rem`}
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 2rem auto;
  max-width: ${(props) => props.maxWidth};
  padding: ${(props) => props.padding};
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

const StyledTracksContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const { requestGetSongs, clearSongs } = tunesContainerCreators;

export function TunesContainer({
  artist,
  songsData,
  tunesError,
  dispatchGetArtistSongs,
  maxWidth,
  padding,
  dispatchClearSongs
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading && !isEmpty(songsData)) {
      setLoading(false);
    }
  }, [songsData]);

  const onArtistSearch = (artistName) => {
    if (!artistName) {
      return dispatchClearSongs();
    }
    setLoading(true);
    dispatchGetArtistSongs(artistName);
  };

  const onDebouncedSearch = debounce(onArtistSearch, 500);

  const renderSongsTrack = () => {
    const tracks = get(songsData, 'results', []);
    const trackCount = get(songsData, 'resultCount', 0);

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
                  <T id="itunes_track_count" values={{ trackCount: tracks.length }} />
                </div>
              </If>
            </If>
          </If>
        </CustomCard>
        <If condition={loading || !isEmpty(songsData)}>
          <CustomCard margintop={1}>
            <For
              ParentComponent={StyledTracksContainer}
              of={tracks}
              renderItem={(item) => <TrackCard key={item.trackId} skeletonLoading={loading} {...item} />}
            />
          </CustomCard>
        </If>
      </Skeleton>
    );
  };

  const renderTunesError = () => {
    return (
      <If condition={!isEmpty(tunesError)}>
        <div>{JSON.stringify(tunesError, null, 2)}</div>;
      </If>
    );
  };

  return (
    <Container maxWidth={maxWidth} padding={padding}>
      <Helmet>
        <title>TunesContainer</title>
        <meta name="description" content="Description of TunesContainer" />
      </Helmet>
      <StyledHeader>
        <T type="heading" marginBottom={10} id="itunes_header" />
        <StyledArtistSearch
          data-testid="artist-search-bar"
          placeholder="input artist name"
          allowClear
          defaultValue={artist}
          onChange={(evt) => onDebouncedSearch(evt.target.value)}
          onSearch={(term) => onDebouncedSearch(term)}
        />
      </StyledHeader>
      {renderSongsTrack()}
      {renderTunesError()}
    </Container>
  );
}

TunesContainer.propTypes = {
  tunesContainerSaga: PropTypes.func,
  artist: PropTypes.string,
  songsData: PropTypes.shape({
    resultCount: PropTypes.number,
    results: PropTypes.array
  }),
  tunesError: PropTypes.string,
  dispatchGetArtistSongs: PropTypes.func,
  dispatchClearSongs: PropTypes.func,
  maxWidth: PropTypes.number,
  padding: PropTypes.string
};

TunesContainer.defaultProps = {
  maxWidth: 1000,
  padding: '2rem'
};

const mapStateToProps = createStructuredSelector({
  tunesContainer: selectTunesContainer(),
  artist: selectTunesArtist(),
  songsData: selectTunesSongs(),
  tunesError: selectTunesError()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatchGetArtistSongs: (artistName) => dispatch(requestGetSongs(artistName)),
    dispatchClearSongs: () => dispatch(clearSongs())
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  memo,
  injectIntl,
  injectSaga({ key: 'tunesContainer', saga: tunesContainerSaga })
)(TunesContainer);

export const TunesContainerTest = compose(injectIntl)(TunesContainer);
