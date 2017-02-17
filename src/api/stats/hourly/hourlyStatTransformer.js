'use strict';

const transformHourlyStat = (stat) => {
	return {
		current: stat.Current,
		power: stat.Power,
		hour: stat._id
	};

};

export { transformHourlyStat };