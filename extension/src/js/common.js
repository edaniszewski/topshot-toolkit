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