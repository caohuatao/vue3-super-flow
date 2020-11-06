/**
 * User: CHT
 * Date: 2020/11/4
 * Time: 9:52
 */

import { ref, Ref, onMounted, onUnmounted } from 'vue'

export function useMousemove() {
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
    document.body.style.userSelect = ''
  }
  
  function mousemove(evt: MouseEvent) {
    if (!isDown) return
    
    const [x, y] = mousedownCoordinate
    
    offset.value = [evt.clientX - x, evt.clientY - y]
    
    if (!isMove.value) {
      isMove.value =
        Math.abs(evt.clientX - x) > 5 ||
        Math.abs(evt.clientY - y) > 5
    }
  }
  
  return {
    isMove,
    offset,
    mousedown
  }
}

export function useShow(
  openBack: null | ((done: () => void) => any) = null,
  closeBack: null | ((done: () => void) => any) = null
): [Ref<boolean>, () => void, () => void] {
  const show = ref(false)
  
  function done(bol: boolean) {
    return () => show.value = bol
  }
  
  function close() {
    if (closeBack) {
      closeBack(done(false))
    } else {
      show.value = false
    }
  }
  
  function open() {
    if (openBack) {
      openBack(done(true))
    } else {
      show.value = true
    }
  }
  
  return [show, open, close]
}
