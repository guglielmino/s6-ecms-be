import SonoffPowTopicHanlders from '../../services/sonoffPowTopicHandler';

const topicHanlders = SonoffPowTopicHanlders();

export default function powerMapper(e) {
  return { ...e,
    Payload: {
      Topic: e.Payload.Topic,
      Power: e.Payload.Power.toLowerCase(),
      PowerCommand: topicHanlders
        .makePowerCommandFromTopicName(topicHanlders.extractNameFromTopic('stat', e.Payload.Topic)),
    },
  };
}
