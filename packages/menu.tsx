/**
 * User: CHT
 * Date: 2020/11/4
 * Time: 15:15
 */
import {defineComponent, PropType, SetupContext, withModifiers} from 'vue'
import {isFun} from './utils'
import {CSSProperties} from '@vue/runtime-dom'


type MenuEvents = {
  menuSelected: (item: MenuItem) => void
}


function menuStyle(position: Coordinate): CSSProperties {
  const [left, top] = position
  const result: CSSProperties = {
    left: left + 'px',
    top: top + 'px'
  }
  return result
}


export default defineComponent({
  name: 'FlowMenu',
  props: {
    position: {
      type: Array as any as PropType<Coordinate>,
      default: () => [0, 0]
    },
    source: {
      type: Object as PropType<MenuSelectedItem>,
      default: null
    },
    menuList: {
      type: Array as PropType<MenuItem[][]>,
      default: () => []
    }
  },
  emits: ['menuSelected'],
  setup(props, {emit, slots}: SetupContext<MenuEvents>) {
    
    function renderMenuItem(subList: MenuItem[]) {
      return subList.map(item => {
        const isDisable: boolean = item.disable?.(props.source) || false
        const clsList = ['super-menu__item']
        if (isDisable) {
          clsList.push('is-disable')
        }
        return (
          <li
            onMousedown={ withModifiers(() => null, ['stop', 'prevent']) }
            onClick={ () => isDisable ? null : emit('menuSelected', item) }
            class={ clsList.join(' ') }>
            { slots.default?.(item) || item.label }
          </li>
        )
      })
    }
    
    function filterMenuList() {
      const menuList: MenuItem[][] = []
      props.menuList.forEach((subList: MenuItem[]) => {
        const filterList = subList.filter(item => !Boolean(item.hidden?.(props.source)))
        if (filterList.length) {
          menuList.push(filterList)
        }
      })
      return menuList
    }
    
    return () => {
      const menuList = filterMenuList()
      const clsList = ['super-menu__container']
      if (menuList.length === 0) {
        clsList.push('hidden')
      }
      
      return (
        <div
          class={ clsList.join(' ') }
          style={ {
            left: props.position[0] + 'px',
            top: props.position[1] + 'px'
          } }>
          {
            menuList.map((subList: MenuItem[]) => (
              <ul class="super-menu__sub-list">
                { renderMenuItem(subList) }
              </ul>
            ))
          }
        </div>
      )
    }
  }
})
