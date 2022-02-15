import { StyledTracksContainer } from '@app/containers/TrackGridContainer';
import React from 'react';
import TrackCard from '..';

export default {
  title: 'TrackCard',
  component: TrackCard
};

const trackData = {
  id: 'asdf!2c',
  trackName: 'Track A',
  collectionName: 'Collection B',
  trackPrice: 100,
  artworkUrl100:
    'https://media.istockphoto.com/photos/studio-microphone-and-pop-shield-on-mic-in-the-empty-recording-studio-picture-id1279654034?b=1&k=20&m=1279654034&s=170667a&w=0&h=jebzMhp_tlJi-3fLn3Ig8cYWG_JaF-vjt4SWLAI9o9Q=',
  primaryGenreName: 'Genre C'
};

export const SingleTrack = () => <TrackCard {...trackData} maxWidth={21} />;
SingleTrack.story = {
  name: 'SingleTrack'
};
export const NoPropCard = () => <TrackCard maxWidth={21} />;
export const TrackCardGrid = () => (
  <StyledTracksContainer>
    <TrackCard {...trackData} />
    <TrackCard {...trackData} />
    <TrackCard {...trackData} />
    <TrackCard {...trackData} />
    <TrackCard {...trackData} />
    <TrackCard {...trackData} />
  </StyledTracksContainer>
);
