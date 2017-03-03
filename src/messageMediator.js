

export default function messageMediator() {
  const messageHandlers = [];

  return {
    addHandler: (messageType, handler) => {
      messageHandlers[messageType] = handler;
    },
    process: (message) => {
      if (Object.keys(messageHandlers).indexOf(message.Type) !== -1) {
        return messageHandlers[message.Type];
      }

      return null;
    },
  };
}
