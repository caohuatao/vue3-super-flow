/**
 * User: CHT
 * Date: 2020/11/4
 * Time: 15:32
 */
import {
  inject,
  reactive,
  PropType,
  CSSProperties,
  defineComponent,
  ref,
  unref,
  onMounted,
  onUnmounted,
  withModifiers,
  SetupContext
} from 'vue'
import {useListenerEvent} from './hooks'

export enum Direction {
  TOP,
  RIGHT,
  BOTTOM,
  LEFT
}

type NodeEvents = {
  nodeMousedown: (evt: MouseEvent) => void,
  nodeContextmenu: (evt: MouseEvent) => void,
  nodeCreateLine: (startAt: Coordinate) => void
}

export default defineComponent({
  name: 'FlowNode',
  props: {
    node: {
      type: Object as PropType<NodeItem>,
      required: true
    }
  },
  setup(props, {emit, slots, attrs}: SetupContext<NodeEvents>) {
    const nodeRoot = ref<HTMLDivElement | null>(null)
    const node = props.node
    const contextmenuFun = (evt: MouseEvent) => emit('nodeContextmenu', evt)
    
    function flowNodeDrag(evt: Event) {
      emit('nodeMousedown', evt as MouseEvent)
    }
    
    function flowNodeInitiate(evt: Event) {
      const ele = evt.currentTarget as Element
      const val = ele.getAttribute('flow-node-initiate') || '0,0'
      const [left = 0, top = 0] = val.split(',').map(item => {
        const n = Number(item)
        return isNaN(n) ? 0 : n
      })
      document.body.style.userSelect = 'none'
      emit('nodeCreateLine', [left, top])
    }
    
    useListenerEvent({
      root: nodeRoot,
      query: '[flow-node-drag]',
      event: 'mousedown',
      listener: withModifiers(flowNodeDrag, ['stop', 'prevent'])
    })
    
    useListenerEvent({
      root: nodeRoot,
      query: '[flow-node-initiate]',
      event: 'mousedown',
      listener: withModifiers(flowNodeInitiate, ['stop', 'prevent'])
    })
    
    return () => (
      <div
        ref={ nodeRoot }
        style={ {
          left: node.coordinate[0] + 'px',
          top: node.coordinate[1] + 'px',
          width: node.width + 'px',
          height: node.height + 'px',
          position: 'absolute'
        } }
        onContextmenu={ withModifiers(contextmenuFun, ['stop', 'prevent']) }
        tabindex={ -1 }
        class="super-flow__node">
        { slots.default?.(node) }
      </div>
    )
  }
})
