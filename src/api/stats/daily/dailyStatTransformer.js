const transformDailyStat = stat => ({
  date: stat._id, // eslint-disable-line no-underscore-dangle
  gateway: stat.gateway ? stat.gateway : '',
  value: stat.today,
});

export { transformDailyStat }; // eslint-disable-line import/prefer-default-export
