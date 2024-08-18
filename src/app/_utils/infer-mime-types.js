const inferMimeTypes = (url) => {
  const extension = url.split('.').pop();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    default:
      return 'image/jpeg'; // Default to JPEG
  }
};

export default inferMimeTypes;
