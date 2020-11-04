/**
 * User: CHT
 * Date: 2020/11/4
 * Time: 15:15
 */
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'FlowMenu',
  props: {
    source: {
    
    },
    menuList: {
      type: Array as PropType<MenuItem<any>[]>,
      default: () => []
    }
  },
  setup(props, {emit}) {
  
  }
})
