import { Button, Card, Image, Skeleton } from 'antd';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import If from '../If';
import { T } from '../T';
import * as colors from '@app/themes/colors';
import { PlayCircleFilled, PauseCircleFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
/* eslint-disable-next-line */
import React, { useState, useEffect, MutableRefObject, useRef } from 'react';

export const imageAnimationStyle = css`
  animation-play-state: running;
`;

const StyledTrackItem = styled.article`
  && {
    height: 100%;
    max-height: 15rem;
  }
`;

const StyledTrackCard = styled(Card)`
  && {
    .ant-card-body {
      height: 100%;
      display: flex;
      gap: 1rem;
      padding-left: 0;

      &&:hover {
        cursor: pointer;
        box-shadow: 0 0 10px 5px ${colors.success};
      }
    }
  }
`;

const StyledImageContainer = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  width: 6.5rem;
  height: 6.5rem;
`;

const StyledImage = styled(Image)`
  && {
    height: 100%;
    width: 100%;
    border-radius: 50%;

    object-fit: cover;
    animation: spin infinite 3s linear;
    animation-play-state: paused;
    ${(props) => props.animate === 'true' && imageAnimationStyle}

    @keyframes spin {
      0% {
        transform: rotateZ(0deg);
      }
      50% {
        transform: rotateZ(180deg);
      }
      100% {
        transform: rotateZ(360deg);
      }
    }
  }
`;

const PlayPauseButton = styled(Button)`
  && {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const TrackInfoContainer = styled.div`
  color: inherit;
`;

const StyledLink = styled(Link)`
  && {
    color: black;
    text-decoration: none;
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
export const TrackGenre = styled(T)`
  && {
    font-weight: bold;
    font-size: smaller;
  }
`;

/** @type {MutableRefObject<HTMLAudioElement>} */
let currentTrackRef;

function TrackCard({
  trackId,
  skeletonLoading,
  trackName,
  collectionName,
  artworkUrl100,
  trackPrice,
  primaryGenreName,
  previewUrl
}) {
  /** @type {MutableRefObject<HTMLAudioElement>} */
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => setPlaying(!playing);

  useEffect(() => {
    console.log('effect playing');
    function onEnded() {
      togglePlay();
      currentTrackRef = null;
    }

    function onPaused() {
      if (playing) {
        togglePlay();
      }
    }
    console.log({ playing, currentTrackRef, audioRef, pauseValue: audioRef?.current?.paused });
    if (playing) {
      console.log('playing block');
      if (currentTrackRef?.current && !currentTrackRef.current.paused) {
        currentTrackRef.current.pause();
      }
      if (!audioRef?.current) {
        audioRef.current = new Audio(previewUrl);
        audioRef.current.addEventListener('ended', onEnded);
        audioRef.current.addEventListener('pause', onPaused);
      }
      currentTrackRef = audioRef;
      audioRef.current.play();
    }
    if (audioRef.current && !playing && !audioRef.current.paused) {
      console.log('stop block');
      audioRef.current.pause();
    }
  }, [playing]);

  return (
    <StyledTrackItem id={trackId} data-testid="track-card">
      <Skeleton loading={skeletonLoading} active>
        <StyledTrackCard>
          <StyledImageContainer>
            <StyledImage
              animate={playing ? 'true' : 'false'}
              data-testid="track-image"
              preview={false}
              src={artworkUrl100 ?? ''}
              fallback="https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc="
            />

            <PlayPauseButton
              data-testid="play-pause-btn"
              type="primary"
              onClick={togglePlay}
              shape="circle"
              icon={playing ? <PauseCircleFilled /> : <PlayCircleFilled />}
            />
          </StyledImageContainer>
          <StyledLink to={`/tracks/${trackId}`}>
            <TrackInfoContainer>
              <If
                condition={!isEmpty(trackName)}
                otherwise={<T data-testid="track_name_unavailable" id="track_name_unavailable" />}
              >
                <TrackName data-testid="track-name" marginBottom={10} type="subheading" text={trackName} />
              </If>
              <If
                condition={!isEmpty(collectionName)}
                otherwise={<T data-testid="collection_name_unavailable" id="collection_name_unavailable" />}
              >
                <TrackCollectionName data-testid="collection-name" type="subText" text={collectionName} />
              </If>
              <If
                condition={typeof trackPrice === 'number'}
                otherwise={<T data-testid="track_price_unavailable" id="track_price_unavailable" />}
              >
                <TrackPrice data-testid="track-price" text={`${String(trackPrice)} $`} />
              </If>
              <If
                condition={!isEmpty(primaryGenreName)}
                otherwise={<T data-testid="track_genre_unavailable" id="track_genre_unavailable" />}
              >
                <TrackGenre data-testid="track-genre" text={primaryGenreName} />
              </If>
            </TrackInfoContainer>
          </StyledLink>
        </StyledTrackCard>
      </Skeleton>
    </StyledTrackItem>
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
  primaryGenreName: PropTypes.string,
  previewUrl: PropTypes.string
};

export default TrackCard;
