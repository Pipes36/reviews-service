const moment = require('moment');

module.exports.dateTransform = (reviewObject) => {
  const inputDate = reviewObject.date;
  let formattedDate = inputDate;

  if (!Number.isNaN(Number(inputDate))) {
    formattedDate = moment(Number(inputDate));
  }
  reviewObject.date = formattedDate

  return reviewObject;

}

// const obj = {
//   date: '1606045468366'
// }

// dateTransform(obj);
