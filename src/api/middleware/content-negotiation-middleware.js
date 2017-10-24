// TODO: Excel creation strategy must come as parameter from outside (options object)
import json2csv from 'json2csv';
import { createCsvElements } from '../api-utils';

export default contentNegotiation => (req, res, next) => {   // eslint-disable-line no-unused-vars
  res.sendData = (data, mapper = {}) => { // eslint-disable-line no-param-reassign
    const jsonMapper = mapper['application/json'];
    res.format({
      'application/json': () => {
        res.json(jsonMapper ? jsonMapper(data) : data);
      },
      default: () => {
        res.json(jsonMapper ? jsonMapper(data) : data);
      },
      'application/vnd.ms-excel': () => {
        const excelMapper = mapper['application/vnd.ms-excel'];
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader('Content-Disposition', 'attachment');
        const conf = createCsvElements(excelMapper ? excelMapper(data) : data);
        const csv = json2csv(conf);
        res.end(csv, 'binary');
      },
    });
  };
  next();
};
