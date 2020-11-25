/**
 * User: CHT
 * Date: 2020/11/3
 * Time: 17:46
 */

import {ref, unref, PropType, defineComponent, withModifiers, provide, Ref} from 'vue'
import {useMenu, useDragNode, useTemLine} from './hooks'
import {addVector, arrayExchange, differ, multiply} from './utils'
import FlowMenu from './menu'
import FlowNode from './node'

import './index.less'

export default defineComponent({
  name: 'SuperFlow',
  props: {
    scale: {
      type: Number as PropType<number>,
      default: 1
    },
    origin: {
      type: Array as any as PropType<Coordinate>,
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
      type: Function as PropType<(line: LineItem) => string>,
      default: () => ''
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
    provide('nodeList', props.nodeList)
    
    const scale = props.scale > 0 ? props.scale : 1
    const root = ref<Element | null>(null)
    const graphHandler = {}
    const {
      nodeMove,
      nodeOffset,
      nodeMousedown
    } = useDragNode(props.origin, scale, props.nodeList)
    
    const {
      menuShow,
      menuPosition,
      menuConfig,
      menuClose,
      menuOpen,
      menuSelected
    } = useMenu(scale, root, {
      source: null,
      list: props.graphMenuList,
      handler: graphHandler
    })
    
    const {
      isLineCreating,
      lineStart,
      lineEnd
    } = useTemLine()
    
    function renderNodeList() {
      return props.nodeList.map((node: NodeItem, idx) => {
        const nodeHandler: NodeHandler = {
          remove() {
            props.nodeList.splice(idx, 1)
          }
        }
        const onNodeMousedown = (evt: MouseEvent) => {
          nodeMousedown(evt, node, idx)
        }
        const onNodeContextMenu = (evt: MouseEvent) => {
          menuOpen(evt, {
            list: props.nodeMenuList,
            handler: {
              remove() {
                props.nodeList.splice(idx, 1)
              }
            },
            source: node
          })
        }
        const onNodeCreateLine = (startAt: Coordinate) => {
        
        }
        
        return (
          <FlowNode
            key={ node.id }
            node={ node }
            onNodeCreateLine={ onNodeCreateLine }
            onNodeMousedown={ onNodeMousedown }
            onNodeContextmenu={ onNodeContextMenu }
            v-slots={ {default: slots.default} }
          />
        )
      })
    }
    
    return () => (<>
      <div
        { ...attrs }
        ref={ root }
        class="super-flow__container"
        style={ {
          position: 'relative',
          transform: `scale(${ scale })`,
          transformOrigin: `${ props.origin[0] }px ${ props.origin[1] }px`
        } }
        onContextmenu={ withModifiers(menuOpen, ['stop', 'prevent']) }>
        { renderNodeList() }
      </div>
      <FlowMenu
        v-show={ unref(menuShow) }
        position={ unref(menuPosition) }
        source={ menuConfig.source }
        menuList={ menuConfig.list }
        onMenuSelected={ menuSelected }
        v-slots={ {default: slots.menuItem} }
      />
    </>)
  }
})
