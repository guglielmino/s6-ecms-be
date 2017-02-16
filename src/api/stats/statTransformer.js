'use strict';

const transformStat = (stat) => {
  let res = {
    current: stat.Current,
		power: stat.Power
  };

  if(stat._id) {
    res["hour"] = stat._id;
  }
  return res;
}

export { transformStat };