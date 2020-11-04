/// <reference path="../packages/types.d.ts" />

/**
 * User: CHT
 * Date: 2020/11/3
 * Time: 17:36
 */


import { defineComponent, ref, reactive, computed, Ref } from 'vue'
import SuperFlow from '../packages'
import { useMousemove } from '../packages/hooks'
import { addVector } from '../packages/utils'
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
    
    const {offset, isMove, mousedown} = useMousemove()
    const mousedownInfo = reactive<MousedownInfo>({
      position: [0, 0],
      current: null
    })
    
    function nodeitemMouseDown(evt: MouseEvent, item: TemItem) {
      const {left, top} = (evt.currentTarget as HTMLElement).getBoundingClientRect()
      mousedownInfo.position = [left, top]
      mousedownInfo.current = item
      mousedown(evt)
    }
    
    return () => {
      const nodeItemList = temNodeItemList.map(item =>
        <li
          class="node-item"
          onMousedown={evt => nodeitemMouseDown(evt, item)}>
          {item.label}
        </li>
      )
      
      const moveItemStyle = {
        left: offset.value[0] + mousedownInfo.position[0] + 'px',
        top: offset.value[1] + mousedownInfo.position[1] + 'px'
      }
      
      return <>
        <ul class="node-item__container">
          {nodeItemList}
          <li
            class="node-item move-item"
            v-show={isMove.value}
            style={moveItemStyle}>
            {mousedownInfo.current?.label}
          </li>
        </ul>
        <SuperFlow />
      </>
    }
  }
})
