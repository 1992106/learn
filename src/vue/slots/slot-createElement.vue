// ! 渲染函数createElement

// ! this.$slots 访问静态插槽的内容，每个插槽都是一个 VNode 数组
// ! this.$scopedSlots 访问作用域插槽，每个作用域插槽都是一个返回若干 VNode 的函数
// ! this.$slots 返回的是数组，this.$scopedSlots 返回的是函数

<script>
// ! Slots 普通插槽
// 定义带插槽的组件，`$slots.default`为匿名插槽，其余的则是具名插槽，匿名插槽的插槽名可以省略
const MySlot = {
  template: `
    <div>
      <header><slot name="header"></slot></header>
      <main><slot></slot></main>
      <footer><slot name="footer"></slot></footer>
    </div>
  `,
  render (h) {
    return h('div', [
      h('header', this.$slots.header),
      h('main', this.$slots.default),
      h('footer', this.$slots.footer)
    ])
  }
}

// 在`children子节点`中指定插槽名以使用具名插槽，未指定插槽名的则放入匿名插槽中
export default {
  // ! v-slot:x 或 #x 或 slot='x' (三种写法)
  template: `
    <MySlot>
      <template v-slot:header>hello world</template>
      'children node'
      <div v-slot:footer>this is footer</div>
    </MySlot>
  `,
  components: { MySlot },
  render (h) {
    return h('MySlot', [
      h('template', { slot: 'header' }, 'hello world'),
      'children node',
      h('div', { slot: 'footer' }, 'this is footer')
    ])
  }
}


// ! scopedSlots 作用域插槽
// 定义作用域插槽
const MySlot = {
  // ! <slot name='xxx' v-bind:xxx='xxx'></slot>
  template: `
    <div>
      <header><slot name="header" v-bind:user="user"></slot></header>
      <main><slot :content="content"></slot></main>
      <footer><slot name="footer" v-bind:copytight="copytight"></slot></footer>
    </div>
  `,
  data () {
    return { user: 'John', content: 'vue', copytight: 'CopyRight' }
  },
  render (h) {
    return h('div', [
      h('header', [this.$scopedSlots.header({ user: this.user })]),
      h('main', [this.$scopedSlots.default({ content: this.content })]),
      h('footer', [this.$scopedSlots.footer({ copytight: this.copytight })])
    ])
  }
}

// 要使用作用域插槽的数据内容，则插槽必须在组件的数据对象`scopedSlots`中使用，如`header`所示
// 作用域插槽也可以当作普通插槽使用，如`default`和`header`
export default {
  // ! v-slot:x='' 或 #x='' 或 slot='x'/slot-scope=''
  template: `
    <MySlot>
      <template v-slot:header="slotProps">hello,{{slotProps.user}}</template>
      children node
      <div v-slot:footer>this is footer</div>
    </MySlot>
  `,
  components: { MySlot },
  render (h) {
    return h('MySlot', {
      scopedSlots: {
        header: props => `hello, ${props.user}`
      }
    }, [
      'children node',
      h('div', { slot: 'footer' }, 'this is footer')
    ])
  }
}
</script>
