import * as RuntimeCore from '@vue/runtime-core'

type ReservedProps = {
  key?: string | number
  ref?:
    | string
    | RuntimeCore.Ref
    | ((ref: Element | RuntimeCore.ComponentInternalInstance | null) => void)
}

type ElementAttrs<T> = T & ReservedProps

type NativeElements = {
  [K in StringKeyOf<IntrinsicElementAttributes>]: ElementAttrs<IntrinsicElementAttributes[K]>
}

declare global {
  namespace JSX {
    interface Element {
    }
    
    interface ElementClass {
      $props: {}
    }
    
    interface ElementAttributesProperty {
      $props: {}
    }
    
    interface IntrinsicElements extends NativeElements {
      // allow arbitrary elements
      // @ts-ignore suppress ts:2374 = Duplicate string index signature.
      [name: string]: any
    }
    
    interface IntrinsicAttributes extends ReservedProps {
      [emit: string]: any
    }
  }
}
