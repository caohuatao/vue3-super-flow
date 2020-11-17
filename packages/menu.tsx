/**
 * User: CHT
 * Date: 2020/11/4
 * Time: 15:15
 */
import { defineComponent, PropType, withModifiers } from 'vue'
import { isFun } from './utils'
import { CSSProperties } from '@vue/runtime-dom'

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
    itemClick: {
      type: Function as PropType<(item: MenuItem, source: MenuSelectedItem) => void>,
      default: (item: MenuItem, source: MenuSelectedItem) => null
    },
    menuList: {
      type: Array as PropType<MenuItem[][]>,
      default: () => []
    }
  },
  setup(props, {emit, slots}) {
    
    function renderMenuItem(subList: MenuItem[]) {
      return subList.map(item => {
        const isDisable: boolean = item.disable?.(props.source || undefined) || false
        const clsList = ['super-menu__item']
        if (isDisable) {
          clsList.push('is-disable')
        }
        return (
          <li
            onMousedown={withModifiers(() => null, ['stop', 'prevent'])}
            onClick={() => itemClick(isDisable, item)}
            class={clsList.join(' ')}>
            {slots.default?.(item) || item.label}
          </li>
        )
      })
    }
    
    function renderMenuGroup(menuList: MenuItem[][]) {
      return menuList.map((subList: MenuItem[]) => (
        <ul class="super-menu__sub-list">{renderMenuItem(subList)}</ul>
      ))
    }
    
    function filterSublist() {
      return props.menuList.filter((subList: MenuItem[]) => {
        subList = subList.filter(item => !(item.hidden?.(props.source || undefined) || false))
        return subList.length
      })
    }
    
    function itemClick(isDisable: boolean, item: MenuItem) {
      if (!isDisable) props.itemClick(item, props.source)
    }
    
    return () => {
      const menuList = filterSublist()
      const cls = ['super-menu__container']
      if (menuList.length === 0) {
        cls.push('hidden')
      }
      return (
        <div
          class={cls.join(' ')}
          style={menuStyle(props.position)}>
          {renderMenuGroup(menuList)}
        </div>
      )
    }
  }
})





