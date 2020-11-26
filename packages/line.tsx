/**
 * User: CHT
 * Date: 2020/11/4
 * Time: 15:32
 */
import { defineComponent, onMounted, PropType, ref, unref, watchEffect } from 'vue'
import { Direction } from './direction'

function drawLine(
  ctx: CanvasRenderingContext2D,
  pathList: Coordinate[],
  lineStyle: Required<LineStyle>
) {
  ctx.lineJoin = 'round'
  ctx.beginPath()
  if (lineStyle.type === 'dotted') {
    ctx.setLineDash(lineStyle.lineDash)
  }
  ctx.strokeStyle = lineStyle.lineColor
  ctx.lineWidth = 2
  pathList.forEach((coordinate, idx) => {
    if (idx === 0) {
      ctx.moveTo(...coordinate)
    } else {
      ctx.lineTo(...coordinate)
      ctx.stroke()
    }
  })
  ctx.save()
}

function drawDesc() {

}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  pathList: Coordinate[],
  fillColor: Color
) {
  const arrowSize: number = 4
  const len = pathList.length
  
  if (len < 2) return
  const start = pathList[len - 2]
  const end = pathList[len - 1]
  ctx.translate(...end)
  let ang = Math.atan((end[0] - start[0]) / (end[1] - start[1]))
  ctx.beginPath()
  if (end[1] - start[1] >= 0) {
    ctx.rotate(-ang)
  } else {
    ctx.rotate(Math.PI - ang) // 加个180度，反过来
  }
  ctx.fillStyle = fillColor
  ctx.lineTo(-arrowSize, -arrowSize * 2)
  ctx.lineTo(0, -arrowSize)
  ctx.lineTo(arrowSize, -arrowSize * 2)
  ctx.lineTo(0, 0)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

export default defineComponent({
  name: 'FlowLine',
  props: {
    line: {
      type: Object as PropType<LineItem>,
      default: () => ({})
    }
  },
  setup(props, {emit}) {
    const root = ref<HTMLCanvasElement | null>(null)
    let ctx: CanvasRenderingContext2D | null = null
    
    onMounted(() => {
      const canvas = unref(root)!
      ctx = canvas.getContext('2d')
    })
  
    watchEffect(() => {
      console.log('watchEffect')
    })
    
    return () => (
      <canvas
        ref={ root }
      />
    )
  }
})
