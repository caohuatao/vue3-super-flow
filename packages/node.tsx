/**
 * User: CHT
 * Date: 2020/11/4
 * Time: 15:32
 */
import {
  inject,
  reactive,
  defineComponent,
  ref,
  unref,
  computed,
  watch,
  
  onMounted,
  onUnmounted,
  withModifiers,
  
  SetupContext,
  PropType,
  CSSProperties,
  Ref,
  ComputedRef
} from 'vue'
import { useListenerEvent } from './hooks'
import { addVector, isObject } from './utils'
import { GraphNode } from './Graph'

type NodeEvents = {
  nodeMousedown: (evt: MouseEvent) => void,
  nodeContextmenu: (evt: MouseEvent) => void,
  nodeCreateLine: (evt: MouseEvent, startAt: Coordinate) => void
}

export default defineComponent({
  name: 'FlowNode',
  props: {
    node: {
      type: Object as PropType<GraphNode>,
      required: true
    }
  },
  setup(props, {emit, slots, attrs}: SetupContext<NodeEvents>) {
    const origin = inject<Ref<Coordinate>>('origin')!
    const scale = inject<ComputedRef<number>>('scale')!
    
    const {setting, position} = props.node
    const nodeRoot = ref<HTMLDivElement | null>(null)
    
    const contextmenuFun = (evt: MouseEvent) => emit('nodeContextmenu', evt)
    
    function flowNodeInitiate(evt: MouseEvent) {
      const ele = evt.currentTarget as Element
      const val = ele.getAttribute('flow-node-initiate') || '0,0'
      const [left = 0, top = 0] = val.split(',').map(item => {
        const n = Number(item)
        return isNaN(n) ? 0 : n
      })
      document.body.style.userSelect = 'none'
      emit('nodeCreateLine', evt, [left, top])
    }
    
    useListenerEvent({
      root: nodeRoot,
      query: '[flow-node-drag]',
      event: 'mousedown',
      listener: (evt: Event) => emit('nodeMousedown', evt as MouseEvent)
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
          left: position.value[0] + 'px',
          top: position.value[1] + 'px',
          width: setting.width + 'px',
          height: setting.height + 'px',
          position: 'absolute'
        } }
        onContextmenu={ withModifiers(contextmenuFun, ['stop', 'prevent']) }
        tabindex={ -1 }
        class="super-flow__node">
        { slots.default?.(setting) }
      </div>
    )
  }
})
