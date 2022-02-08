/* eslint-disable-next-line */
import { useState, useEffect, MutableRefObject, useRef } from 'react';

/**@type { React.MutableRefObject<HTMLAudioElement> } */
let currentTrackRef;
let currentTrackId;

/**
 * @param { number } audioId
 * @param { string } audioUrl
 */
function useAudio(audioId, audioUrl) {
  const audioRef = useRef();
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => setPlaying(!playing);

  useEffect(() => {
    if (playing) {
      if (audioId !== currentTrackId) {
        if (currentTrackRef?.current && !currentTrackRef.current.paused) {
          currentTrackRef.current.pause();
        }
        if (!audioRef?.current) {
          audioRef.current = new Audio(audioUrl);
          audioRef.current.id = audioId;
          audioRef.current.addEventListener('ended', function () {
            togglePlay();
            currentTrackRef = null;
            currentTrackId = null;
          });
          audioRef.current.addEventListener('pause', function () {
            if (playing) {
              togglePlay();
            }
          });
        }
      }
      currentTrackId = audioId;
      currentTrackRef = audioRef;
      audioRef?.current?.play();
    }
    if (audioRef.current) {
      if (!playing) {
        if (!audioRef.current.paused) {
          audioRef.current.pause();
        }
      }
    }
  }, [playing]);

  return {
    playing,
    togglePlay
  };
}

export default useAudio;
