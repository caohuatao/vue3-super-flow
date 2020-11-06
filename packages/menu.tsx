/**
 * User: CHT
 * Date: 2020/11/4
 * Time: 15:15
 */
import { defineComponent, PropType } from 'vue'
import { isFun } from './utils'

export default defineComponent({
  name: 'FlowMenu',
  props: {
    position: {
      type: Array as unknown as PropType<Coordinate>,
      default: [0, 0]
    },
    source: {
      type: Object as PropType<NodeItem | LineItem>,
      default: null
    },
    menuList: {
      type: Array as PropType<MenuItem[]>,
      default: () => []
    }
  },
  setup(props, {emit, slots}) {
    
    function renderMenuItem() {
      props.menuList.filter((item: MenuItem) => {
        let result: boolean
        if (isFun(item.hidden)) {
          result = (item.hidden as (o: NodeItem | LineItem) => boolean)(props.source)
        } else {
          result = Boolean(item.hidden)
        }
        return !result
      }).map((item: MenuItem) => {
        return (
          <li class="super-menu__item">
          
          </li>
        )
      })
    }
    
    return () => (
      <ul class="super-menu__container">
        {renderMenuItem()}
      </ul>
    )
  }
})
