const SonoffPowNameExtractor = (topic, defaultName = '') => {
  let ret = defaultName;

  const re = /cmnd\/(\w*)$/;
  const parts = re.exec(topic);

  if (parts && parts.length === 2) {
    ret = parts[1];
  }

  return ret;
};

export default SonoffPowNameExtractor;
