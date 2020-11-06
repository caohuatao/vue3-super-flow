/**
 * User: CHT
 * Date: 2020/11/3
 * Time: 17:46
 */

import { ref, PropType, defineComponent, withModifiers } from 'vue'
import { useShow } from './hooks'

import SuperMenu from './menu'

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
    lineDesc: {
      type: [Function, String] as PropType<((line: LineItem) => string) | string>,
      default: ''
    },
    lineStyle: {
      type: Function as PropType<(line: LineItem) => LineStyle>,
      default: null
    }
  },
  setup(props, {emit, slots, attrs}) {
    return () => {
      const showMenu = ref(false)
      
      function openMenu(evt: MouseEvent) {
        showMenu.value = true
      }
      
      return (
        <div
          onContextmenu={withModifiers(openMenu, ['stop', 'prevent'])}
          class="super-flow__container">
          <SuperMenu
          
          />
        </div>
      )
    }
  }
})
