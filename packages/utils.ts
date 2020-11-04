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

export function getOffset(evt: MouseEvent, target?: Element) {
  const {
    clientX,
    clientY,
    currentTarget
  } = evt
  
  const current = target || <Element>currentTarget
  
  const {
    left,
    top
  } = current.getBoundingClientRect()
  
  return [clientX - left, clientY - top]
}

// 向量相加
export function addVector(vectorA: Coordinate, vectorB: Coordinate): Coordinate {
  return [vectorA[0] + vectorB[0], vectorA[1] + vectorB[1]]
}

//  向量乘以常量系数
export function multiply(vector: Coordinate, k: number): Coordinate {
  return [vector[0] * k, vector[1] * k]
}

export function differ(pointA: Coordinate, pointB: Coordinate): Coordinate {
  return [pointB[0] - pointA[0], pointB[1] - pointA[1]]
}

export function minus(pointA: Coordinate, pointB: Coordinate): Coordinate {
  return [pointA[0] - pointB[0], pointA[1] - pointB[1]]
}

// 向量点积
export function dotProduct(vectorA: Coordinate, vectorB: Coordinate): number {
  return vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1]
}

// 向量叉乘
export function cross(vectorA: Coordinate, vectorB: Coordinate): number {
  return vectorA[0] * vectorB[1] - vectorA[1] * vectorB[0]
}

// 向量的单位向量
export function unitVector(vector: Coordinate): Coordinate {
  const m = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1])
  return [vector[0] / m, vector[1] / m]
}

// 判断向量 x,y 坐标相等
export function equals(vector: Coordinate, target: Coordinate): boolean {
  return vector[0] === target[0] && vector[1] === target[1]
}

// 向量夹角
export function angle(vector: Coordinate): number {
  return Math.round(180 / Math.PI * Math.atan2(vector[1], vector[0])) + 180
}

// 判断向量是否平行
export function parallel(vectorA: Coordinate, vectorB: Coordinate): boolean {
  return vectorA[0] * vectorB[1] - vectorA[1] * vectorB[0] === 0
}

// 判断 y 轴相等
export function yAxisEqual(vectorA: Coordinate, vectorB: Coordinate): boolean {
  return vectorA[1] === vectorB[1]
}

// 判断 x 轴相等
export function xAxisEqual(vectorA: Coordinate, vectorB: Coordinate): boolean {
  return vectorA[0] === vectorB[0]
}

