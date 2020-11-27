/**
 * User: CHT
 * Date: 2020/11/3
 * Time: 17:36
 */

/// <reference path="../packages/types.d.ts" />
/// <reference path="../packages/shim-tsx.d.ts" />

import { defineComponent, ref, reactive, computed, Ref, onMounted, unref, withModifiers } from 'vue'
import SuperFlow from '../packages'
import { useDrag } from '../packages/hooks'
import { addVector, uuid } from '../packages/utils'
import './App.less'
import node from '../packages/node'

interface TemNodeItem {
  width: number
  height: number
  meta?: {[key: string]: any}
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
    const [isMove, offset, mousedown] = useDrag()
    const scale = ref<number>(1)
    const origin = ref<Coordinate>([0, 0])
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
          selected(graph, coordinate) { }
        }
      ],
      [
        {
          label: '开始节点',
          disable(graph) {
            return Boolean(nodeList.find(node => node.meta!.type === 'start'))
          },
          selected(coordinate) {
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
          selected(coordinate) {
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
          selected(coordinate) {
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
          selected(coordinate) {
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
          hidden(selected) {
            return (selected as NodeItem).meta!.type === 'start'
          },
          selected(coordinate, handler, selected) {
            (handler as NodeHandler).remove()
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
    
    function nodeItemMouseDown(evt: MouseEvent, item: TemItem) {
      const {left, top} = (evt.currentTarget as HTMLElement).getBoundingClientRect()
      mousedownInfo.position = [left, top]
      mousedownInfo.current = item
      mousedown(evt)
    }
    
    function renderTemItemList() {
      return temNodeItemList.map(item => (
          <li
            class="node-item"
            onMousedown={ evt => nodeItemMouseDown(evt, item) }>
            { item.label }
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
          v-show={ isMove.value }
          style={ style }>
          { mousedownInfo.current?.label }
        </li>
      )
    }
    
    function renderFlowNode(node: NodeItem) {
      return (
        <>
          <header
            class="ellipsis"
            flow-node-drag>
            { node.meta!.label }
          </header>
          <section>
          
          </section>
          <span
            class="side side-top"
            flow-node-initiate={ `${ node.width / 2 },0` }
          />
          <span
            class="side side-right"
            flow-node-initiate={ `${ node.width },${ node.height / 2 }` }
          />
          <span
            class="side side-bottom"
            flow-node-initiate={ `${ node.width / 2 },${ node.height }` }
          />
          <span
            class="side side-left"
            flow-node-initiate={ `${ node.width / 2 },${ node.height }` }
          />
        </>
      )
    }
    
    function renderMenuItem(item: MenuItem) {
      return (<span>{ item.label }</span>)
    }
    
    function printData() {
      console.log(scale)
      console.log(origin)
      console.log(nodeList)
      console.log(lineList)
    }
    
    return () => (<>
      <ul class="node-item__container clearfix">
        { renderTemItemList() }
        { renderMoveTemItem() }
      </ul>
      <div style={ {padding: '15px'} }>
        <button onClick={printData}>打印数据</button>
        &nbsp;&nbsp;
        <select v-model={ scale.value }>
          {
            [0.5, 0.8, 1, 1.5, 1.8, 2].map(n => (<option value={ n }>{ n }</option>))
          }
        </select>
        <input
          type="number"
          v-model_number={unref(origin)[0]}
        />
        <input
          type="number"
          v-model_number={unref(origin)[1]}
        />
      </div>
     
      <SuperFlow
        graphMenuList={ graphMenu }
        nodeMenuList={ nodeMenu }
        nodeList={ nodeList }
        lineList={ lineList }
        scale={ unref(scale) }
        origin={ unref(origin) }
        v-slots={ {
          default: renderFlowNode,
          menuItem: renderMenuItem
        } }
      />
    </>)
  }
})
