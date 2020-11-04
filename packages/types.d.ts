/**
 * User: CHT
 * Date: 2020/11/4
 * Time: 9:39
 */

type LineId = string | number
type NodeId = string | number
type Coordinate = [number, number]
type Color = string

interface NodeItem {
  id: NodeId
  width: number
  height: number
  coordinate: Coordinate
  meta?: { [key: string]: any }
}

interface LineItem {
  id: LineId
  startId: NodeId
  endId: NodeId
  startAt: Coordinate
  endAt: Coordinate
  meta?: { [key: string]: any }
}

interface LineStyle {
  type?: 'solid' | 'dotted'
  lineColor?: Color
  lineHover?: Color
  descColor?: Color
  descHover?: Color
  font?: Color
  lineDash?: [number, number]
  background?: Color
}

interface MenuItem<T> {
  label: string
  meta?: { [key: string]: any }
  disable?: boolean | ((o: T) => boolean)
  hidden?: boolean | ((o: T) => boolean)
  
  selected(o: T, coordinate: Coordinate): void
}
