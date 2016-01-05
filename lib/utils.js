'use strict';

var moment = require('moment');

var Weekdays = {
  '1': 'Monday',
  '2': 'Tuesday',
  '3': 'Wednesday',
  '4': 'Thursday',
  '5': 'Friday',
  '6': 'Saturday',
  '7': 'Sunday'
};

function calculateOffset(month) {
  if (!month)
    return 1;

  var date = moment(month, 'MM/YYYY');
  if (!date.isValid())
    return 1;

  var today = new Date();

  if (date.isAfter(today))
    return 1;

  return Math.abs(date.diff(today, 'months')) + 1;
}

function dayDiff(start, end) {
  end = moment(end);
  return Math.ceil(Math.abs(end.diff(start, 'days', true)));
}

function getLocalDate(isoDate) {
  return moment(isoDate, 'YYYY-MM-DD').format('DD.MM.YYYY');
}

function getWeekday(index) {
  return Weekdays[index];
}

function clipRecordsData(data, range) {
  if (range === 'all')
    return data;

  var firstDayOfMonth = moment().startOf('month');
  var firstDayOfRange = moment().startOf(range);
  var today = moment();

  var start = dayDiff(firstDayOfMonth, firstDayOfRange);
  var count = dayDiff(firstDayOfRange, today);

  // locus trap
  // eval(require('locus'));

  var records = data.records.slice(start, start + count);

  return {
    month: data.month,
    records: records
  };
}

module.exports = {
  calculateOffset: calculateOffset,
  dayDiff: dayDiff,
  clipRecordsData: clipRecordsData,
  getLocalDate: getLocalDate,
  getWeekday: getWeekday
};
