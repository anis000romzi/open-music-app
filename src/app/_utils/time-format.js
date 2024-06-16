const formatTime = (time) => {
  if (time && !isNaN(time)) {
    const minutes = Math.floor(time / 60);
    const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(time % 60);
    const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${formatMinutes}:${formatSeconds}`;
  }
  return '00:00';
};

const formatTimeString = (time) => {
  if (time === 0) {
    return '0 second';
  }

  time = Number(time);
  let h = Math.floor(time / 3600);
  let m = Math.floor((time % 3600) / 60);
  let s = Math.floor((time % 3600) % 60);

  let hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : '';
  let mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : ' minutes, ') : '';
  let sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : '';
  return hDisplay + mDisplay + sDisplay;
};

export { formatTime, formatTimeString };
