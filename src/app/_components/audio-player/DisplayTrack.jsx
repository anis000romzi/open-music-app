function DisplayTrack({
  currentTrack,
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
        src={currentTrack ? currentTrack.audio : null}
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={handleNext}
      />
      <div className="audio-info">
        <div className="text">
          <p className="title">{currentTrack ? currentTrack.title : '--'}</p>
          <p>{currentTrack ? currentTrack.username : '--'}</p>
        </div>
      </div>
    </div>
  );
}

export default DisplayTrack;
