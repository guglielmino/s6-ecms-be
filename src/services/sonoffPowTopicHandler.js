const SonoffPowTopicHanlders = () => ({
  extractNameFromCommandTopic: (topic, defaultName = '') => {
    let ret = defaultName;

    const re = /cmnd\/(\w*)$/;
    const parts = re.exec(topic);

    if (parts && parts.length === 2) {
      ret = parts[1];
    }

    return ret;
  },
  makePowerCommandFromTopicName: (topicName) => {
    let ret = '';
    const re = /^\w*$/;
    if (re.test(topicName)) {
      ret = `mqtt:cmnd/${topicName}/POWER`;
    }
    return ret;
  },
  makePowerCommandFromCmndTopic: (cmndTopic) => {
    let ret = '';
    const re = /^cmnd\/\w*$/;
    if (re.test(cmndTopic)) {
      ret = `mqtt:${cmndTopic}/POWER`;
    }
    return ret;
  },
  extractNameFromStatTopic: (statTopic, defaultName = '') => {
    let ret = defaultName;

    const re = /stat\/(\w*)*/;
    const parts = re.exec(statTopic);

    if (parts && parts.length === 2) {
      ret = parts[1];
    }

    return ret;
  },
});

export default SonoffPowTopicHanlders;
