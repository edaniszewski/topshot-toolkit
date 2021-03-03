// Common code and utilities used throughout the extension.

/**
 * Run the provided callback after the condition is met.
 *
 * @param {function} cond - A function returning true/false which gate the running
 *   of the callback.
 * @param {int} intervalMS - the interval, in milliseconds, to run the conditional
 *   check on.
 * @param {int} timeoutMS - the timeout, in milliseconds, after which to cancel the
 *   conditional check and consider the run a failure.
 * @param {function} callback - The function to run once the condition has been met.
 */
function runAfter(cond, intervalMs, timeoutMs, callback) {
  var intervalID;
  var timeoutID;

  intervalID = setInterval(function() {
    if (cond()) {
      clearInterval(intervalID);
      clearTimeout(timeoutID);
      callback();
    }
  }, intervalMs);

  timeoutID = setTimeout(function() {
    clearInterval(intervalID);
  }, timeoutMs);
}


/**
 * Remove all occurrences of the given value from the array.
 *
 * @param {array} arr - The array to remove occurrences of the value from.
 * @param {any} value - The value to remove.
 *
 * @returns {array} - The array provided as a parameter. It is modified in place
 *    so is only returned as a convenience.
 */
function removeFromArray(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}

/**
 * Run the wrapped function only once. This is useful to ensure that DOM manipulation
 * functions run only once, even if tracked events fire multiple times for a page change.
 *
 * See: https://davidwalsh.name/javascript-once
 *
 */
function once(fn, context) {
  var result;

  return function() {
    if (fn) {
      result = fn.apply(context || this, arguments);
      fn = context = null;
    }
    return result;
  };
}
