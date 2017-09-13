// TODO: Excel creation strategy must come as parameter from outside (options object)
import nodeExcel from 'excel-export';
import * as _ from 'lodash';
import { createExcelConf } from '../api-utils';

export default contentNegotiation => (req, res, next) => {   // eslint-disable-line no-unused-vars
  res.sendData = (data, mapper = {}) => {
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
        const conf = createExcelConf(_.orderBy(excelMapper ? excelMapper(data) : data, 'date'));
        const excel = nodeExcel.execute(conf);
        res.end(excel, 'binary');
      },
    });
  };
  next();
};
