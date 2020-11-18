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
    const drag = (evt: MouseEvent) => emit('nodeMousedown', evt)
    const contextmenuFun = (evt: MouseEvent) => emit('nodeContextmenu', evt)
    
    return () => (
      <div
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
        { slots.default?.({node, drag}) }
      </div>
    )
  }
})
