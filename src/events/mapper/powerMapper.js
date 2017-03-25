import SonoffPowTopicHanlders from '../../services/sonoffPowTopicHandler';

const sonoffPowTopicHanlders = SonoffPowTopicHanlders();

export default function powerMapper(e) {
  return { ...e,
    Payload: {
      Topic: e.Payload.Topic,
      Power: e.Payload.Power.toLowerCase(),
      TopicName: sonoffPowTopicHanlders.extractNameFromStatTopic(e.Payload.Topic),
    },
  };
}
