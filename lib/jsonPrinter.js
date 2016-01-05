'use strict';

function printJson(data, options) {
  options = options || {};

  var printStr;
  if (options.pretty)
    printStr = JSON.stringify(data, null, options.spaces || 2);
  else
    printStr = JSON.stringify(data);

  console.log();
  console.log(printStr);
}

module.exports = {
  print: printJson
};
