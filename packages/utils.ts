/**
 * User: CHT
 * Date: 2020/11/4
 * Time: 13:47
 */

export function uuid(before = '', after = '') {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const charsLen = chars.length
  let uuid = []
  const len = 16
  for (let i = 0; i < len; i++) {
    uuid[i] = chars[0 | Math.random() * charsLen]
  }
  return before + uuid.join('') + after
}

export function addVector(vectorA: Coordinate, vectorB: Coordinate): Coordinate {
  return [vectorA[0] + vectorB[0], vectorA[1] + vectorB[1]]
}

export function multiply(vector: Coordinate, k: number): Coordinate {
  return [vector[0] * k, vector[1] * k]
}

export function differ(pointA: Coordinate, pointB: Coordinate): Coordinate {
  return [pointB[0] - pointA[0], pointB[1] - pointA[1]]
}

export function minus(pointA: Coordinate, pointB: Coordinate): Coordinate {
  return [pointA[0] - pointB[0], pointA[1] - pointB[1]]
}

export function dotProduct(vectorA: Coordinate, vectorB: Coordinate): number {
  return vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1]
}

export function cross(vectorA: Coordinate, vectorB: Coordinate): number {
  return vectorA[0] * vectorB[1] - vectorA[1] * vectorB[0]
}

export function unitVector(vector: Coordinate): Coordinate {
  const m = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1])
  return [vector[0] / m, vector[1] / m]
}

export function equals(vector: Coordinate, target: Coordinate): boolean {
  return vector[0] === target[0] && vector[1] === target[1]
}

export function angle(vector: Coordinate): number {
  return Math.round(180 / Math.PI * Math.atan2(vector[1], vector[0]))
}

export function parallel(vectorA: Coordinate, vectorB: Coordinate): boolean {
  return vectorA[0] * vectorB[1] - vectorA[1] * vectorB[0] === 0
}

export function yAxisEqual(vectorA: Coordinate, vectorB: Coordinate): boolean {
  return vectorA[1] === vectorB[1]
}

export function xAxisEqual(vectorA: Coordinate, vectorB: Coordinate): boolean {
  return vectorA[0] === vectorB[0]
}


export function toRawType(val: any): string {
  return Object.prototype.toString.call(val).slice(8, -1).toLocaleLowerCase()
}

export function isFun<T extends (...args: any) => any>(val: any): val is T {
  return toRawType(val) === 'function'
}

export function isArray<T extends any[]>(val: any): val is T {
  return toRawType(val) === 'array'
}

export function isNumber(val: any): val is number {
  return toRawType(val) === 'number'
}

export function isBool(val: any): val is boolean {
  return toRawType(val) === 'boolean'
}

export function isUndef(val: any): val is undefined {
  return toRawType(val) === 'undefined'
}

export function isString(val: any): val is string {
  return toRawType(val) === 'string'
}

export function isObject<T extends object>(val: any): val is T {
  return toRawType(val) === 'object'
}

export function arrayExchange(list: any[], oldIdx: number, newIdx?: number): void {
  if (!isNumber(newIdx)) {
    newIdx = list.length - 1
  }
  list.splice(newIdx, 0, ...list.splice(oldIdx, 1))
}

