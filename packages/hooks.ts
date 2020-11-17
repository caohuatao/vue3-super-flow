/**
 * User: CHT
 * Date: 2020/11/4
 * Time: 9:52
 */

import { ref, Ref, onMounted, onUnmounted } from 'vue'
import { minus, multiply } from './utils'

export function useMousemove(
  moveCallBack?: (offset: Ref<Coordinate>) => any,
  upCallBack?: () => any
): [
  Ref<boolean>,
  Ref<Coordinate>,
  (evt: MouseEvent) => void
] {
  const isMove = ref(false)
  const offset = ref(<Coordinate>[0, 0])
  let mousedownCoordinate: Coordinate = [0, 0]
  let isDown: boolean = false
  
  onMounted(() => {
    document.addEventListener('mousemove', mousemove)
    document.addEventListener('mouseup', mouseup)
  })
  
  onUnmounted(() => {
    document.removeEventListener('mousemove', mousemove)
    document.removeEventListener('mouseup', mouseup)
  })
  
  function mousedown(evt: MouseEvent) {
    isDown = true
    mousedownCoordinate = [evt.clientX, evt.clientY]
    document.body.style.userSelect = 'none'
  }
  
  function mouseup() {
    isMove.value = false
    isDown = false
    upCallBack?.()
    document.body.style.userSelect = ''
  }
  
  function mousemove(evt: MouseEvent): void {
    if (!isDown) return
    
    const [x, y] = mousedownCoordinate
    
    offset.value = [evt.clientX - x, evt.clientY - y]
    moveCallBack?.(offset)
    
    if (!isMove.value) {
      isMove.value =
        Math.abs(evt.clientX - x) > 5 ||
        Math.abs(evt.clientY - y) > 5
    }
  }
  
  return [
    isMove,
    offset,
    mousedown
  ]
}

export function useShowMenu(scale: number = 1): [
  Ref<boolean>,
  Ref<Coordinate>,
  (evt: MouseEvent, offset: Coordinate) => void,
  (evt: MouseEvent) => void,
  (item: MenuItem, source: MenuSelectedItem) => void
] {
  const show = ref(false)
  const position = ref<Coordinate>([0, 0])
  let currentOffset: Coordinate = [0, 0]
  
  function open(evt: MouseEvent, offset: Coordinate) {
    currentOffset = offset
    position.value = [evt.clientX, evt.clientY]
    show.value = true
  }
  
  function close() {
    show.value = false
  }
  
  function itemClick(item: MenuItem, source: MenuSelectedItem) {
    item.selected(
      source,
      multiply(minus(position.value, currentOffset), 1 / scale),
    )
    close()
  }
  
  onMounted(() => {
    document.addEventListener('mousedown', close)
    window.addEventListener('scroll', close, true)
  })
  
  onUnmounted(() => {
    document.removeEventListener('mousedown', close)
    window.removeEventListener('scroll', close, true)
  })
  
  return [
    show,
    position,
    open,
    close,
    itemClick
  ]
}
