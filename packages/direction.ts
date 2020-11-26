/**
 * User: CHT
 * Date: 2020/11/26
 * Time: 14:04
 */

import { addVector, angle, differ, dotProduct, minus, multiply, parallel } from './utils'

export enum Direction {
  Top,
  Right,
  Bottom,
  Left
}

export function getRectDirection(coordinate: Coordinate, rect: Rect): Direction {
  const {topLeft, bottomRight} = rect
    , topRight: Coordinate = [bottomRight[0], topLeft[1]]
    , bottomLeft: Coordinate = [topLeft[0], bottomRight[1]]
    , center: Coordinate = multiply(addVector(topLeft, bottomRight), 0.5)
  
  const angleCurrent = angle(minus(coordinate, center))
    , angleTopLeft = angle(minus(topLeft, center))
    , angleTopRight = angle(minus(topRight, center))
    , angleBottomRight = angle(minus(bottomRight, center))
    , angleBottomLeft = angle(minus(bottomLeft, center))
  
  if (angleCurrent >= angleTopLeft && angleCurrent < angleTopRight) {
    return Direction.Top
  } else if (angleCurrent >= angleTopRight && angleCurrent < angleBottomRight) {
    return Direction.Right
  } else if (angleCurrent >= angleBottomRight && angleCurrent < angleBottomLeft) {
    return Direction.Bottom
  } else {
    return Direction.Left
  }
}

function computedLinePath(
  startDirection: Direction,      // 起始方向向量
  endDirection: Direction,        // 终点方向向量
  startCoordinate: Coordinate,    // 起始坐标
  endCoordinate: Coordinate       // 终点坐标
) {
  // 起点 - 终点 水平方向向量
  const horizontal: Coordinate = [endCoordinate[0] - startCoordinate[0], 0]
  // 起点 - 终点 垂直方向向量
  const vertical: Coordinate = [0, endCoordinate[1] - startCoordinate[1]]
  
  
}


function pathDirection(
  vertical: Coordinate,
  horizontal: Coordinate,
  direction: Coordinate
) {
  if (parallel(horizontal, direction)) {
    if (dotProduct(horizontal, direction) > 0) {
      return horizontal
    } else {
      return vertical
    }
  } else {
    if (dotProduct(vertical, direction)) {
      return vertical
    } else {
      return horizontal
    }
  }
}


function computedDirection(d: Direction): Coordinate {
  switch (d) {
    case Direction.Top:
      return [0, -1]
    case Direction.Right:
      return [1, 0]
    case Direction.Bottom:
      return [0, 1]
    case Direction.Left:
    default:
      return [-1, 0]
  }
}
