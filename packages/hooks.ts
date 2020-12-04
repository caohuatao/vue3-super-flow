/**
 * User: CHT
 * Date: 2020/11/4
 * Time: 9:52
 */
import { ref, unref, onMounted, onUnmounted, Ref } from 'vue'

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
