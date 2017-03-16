const EventAppender = (eventProvider) => {
  return {
    process: (event) => {
      eventProvider.add(event);
    },
  };
};

export default EventAppender;
