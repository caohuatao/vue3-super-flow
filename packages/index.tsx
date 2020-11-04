/**
 * User: CHT
 * Date: 2020/11/3
 * Time: 17:46
 */

import {
  PropType,
  defineComponent
} from 'vue'

export default defineComponent({
  name: 'SuperFlow',
  props: {
    scale: {
      type: Number as PropType<number>,
      default: 1
    },
    origin: {
      type: Array as unknown as PropType<Coordinate>,
      default: () => [0, 0]
    },
    nodeList: {
      type: Array as PropType<NodeItem[]>,
      default: () => []
    },
    lineList: {
      type: Array as PropType<LineItem[]>,
      default: () => []
    },
    lineStyle: {
      type: Function as PropType<(line: LineItem) => LineStyle>,
      default: null
    },
    lineDesc: {
      type: Function as PropType<(line: LineItem) => string>,
      default: ''
    }
  },
  setup(props, {emit, slots, attrs}) {
    return () => {
      
      return (
        <div class="super-flow__container">
  
        </div>
      )
    }
  }
})
