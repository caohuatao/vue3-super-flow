/**
 * User: CHT
 * Date: 2020/11/4
 * Time: 9:52
 */
import { ref, reactive, Ref, onMounted, onUnmounted, unref, ComputedRef } from 'vue'
import { addVector, arrayExchange, differ, minus, multiply } from './utils'


export function useDrag(
  moveCallBack?: (offset: Ref<Coordinate>) => any,
  upCallBack?: (...arg: any) => any
): [Ref<boolean>, Ref<Coordinate>, (evt: MouseEvent) => void] {
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


export function useDragNode(
  origin: Coordinate,
  scale: ComputedRef<number>,
  nodeList: NodeItem[]
) {
  const [nodeMove, nodeOffset, mousedown] = useDrag(nodeMoveCallback)
  let start: Coordinate = [0, 0]
  let current: NodeItem
  
  function nodeMoveCallback(offset: Ref<Coordinate>) {
    current!.coordinate = addVector(
      start,
      multiply(unref(offset), 1 / unref(scale))
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
  handler: MenuSelectedHandler
  source: MenuSelectedItem
}

export function useMenu(
  scale: ComputedRef<number>,
  root: Ref<Element | null>,
  baseConfig: MenuConfig
) {
  const menuShow = ref<boolean>(false)
  const menuPosition = ref<Coordinate>([0, 0])
  const menuConfig: MenuConfig = {...baseConfig}
  let offset: Coordinate = [0, 0]
  
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
      multiply(minus(menuPosition.value, offset), 1 / unref(scale)),
      menuConfig.handler,
      menuConfig.source
    )
    menuShow.value = false
  }
  
  onMounted(() => {
    document.addEventListener('mousedown', menuClose)
    window.addEventListener('scroll', menuClose, true)
  })
  
  onUnmounted(() => {
    document.removeEventListener('mousedown', menuClose)
    window.removeEventListener('scroll', menuClose, true)
  })
  
  return {
    menuShow,
    menuPosition,
    menuOpen,
    menuClose,
    menuSelected,
    menuConfig
  }
}

export function useListenerEvent(opt: {
  root: Ref<Element | null>,
  query: string,
  event: string,
  listener: (...arg: any) => any
}) {
  const {
    root,
    query,
    event,
    listener
  } = opt
  let currentEventList: NodeListOf<Element> | [] = []
  
  onMounted(() => {
    currentEventList = unref(root)!.querySelectorAll(query)
    currentEventList.forEach(ele => ele.addEventListener(event, listener))
  })
  
  onUnmounted(() => {
    currentEventList.forEach((ele: Element) => ele.removeEventListener(event, listener))
  })
}

export function useTemLine() {
  let startNoe
  const isLineCreating = ref<boolean>(false)
  const lineTemplate = reactive<LineItem>({
    id: '',
    startId: '',
    endId: '',
    startAt: [0, 0],
    endAt: [0, 0],
    path: []
  })
  
  onMounted(() => {
    document.addEventListener('mousemove', docMousemove)
    document.addEventListener('mouseup', docMouseup)
  })
  
  onUnmounted(() => {
    document.addEventListener('mousemove', docMousemove)
    document.addEventListener('mouseup', docMouseup)
  })
  
  function docMousemove() {
    if (!isLineCreating.value) return
    
  }
  
  function docMouseup() {
    isLineCreating.value = false
  }
  
  function lineStart(startNode: NodeItem, startAt: Coordinate) {
    isLineCreating.value = true
    lineTemplate.startId = startNode.id
    lineTemplate.startAt = startAt
    startNoe = startNode
  }
  
  function lineEnd(endId: NodeId, endAt: Coordinate): LineItem {
    isLineCreating.value = false
    lineTemplate.endId = endId
    lineTemplate.endAt = endAt
    return JSON.parse(JSON.stringify(lineTemplate))
  }
  
  return {
    isLineCreating,
    lineTemplate,
    lineStart,
    lineEnd
  }
}
