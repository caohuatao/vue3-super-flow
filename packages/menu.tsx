/**
 * User: CHT
 * Date: 2020/11/4
 * Time: 15:15
 */
import { defineComponent, PropType, withModifiers } from 'vue'
import { isFun, getSlot } from './utils'
import { CSSProperties } from '@vue/runtime-dom'

function menuStyle(position: Coordinate): CSSProperties {
  const [left, top] = position
  return {
    left: left + 'px',
    top: top + 'px'
  }
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
        const isDisable: boolean = item.disable?.(props.source) || false
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
    
    function renderMenuGroup() {
      return props.menuList.map((subList: MenuItem[]) => {
        subList = subList.filter(item => !(item.hidden?.(props.source) || false))
        if (subList.length) {
          return (
            <ul class="super-menu__sub-list">{renderMenuItem(subList)}</ul>
          )
        }
      })
    }
    
    function itemClick(isDisable: boolean, item: MenuItem) {
      if (!isDisable) props.itemClick(item, props.source)
    }
    
    return () => (
      <div
        class="super-menu__container"
        style={menuStyle(props.position)}>
        {renderMenuGroup()}
      </div>
    )
  }
})





