/**
 * User: CHT
 * Date: 2020/11/4
 * Time: 9:52
 */

import {ref, Ref, onMounted, onUnmounted, unref} from 'vue'
import {addVector, arrayExchange, differ, minus, multiply} from './utils'


type UseMouseMoveReturn = [Ref<boolean>, Ref<Coordinate>, (evt: MouseEvent) => void]
type MoveCallback = (offset: Ref<Coordinate>) => any
type upCallback = () => any

export function useMousemove(moveCallBack?: MoveCallback, upCallBack?: upCallback): UseMouseMoveReturn {
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

export function useMoveNode(origin: Coordinate, scale: number, nodeList: NodeItem[]) {
  const [nodeMove, nodeOffset, mousedown] = useMousemove(nodeMoveCallback)
  let start: Coordinate = [0, 0]
  let current: NodeItem
  
  function nodeMoveCallback(offset: Ref<Coordinate>) {
    current!.coordinate = addVector(
      start,
      multiply(unref(offset), 1 / scale)
    )
  }
  
  function nodeMousedown(evt: MouseEvent, node: NodeItem, idx: number) {
    current = node
    start = differ(origin, node.coordinate)
    mousedown(evt)
    arrayExchange(nodeList, idx)
  }
  
  return {
    nodeMove,
    nodeOffset,
    nodeMousedown
  }
}



interface MenuConfig {
  list: MenuItem[][]
  handler: GraphHandler | NodeHandler | LineHandler
  source: NodeItem | LineItem | null
}

interface UseMenuReturn {
  menuShow: Ref<boolean>
  menuPosition: Ref<Coordinate>
  menuConfig: MenuConfig
  
  menuOpen(evt: MouseEvent, config: MenuConfig): void
  
  menuClose(): void
  
  menuSelected(item: MenuItem): void
}

export function useMenu(scale: number = 1, root: Ref<Element | null>, baseConfig: MenuConfig): UseMenuReturn {
  const menuShow = ref<boolean>(false)
  const menuPosition = ref<Coordinate>([0, 0])
  const menuConfig: MenuConfig = {...baseConfig}
  let offset: Coordinate = [0, 0]
  
  onMounted(() => {
    document.addEventListener('mousedown', menuClose)
    window.addEventListener('scroll', menuClose, true)
  })
  
  onUnmounted(() => {
    document.removeEventListener('mousedown', menuClose)
    window.removeEventListener('scroll', menuClose, true)
  })
  
  function menuOpen(evt: MouseEvent, config: MenuConfig = baseConfig) {
    Object.assign(menuConfig, config)
    
    const {top, left} = unref(root)!.getBoundingClientRect()
    menuPosition.value = [evt.clientX, evt.clientY]
    menuShow.value = true
    offset = [left, top]
  }
  
  function menuClose() {
    menuShow.value = false
  }
  
  function menuSelected(item: MenuItem) {
    item.selected(
      multiply(minus(menuPosition.value, offset), 1 / scale),
      menuConfig.handler,
      menuConfig.source
    )
    menuShow.value = false
  }
  
  return {
    menuShow,
    menuPosition,
    menuOpen,
    menuClose,
    menuSelected,
    menuConfig
  }
}
