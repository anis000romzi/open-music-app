function DisplayTrack({
  currentlyPlaying,
  audioRef,
  setDuration,
  progressBarRef,
  handleNext,
}) {
  const onLoadedMetadata = () => {
    const seconds = audioRef.current.duration;
    setDuration(seconds);
    progressBarRef.current.max = seconds;
  };

  return (
    <div>
      <audio
        src={currentlyPlaying ? currentlyPlaying.audio : null}
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={handleNext}
      />
      <div className="audio-info">
        <div className="text">
          <p className="title">{currentlyPlaying ? currentlyPlaying.title : '--'}</p>
          <p>{currentlyPlaying ? currentlyPlaying.username : '--'}</p>
        </div>
      </div>
    </div>
  );
}

export default DisplayTrack;
