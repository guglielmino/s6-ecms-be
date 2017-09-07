const transformDailyStatForJson = stat => ({
  date: stat._id, // eslint-disable-line no-underscore-dangle
  gateway: stat.gateway ? stat.gateway : '',
  value: stat.today,
});

const transformDailyStatForExcel = stat => ({
  date: stat._id.toISOString().slice(0, 10), // eslint-disable-line no-underscore-dangle
  consume: stat.today,
});

const transformDailyStat = (stat, format) => {
  const isExcel = format === 'excel';
  return isExcel ? transformDailyStatForExcel(stat) :
    transformDailyStatForJson(stat);
};

export { transformDailyStat }; // eslint-disable-line import/prefer-default-export
