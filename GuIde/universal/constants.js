export const workerQueueKey = 'redis:worker';
export const skippedQueueKey = 'redis:skipped';
export function processingQueueKeyFn(id) {
  return `redis:${id}:procssing`;
}
