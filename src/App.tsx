/**
 * User: CHT
 * Date: 2020/11/3
 * Time: 17:36
 */
/// <reference path="../packages/types.d.ts" />

import { defineComponent, ref, reactive, computed, Ref } from 'vue'
import SuperFlow from '../packages'
import { useMousemove } from '../packages/hooks'
import { addVector, uuid } from '../packages/utils'
import './App.less'

interface TemNodeItem {
  width: number
  height: number
  meta?: { [key: string]: any }
}

interface TemItem {
  label: string
  value: TemNodeItem
}

interface MousedownInfo {
  position: Coordinate
  current: TemItem | null
}

export default defineComponent({
  name: 'App',
  setup() {
    const [isMove, offset, mousedown] = useMousemove()
    const nodeList = reactive<NodeItem[]>([])
    const lineList = reactive<LineItem[]>([])
    const mousedownInfo = reactive<MousedownInfo>({
      position: [0, 0],
      current: null
    })
    const graphMenu: MenuItem[][] = [
      [
        {
          label: '全选',
          selected(graph, coordinate) {}
        }
      ],
      [
        {
          label: '开始节点',
          disable(graph) {
            return Boolean(nodeList.find(node => node.meta!.type === 'start'))
          },
          selected(graph, coordinate) {
            nodeList.push({
              id: uuid(),
              width: 120,
              height: 80,
              coordinate,
              meta: {
                type: 'start',
                label: '开始节点'
              }
            })
          }
        },
        {
          label: '审批节点',
          selected(graph, coordinate) {
            nodeList.push({
              id: uuid(),
              width: 120,
              height: 80,
              coordinate,
              meta: {
                type: 'approve',
                label: '审批节点'
              }
            })
          }
        },
        {
          label: '抄送节点',
          selected(graph, coordinate) {
            nodeList.push({
              id: uuid(),
              width: 120,
              height: 80,
              coordinate,
              meta: {
                type: 'cc',
                label: '抄送节点'
              }
            })
          }
        },
        {
          label: '结束节点',
          disable(graph) {
            return Boolean(nodeList.find(node => node.meta?.type === 'end'))
          },
          selected(graph, coordinate) {
            nodeList.push({
              id: uuid(),
              width: 120,
              height: 80,
              coordinate,
              meta: {
                type: 'end',
                label: '结束节点'
              }
            })
          }
        }
      ]
    ]
    const nodeMenu: MenuItem[][] = [
      [
        {
          label: '删除',
          selected(node, coordinate) {
            console.log(arguments)
          }
        }
      ]
    ]
    const temNodeItemList: TemItem[] = [
      {
        label: '节点1',
        value: {
          width: 120,
          height: 40,
          meta: {
            label: '1',
            name: '1'
          }
        }
      },
      {
        label: '节点2',
        value: {
          width: 120,
          height: 40,
          meta: {
            label: '2',
            name: '2'
          }
        }
      },
      {
        label: '节点3',
        value: {
          width: 120,
          height: 40,
          meta: {
            label: '3',
            name: '3'
          }
        }
      },
      {
        label: '节点4',
        value: {
          width: 120,
          height: 40,
          meta: {
            label: '4',
            name: '4'
          }
        }
      }
    ]
    
    function nodeitemMouseDown(evt: MouseEvent, item: TemItem) {
      const {left, top} = (evt.currentTarget as HTMLElement).getBoundingClientRect()
      mousedownInfo.position = [left, top]
      mousedownInfo.current = item
      mousedown(evt)
    }
    
    function renderTemItemList() {
      return temNodeItemList.map(item => (
          <li
            class="node-item"
            onMousedown={evt => nodeitemMouseDown(evt, item)}>
            {item.label}
          </li>
        )
      )
    }
    
    function renderMoveTemItem() {
      const style = {
        left: offset.value[0] + mousedownInfo.position[0] + 'px',
        top: offset.value[1] + mousedownInfo.position[1] + 'px'
      }
      return (
        <li
          class="node-item move-item"
          v-show={isMove.value}
          style={style}>
          {mousedownInfo.current?.label}
        </li>
      )
    }
    
    const superFlowSlots = {
      default({node, drag}: { node: NodeItem, drag: (evt: MouseEvent) => void }) {
        return (
          <>
            <header
              class="ellipsis"
              onMousedown={drag}>
              {node.meta!.label}
            </header>
            <section>
            
            </section>
          </>
        )
      },
      menuItem(item: MenuItem) {
        return (<span>{item.label}</span>)
      }
    }
    
    return () => (
      <>
        <ul class="node-item__container clearfix">
          {renderTemItemList()}
          {renderMoveTemItem()}
        </ul>
        <SuperFlow
          graphMenuList={graphMenu}
          nodeMenuList={nodeMenu}
          v-slots={superFlowSlots}
          nodeList={nodeList}
          lineList={lineList}
          scale={1}
        />
      </>
    )
  }
})
