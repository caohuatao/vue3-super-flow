/**
 * User: CHT
 * Date: 2020/11/3
 * Time: 17:46
 */
import {
  ref,
  unref,
  defineComponent,
  computed,
  provide,
  withModifiers,
  Ref,
  PropType,
  ComputedRef,
  onMounted,
  onUnmounted
} from 'vue'
import { useDrag } from './hooks'
import { addVector, arrayExchange, differ, minus, multiply } from './utils'
import { Graph, GraphLine, GraphNode } from './Graph'

import FlowMenu from './menu'
import FlowNode from './node'
import FlowLine from './line'

import './index.less'


interface MenuConfig {
  list: MenuItem[][]
  handler: MenuSelectedHandler
  source: MenuSelectedItem
}

function useMenu(
  scale: ComputedRef<number>,
  root: Ref<Element | null>,
  baseConfig: MenuConfig
) {
  const menuShow = ref<boolean>(false)
  const menuPosition = ref<Coordinate>([0, 0])
  const menuConfig: MenuConfig = {...baseConfig}
  let offset: Coordinate = [0, 0]
  
  function menuOpen(evt: MouseEvent, config: MenuConfig = baseConfig) {
    Object.assign(menuConfig, config)
    
    const {top, left} = unref(root)!.getBoundingClientRect()
    menuPosition.value = [evt.clientX, evt.clientY]
    menuShow.value = true
    offset = [left, top]
  }
  
  function menuClose() {
    menuShow.value = false
  }
  
  function menuSelected(item: MenuItem) {
    item.selected(
      multiply(minus(menuPosition.value, offset), 1 / unref(scale)),
      menuConfig.handler,
      menuConfig.source
    )
    menuShow.value = false
  }
  
  onMounted(() => {
    document.addEventListener('mousedown', menuClose)
    window.addEventListener('scroll', menuClose, true)
  })
  
  onUnmounted(() => {
    document.removeEventListener('mousedown', menuClose)
    window.removeEventListener('scroll', menuClose, true)
  })
  
  return {
    menuShow,
    menuPosition,
    menuOpen,
    menuClose,
    menuSelected,
    menuConfig
  }
}


function useTemLine(scale: ComputedRef<number>, temLine: GraphLine) {
  let startPosition
  const isLineCreating = ref<boolean>(false)
  
  onMounted(() => {
    document.addEventListener('mousemove', docMousemove)
    document.addEventListener('mouseup', docMouseup)
  })
  
  onUnmounted(() => {
    document.addEventListener('mousemove', docMousemove)
    document.addEventListener('mouseup', docMouseup)
  })
  
  function docMousemove(evt: MouseEvent) {
    if (!isLineCreating.value) return
    
  }
  
  function docMouseup() {
    isLineCreating.value = false
  }
  
  function lineStart(start: NodeItem, startAt: Coordinate, startCoordinate: Coordinate) {
    isLineCreating.value = true
    temLine.updateSetting('startId', start.id)
    temLine.updateSetting('startAt', startAt)
    startPosition = startCoordinate
  }
  
  function lineEnd(endId: NodeId, endAt: Coordinate) {
    isLineCreating.value = false
    temLine.updateSetting('endId', endId)
    temLine.updateSetting('endAt', endAt)
    
  }
  
  return {
    isLineCreating,
    lineStart,
    lineEnd
  }
}


function useDragNode(
  origin: Coordinate,
  scale: ComputedRef<number>,
  nodeList: NodeItem[]
) {
  const [nodeMove, nodeOffset, mousedown] = useDrag(nodeMoveCallback)
  let start: Coordinate = [0, 0]
  let current: NodeItem
  
  function nodeMoveCallback(offset: Ref<Coordinate>) {
    current!.coordinate = addVector(
      start,
      multiply(unref(offset), 1 / unref(scale))
    )
  }
  
  function nodeMousedown(evt: MouseEvent, node: NodeItem, idx: number) {
    current = node
    start = differ(origin, node.coordinate)
    mousedown(evt)
    arrayExchange(nodeList, idx)
  }
  
  return {
    nodeMove,
    nodeOffset,
    nodeMousedown
  }
}


const lineBaseStyle: Required<LineStyle> = {
  type: 'solid',
  lineColor: '#333333',
  lineHover: '#FF0000',
  descColor: '#333333',
  descHover: '#FF0000',
  font: '14px Arial',
  lineDash: [4, 4],
  background: 'rgba(255,255,255, .6)'
}


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
    lineBaseStyle: {
      type: Object as PropType<LineStyle>,
      default: () => ({})
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
    
    const scale = computed<number>(() => props.scale > 0 ? props.scale : 1)
    const graph = new Graph({
      nodeList: props.nodeList,
      lineList: props.lineList,
      origin: ref(props.origin),
      scale
    })
    
    provide('nodeList', props.nodeList)
    provide('origin', props.origin)
    provide('scale', scale)
    provide('lineBaseStyle', computed<Required<LineStyle>>(() => {
      return Object.assign({}, lineBaseStyle, props.lineBaseStyle)
    }))
    
    
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
    } = useTemLine(scale, graph.temLine)
    
    
    function renderNodeList() {
      return Array.from(unref(graph.nodeMap)).map((mapItem, idx) => {
        const [nodeId, flowNode] = mapItem
        const nodeHandler: NodeHandler = {
          remove() {
            props.nodeList.splice(idx, 1)
          }
        }
        const onNodeMousedown = (evt: MouseEvent) => {
          nodeMousedown(evt, flowNode.setting, idx)
        }
        
        const onNodeContextMenu = (evt: MouseEvent) => {
          menuOpen(evt, {
            list: props.nodeMenuList,
            handler: {
              remove() {
                props.nodeList.splice(idx, 1)
              }
            },
            source: flowNode.setting
          })
        }
        
        const onNodeCreateLine = (evt: MouseEvent, startAt: Coordinate) => {
          lineStart(flowNode.setting, startAt, unref(flowNode.position))
        }
        
        return (
          <FlowNode
            key={ nodeId }
            node={ flowNode }
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
          transform: `scale(${ scale.value })`,
          transformOrigin: `${ props.origin[0] }px ${ props.origin[1] }px`
        } }
        onContextmenu={ withModifiers(menuOpen, ['stop', 'prevent']) }>
        {
          unref(isLineCreating) ?
            <FlowLine
              graphLine={ graph.temLine }
              lineStyle={ props.lineStyle }
            /> : []
        }
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
