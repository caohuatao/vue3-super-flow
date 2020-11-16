/**
 * User: CHT
 * Date: 2020/11/4
 * Time: 15:32
 */
import { defineComponent, PropType, inject, reactive } from 'vue'
import { CSSProperties } from '@vue/runtime-dom'

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
        height: node.height + 'px'
      }
    }
    
    function drag(evt: MouseEvent) {
      console.log('drag')
      emit('nodeMousedown', evt)
    }
    
    return () => (
      <div
        style={nodeStyle()}
        class="super-flow__node">
        {slots.default?.({node, drag})}
      </div>
    )
  }
})
