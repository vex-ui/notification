import { isRef } from 'vue'
import type { WatchSource, MaybeRefOrGetter } from 'vue'

// ----------------------------------------------------------------------------------------------------

export const noop = () => {}
export const isClient = typeof window !== 'undefined'
export const isString = (v: unknown): v is string => typeof v === 'string'
export const isFunction = (v: unknown): v is Function => v instanceof Function
export const isArray = Array.isArray
export const isWatchable = <T>(v: MaybeRefOrGetter<T>): v is WatchSource<T> => {
  return isRef(v) || isFunction(v)
}

/**
 * removes an item from an array if it exists.
 * mutates the original array.
 */
export function remove<T>(array: T[], item: T) {
  const index = array.indexOf(item)
  if (index > -1) array.splice(index, 1)
}
