const isEmpty = require('lodash/isEmpty');

const getSkipLimit = (pageNumber) => {
  return {
    skip:
      parseInt(pageNumber, 10) > 1
        ? global.PAGE_SIZE * (parseInt(pageNumber, 10) - 1)
        : 0,
    limit: parseInt(global.PAGE_SIZE, 10),
  };
};

const getQueryRegex = (query) => ({
  $regex: new RegExp(`.*${query.toString().replace(/,\s*$/, '')}.*`),
  $options: 'i',
});

const getQuery = async ({
  modal = null,
  query = {},
  isDeleted = false,
  isGlobal = false,
}) => {
  const updatedQuery =
    !isEmpty(query) && isGlobal
      ? await getGlobalQuery(modal, query, isDeleted)
      : { ...query, isDeleted };

  return updatedQuery;
};

const randomNumber = () => {
  return Math.floor(1000 + Math.random() * 9000);
};
const getCurrentPage = (total) => Math.ceil(total / global.PAGE_SIZE);

exports.getQuery = getQuery;
exports.getSkipLimit = getSkipLimit;
exports.getCurrentPage = getCurrentPage;
exports.getQueryRegex = getQueryRegex;

exports.randomNumber = randomNumber;

module.exports = { getSkipLimit, getQuery, getQueryRegex, randomNumber };
