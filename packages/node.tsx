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
  withModifiers
} from 'vue'

export default defineComponent({
  name: 'FlowNode',
  props: {
    node: {
      type: Object as PropType<NodeItem>,
      required: true
    }
  },
  setup(props, {emit, slots, attrs}) {
    const node = props.node
    const scale = inject<number>('scale')!
    const origin = inject<Coordinate>('origin')!
    
    function nodeStyle(): CSSProperties {
      return {
        left: node.coordinate[0] + 'px',
        top: node.coordinate[1] + 'px',
        width: node.width + 'px',
        height: node.height + 'px',
        position: 'absolute'
      }
    }
    
    function drag(evt: MouseEvent) {
      emit('nodeMousedown', evt)
    }
    
    function contextmenu(evt: MouseEvent) {
      emit('nodeContextmenu', evt)
    }
    
    return () => (
      <div
        style={nodeStyle()}
        onContextmenu={withModifiers(contextmenu, ['stop', 'prevent'])}
        tabindex={-1}
        class="super-flow__node">
        {slots.default?.({node, drag})}
      </div>
    )
  }
})
