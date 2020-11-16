/**
 * User: CHT
 * Date: 2020/11/3
 * Time: 17:46
 */

import {
  ref,
  unref,
  PropType,
  defineComponent,
  withModifiers,
  provide,
  SetupContext
} from 'vue'
import { useMousemove, useShowMenu } from './hooks'

import FlowMenu from './menu'
import FlowNode from './node'

import './index.less'

interface Events {
  onNodeMousedown: [string]
}

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
    },
    graphMenuList: {
      type: Array as PropType<MenuItem[][]>,
      default: () => []
    },
    nodeMenuList: {
      type: Array as PropType<MenuItem[][]>,
      default: () => []
    },
    lineMenuList: {
      type: Array as PropType<MenuItem[][]>,
      default: () => []
    }
  },
  
  setup(props, {emit, slots, attrs}) {
    provide('scale', props.scale)
    provide('origin', props.origin)
    provide('nodeList', props.nodeList)
    
    const menuSource = ref({
      addNodeItem
    })
    const root = ref<Element | null>(null)
    const [menuShow, menuPosition, menuOpen, menuClose, menuItemClick] = useShowMenu()
    const [nodeMoveing, nodeOffset, nodeMousedown] = useMousemove()
    
    function nodeMousedownHandler() {
      console.log(arguments)
    }
    
    function addNodeItem() {}
    
    function removeNodeItem() {}
    
    function removeLineItem() {}
    
    function renderNodeList() {
      return props.nodeList.map(node => (
        <FlowNode
          key={node.id}
          node={node}
          onNodeMousedown={nodeMousedownHandler}
          v-slots={
            {default: slots.default}
          }
        />
      ))
    }
    
    function openMenuHandler(evt: MouseEvent) {
      const {top, left} = unref(root)!.getBoundingClientRect()
      menuOpen(evt, [left, top])
    }
    
    return () => (
      <div
        ref={root}
        onContextmenu={withModifiers(openMenuHandler, ['stop', 'prevent'])}
        class="super-flow__container">
        <FlowMenu
          v-show={unref(menuShow)}
          position={unref(menuPosition)}
          source={unref(menuSource)}
          itemClick={menuItemClick}
          menuList={props.graphMenuList}
          v-slots={
            {default: slots.menuItem}
          }
        />
        {renderNodeList()}
      </div>
    )
  }
})
