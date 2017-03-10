export default function messageMediator() {
  const messageHandlers = [];

  return {
    addHandler: (messageType, handler) => {
      messageHandlers[messageType] = handler;
    },
    process: (message) => {
      if (Object.keys(messageHandlers).indexOf(message.Type) !== -1) {
        messageHandlers[message.Type](message);
      }
    },
  };
}
