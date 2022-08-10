import pify from 'pify';
import { isManifestV3 } from '../../../shared/modules/mv3.utils';

// // A simplified pify maybe?
// function pify(apiObject) {
//   return Object.keys(apiObject).reduce((promisifiedAPI, key) => {
//     if (apiObject[key].apply) { // depending on our browser support we might use a nicer check for functions here
//       promisifiedAPI[key] = function (...args) {
//         return new Promise((resolve, reject) => {
//           return apiObject[key](
//             ...args,
//             (err, result) => {
//               if (err) {
//                 reject(err);
//               } else {
//                 resolve(result);
//               }
//             },
//           );
//         });
//       };
//     }
//     return promisifiedAPI;
//   }, {});
// }

let background = null;
let promisifiedBackground = null;

const actionRetryQueue = [];

function failQueue() {
  actionRetryQueue.forEach(({ reject }) =>
    reject(
      Error('Background operation cancelled while waiting for connection.'),
    ),
  );
}

/**
 * Drops the entire actions queue. Rejects all actions in the queue unless silently==true
 *
 * @param {boolean} [silently]
 */
export function dropQueue(silently) {
  if (!silently) {
    failQueue();
  }
  actionRetryQueue.length = 0;
}

// add action to queue
const addToActionQueue = (actionId, request, resolve, reject) => {
  if (actionRetryQueue.some((act) => act.actionId === actionId)) {
    return;
  }
  actionRetryQueue.push({
    actionId,
    request,
    resolve,
    reject,
  });

  processActionRetryQueue();
};

// remove action from queue on successful completion
const removeFromActionQueue = (actionId) => {
  const index = actionRetryQueue.find((act) => act.actionId === actionId);
  actionRetryQueue.splice(index, 1);
};

/**
 * Promise-style call to background method
 * In MV2: invokes promisifiedBackground method directly.
 * In MV3: action is added to retry queue, along with resolve handler to be executed on completion,
 *  the queue is then immediately processed if background connection is available.
 *  On completion (successful or error) the action is removed from the retry queue.
 *
 * @param {string} method - name of the background method
 * @param {Array} [args] - arguments to that method, if any
 * @param {any} [actionId] - if an action with the === same id is submitted, it'll be ignored if already in queue.
 * @returns {Promise}
 */
export function submitRequestToBackground(
  method,
  args = [],
  actionId = Date.now() + Math.random(), // current date is not guaranteed to be unique
) {
  if (isManifestV3()) {
    return new Promise((resolve, reject) => {
      addToActionQueue(actionId, { method, args }, resolve, reject);
    });
  }
  return promisifiedBackground[method](...args);
}

/**
 * Callback-style call to background method
 * In MV2: invokes promisifiedBackground method directly.
 * In MV3: action is added to retry queue, along with resolve handler to be executed on completion,
 *  the queue is then immediately processed if background connection is available.
 *  On completion (successful or error) the action is removed from the retry queue.
 *
 * @param {string} method - name of the background method
 * @param {Array} [args] - arguments to that method, if any
 * @param callback - Node style (error, result) callback for finishing the operation
 * @param {any} [actionId] - if an action with the === same id is submitted, it'll be ignored if already in queue.
 */
export const callBackgroundMethod = (
  method,
  args = [],
  callback,
  actionId = Date.now() + Math.random(), // current date is not guaranteed to be unique
) => {
  if (isManifestV3()) {
    const resolve = (value) => callback(null, value);
    const reject = (err) => callback(err);
    addToActionQueue(actionId, { method, args }, resolve, reject);
  } else {
    background[method](...args, callback);
  }
};

// A thenable like Promise.resolve() but it doesn't introduce an asynchronous delay.
const syncThenable = {
  then: (cb) => cb(),
};

// Clears list of pending action in actionRetryQueue
// The results of background calls are wired up to the original promises that's been returned
// The first method on the queue gets called synchronously to make testing and reasoning about
//  a single request to an open connection easier.
function processActionRetryQueue() {
  if (background.connectionStream.readable) {
    // Iterating by index over a queue that's potentially being spliced and pushed to is not great. Let's copy.
    const actionRetryQueueSnapshot = [...actionRetryQueue];
    actionRetryQueueSnapshot.reduce(
      (
        previousPromise,
        { request: { method, args }, actionId, resolve, reject },
      ) => {
        // eslint-disable-next-line consistent-return
        return previousPromise.then(() => {
          if (background.connectionStream.readable) {
            try {
              return promisifiedBackground[method](...args)
                .then((result) => {
                  removeFromActionQueue(actionId);
                  resolve(result);
                })
                .catch((err) => {
                  removeFromActionQueue(actionId);
                  reject(err);
                });
            } catch (err) {
              removeFromActionQueue(actionId);
              reject(err);
            }
          }
          return syncThenable;
        });
      },
      syncThenable,
    );
  }
}

/**
 * Sets/replaces the background connection reference
 * Under MV3 it also triggers queue processing if the new background is connected
 *
 * @param {*} backgroundConnection
 */
export async function _setBackgroundConnection(backgroundConnection) {
  background = backgroundConnection;
  promisifiedBackground = pify(background);
  if (isManifestV3()) {
    // This function call here will clear the queue of actions
    // collected while connection stream was not available.
    processActionRetryQueue();
  }
}
