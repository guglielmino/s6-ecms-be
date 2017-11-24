import * as consts from '../../../consts';

export default queryStringPaging => (req, res, next) => { // eslint-disable-line no-unused-vars
  let pageSize = req.query.pageSize;
  const lastObjectId = req.query.lastObjectId;
  const pagination = {};

  pageSize = parseInt(pageSize, 10);
  pageSize = pageSize > consts.PAGING_MAX_PAGE_SIZE ? consts.PAGING_MAX_PAGE_SIZE : pageSize;
  pagination.pageSize = pageSize;
  pagination.lastObjectId = lastObjectId;
  req.pagination = pagination;  // eslint-disable-line no-param-reassign
  res.pagedData = (data, mapper) => {   // eslint-disable-line no-param-reassign
    let result = {};
    const { list, ...pagingInfo } = data;
    result.items = list.map(e => mapper(e));
    result = { ...result, ...pagingInfo };
    return result;
  };
  next();
};
