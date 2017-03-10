export default function messageMediator() {
  const messageHandlers = [];

  return {
    addHandler: (predicate, handler) => {
      messageHandlers.push({ predicate, fn: handler });
    },
    process: (message) => {
      messageHandlers
        .filter(o => o.predicate(message))
        .map(p => p.fn(message));
    },
  };
}
