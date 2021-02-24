<script>
export default {
  data() {
    return {
      title: ''
    }
  },
  props: [msg],
  /**
   * !!! <slot></slot>插槽
   */
  // this.$slots 访问静态插槽的内容，每个插槽都是一个 VNode 数组
  // ! createElement函数写法
  render(createElement) {
    // `<div><slot></slot></div>`
    return createElement('div', this.$slots.default)
  },
  // ! jsx写法
  render(h) {
    return <div>{ this.$slots.default }</div>
  },

  // this.$scopedSlots 访问作用域插槽，每个作用域插槽都是一个返回若干 VNode 的函数
  // ! createElement函数写法
  render(createElement) {
    // `<div><slot :text="msg"></slot name="other" :title="title"><slot></slot></div>`
    return createElement('div', [
      this.$scopedSlots.default({
        text: this.msg
      }),
      this.$scopedSlots.other({
        title: this.title
      })
    ])
  },
  // ! jsx写法
  render(h) {
    return <div>
      { this.$scopedSlots.default({
        text: this.msg
      }) }
      { this.$scopedSlots.other({
        title: this.title
      }) }
      </div>
  },


  /**
   * !!! v-slot指令
   */
  // ! <template></template>写法
  // <current-user>
  //   <template v-slot:default="slotProps">
  //     <div>{{ slotProps.text }}</div>
  //   </template>
  //   <template v-slot:other="otherSlotProps">
  //     <div>{{ otherSlotProps.title }}</div>
  //   </template>
  // </current-user>
  // ! createElement函数写法
  render(createElement) {
    return createElement('current-user', {
      // 作用域插槽的格式为
      // { name: props => VNode | Array<VNode> }
      scopedSlots: {
        default: props => createElement('div', props.text),
        other: props => createElement('div', props.title)
      },
      // 如果组件是其它组件的子组件，需为插槽指定名称
      slot: 'name-of-slot',
    })
  },
  // ! jsx写法
  render(h) {
    const scopedSlots = {
        default: props => <div>{ props.text }</div>,
        other: props => <div>{ props.title }</div>
    }
    return <current-user scopedSlots={scopedSlots}></current-user>
  }

}
</script>
