// ! JSX语法
// https://github.com/vuejs/jsx#installation

<script>
// ! Slots 普通插槽
const MySlot = {
  // ! <slot name='x'></slot>
  template: `
    <div>
      <header><slot name="header"></slot></header>
      <main><slot></slot></main>
      <footer><slot name="footer"></slot></footer>
    </div>
  `,
  render (h) {
    // ! jsx this.$slots
    return (
      <div>
        <header>{this.$slots.header}</header>
        <main>{this.$slots.default}</main>
        <footer>{this.$slots.footer}</footer>
      </div>
    )
  }
}

export default {
  // ! v-slot:x 或 #x 或 slot='x' (三种写法)
  template: `
    <MySlot>
      <template v-slot:header>hello world</template>
      children node
      <div v-slot:footer>this is footer</div>
    </MySlot>
  `,
  render (h) {
    return (
      <MySlot>
        <template slot='header'>hello world</template>
        children node
        <div slot='footer'>this is footer</div>
      </MySlot>
    )
  }
}


// ! scopedSlots 作用域插槽
const MySlot = {
  // ! <slot name='xxx' :xxx='xxx'></slot>
  template: `
    <div>
      <header><slot name="header" v-bind:user="user"></slot></header>
      <main><slot name="default" :content="content"></slot></main>
      <footer><slot name="footer" v-bind:copytight="copytight"></slot></footer>
    </div>
  `,
  data () {
    return { user: 'John', content: 'vue', copytight: 'CopyRight' }
  },
  render (h) {
    // ! jsx this.$scopedSlots
    return (
      <div>
        <header>{this.$scopedSlots.header({ user: this.user })}</header>
        <main>{this.$scopedSlots.default({ content: this.content })}</main>
        <footer>{this.$scopedSlots.footer({ copytight: this.copytight })}</footer>
      </div>
    )
  }
}

export default {
  // ! v-slot:x='y' 或 #x='y' 或 slot='x'/slot-scope='y' (三种写法)
  template: `
    <MySlot>
      <template v-slot:header="slotProps">hello, {{slotProps.user}}</template>
      children node
      <template v-slot:footer><div>this is footer</div></template>
    </MySlot>
  `,
  render (h) {
    // ! jsx
    const scopedSlots = {
      header: props => `hello, ${props.user}`
    }
    return (
      <MySlot scopedSlots={scopedSlots}>
        children node
        <template slot='footer'><div>this is footer</div></template>
      </MySlot>
    )
  }
}
</script>
