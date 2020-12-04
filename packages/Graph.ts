/**
 * User: CHT
 * Date: 2020/12/4
 * Time: 11:23
 */
import { computed, ComputedRef, reactive, Ref, ref, unref, watch } from 'vue'
import { addVector } from './utils'

export class GraphNode {
  position: ComputedRef<Coordinate>
  setting: NodeItem
  graph?: Graph
  
  constructor(node: NodeItem, origin: Ref<Coordinate>, scale: ComputedRef<number>) {
    this.setting = node
    this.position = computed(() => {
      return addVector(unref(origin), this.setting.coordinate)
    })
  }
  
  
}

export class GraphLine {
  startNode: ComputedRef<GraphNode | undefined>
  endNode: ComputedRef<GraphNode | undefined>
  setting: LineItem
  graph?: Graph
  
  constructor(line: LineItem, origin: Ref<Coordinate>, scale: ComputedRef<number>) {
    this.setting = line
    
    this.startNode = computed(() => {
      return unref(this.graph?.nodeMap)?.get(this.setting.startId)
    })
    this.endNode = computed(() => {
      return unref(this.graph?.nodeMap)?.get(this.setting.endId)
    })
  }
  
  get isTem() {
    return this.setting.endId === ''
  }
  
  updateSetting<T extends keyof LineItem>(key: T, val: LineItem[T]) {
    this.setting[key] = val
  }
  
}


export interface GraphConstructor {
  nodeList: NodeItem[]
  lineList: LineItem[]
  scale: ComputedRef<number>
  origin: Ref<Coordinate>
}

export class Graph {
  nodeList: NodeItem[]
  lineList: LineItem[]
  scale: ComputedRef<number>
  origin: Ref<Coordinate>
  cacheNodeMap: Map<NodeId, GraphNode>
  cacheLineMap: Map<LineId, GraphLine>
  nodeMap: ComputedRef<Map<NodeId, GraphNode>>
  lineMap: ComputedRef<Map<LineId, GraphLine>>
  temLine!: GraphLine
  
  constructor(opt: GraphConstructor) {
    this.lineList = opt.lineList
    this.nodeList = opt.nodeList
    
    this.scale = opt.scale
    this.origin = opt.origin
    
    this.cacheNodeMap = new Map()
    this.cacheLineMap = new Map()
    
    this.nodeMap = computed(this._computedNodeMap)
    this.lineMap = computed(this._computedLineMap)
    
    this.initTem()
  }
  
  getNode(nodeId: NodeId) {
    return unref(this.nodeMap).get(nodeId)
  }
  
  initTem() {
    this.temLine = new GraphLine(reactive({
      id: '',
      startId: '',
      endId: '',
      startAt: [0, 0],
      endAt: [0, 0],
      path: []
    }), this.origin, this.scale)
  }
  
  removeNode(idx: number) {
    const node = this.nodeList[idx]
    this.lineList.forEach((line: LineItem, idx: number) => {
      if (line.startId === node.id || line.endId === node.id) {
        this.lineList.splice(idx, 1)
      }
    })
    this.nodeList.splice(idx, 1)
    return node
  }
  
  removeLine(idx: number) {
    const line = this.lineList[idx]
    this.lineList.splice(idx, 1)
    return line
  }
  
  protected _computedNodeMap = () => {
    const map = new Map()
    this.nodeList.forEach(node => {
      if (!this.cacheNodeMap.has(node.id)) {
        const graphNode = new GraphNode(node, this.origin, this.scale)
        graphNode.graph = this
        this.cacheNodeMap.set(node.id, graphNode)
      }
      map.set(node.id, this.cacheNodeMap.get(node.id))
    })
    this.cacheNodeMap = map
    return map
  }
  
  protected _computedLineMap = () => {
    const map = new Map()
    this.lineList.forEach(line => {
      if (!this.cacheLineMap.has(line.id)) {
        const graphLine = new GraphLine(line, this.origin, this.scale)
        graphLine.graph = this
        this.cacheLineMap.set(line.id, graphLine)
      }
      map.set(line.id, this.cacheLineMap.get(line.id))
    })
    this.cacheLineMap = map
    return map
  }
}
