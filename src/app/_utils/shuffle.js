const shuffle = (array) => {
  let currentIndex = array.length;
  const shuffledArray = [...array];

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [shuffledArray [currentIndex], shuffledArray [randomIndex]] = [shuffledArray [randomIndex], shuffledArray [currentIndex]];
  }

  return shuffledArray ;
}

export default shuffle;
