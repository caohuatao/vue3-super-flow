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
  Ref,
  CSSProperties
} from 'vue'

import { useMousemove, useShowMenu } from './hooks'
import { addVector, arrayExchange, differ, multiply } from './utils'
import FlowMenu from './menu'
import FlowNode from './node'

import './index.less'

interface Events {
  onNodeMousedown: [string]
}

enum MenuType {
  GRAPH,
  NODE,
  LINE
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
    const scale = props.scale > 0 ? props.scale : 1
    
    
    
    const root = ref<Element | null>(null)
    const [menuShow, menuPosition, menuOpen, menuClose, menuItemClick] = useShowMenu(scale)
    const [nodeMove, nodeOffset, nodeMousedown] = useMousemove(nodeMoveCallback)

    let moveNodeStartCoordinate: Coordinate = [0, 0]
    let menuSource: MenuSelectedItem
    let currentMoveNode: NodeItem
    let menuList: MenuItem[][] = props.graphMenuList
    
    function nodeMousedownHandler(evt: MouseEvent, node: NodeItem, idx: number) {
      currentMoveNode = node
      moveNodeStartCoordinate = differ(props.origin, node.coordinate)
      nodeMousedown(evt)
      arrayExchange(props.nodeList, idx)
    }
    
    function nodeMoveCallback(offset: Ref<Coordinate>) {
      currentMoveNode!.coordinate = addVector(
        moveNodeStartCoordinate,
        multiply(unref(offset), 1 / scale)
      )
    }
    
    function addNodeItem() {}
    
    function removeNodeItem() {}
    
    function removeLineItem() {}
    
    function renderNodeList() {
      return props.nodeList.map((node: NodeItem, idx) => (
        <FlowNode
          key={node.id}
          node={node}
          onNodeMousedown={(evt: MouseEvent) => nodeMousedownHandler(evt, node, idx)}
          onNodeContextmenu={(evt: MouseEvent) => openMenuHandler(evt, MenuType.NODE, node)}
          v-slots={
            {default: slots.default}
          }
        />
      ))
    }
    
    function openMenuHandler(evt: MouseEvent, type = MenuType.GRAPH, source?: MenuSelectedItem) {
      const {top, left} = unref(root)!.getBoundingClientRect()
      
      if(type === MenuType.LINE) {
        menuList = props.lineMenuList
      } else if(type === MenuType.NODE) {
        menuList = props.nodeMenuList
      } else {
        menuList = props.graphMenuList
      }
      
      if (source) {
        menuSource = source
      } else {
        menuSource = {
          addNodeItem
        }
      }
      
      menuOpen(evt, [left, top])
    }
    
    function containerStyle(): CSSProperties {
      return {
        position: 'relative',
        transform: `scale(${scale})`,
        transformOrigin: `${props.origin[0]}px ${props.origin[1]}px`
      }
    }
    
    return () => (
      <>
        <div
          {...attrs}
          class="super-flow__container"
          ref={root}
          style={containerStyle()}
          onContextmenu={withModifiers(openMenuHandler, ['stop', 'prevent'])}>
          {renderNodeList()}
        </div>
        <FlowMenu
          v-show={unref(menuShow)}
          position={unref(menuPosition)}
          source={menuSource!}
          itemClick={menuItemClick}
          menuList={menuList}
          v-slots={
            {default: slots.menuItem}
          }
        />
      </>
    )
  }
})
