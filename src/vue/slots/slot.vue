<script>
  // 子组件
  const MySlot = {
    // ! <slot name=''></slot>
    template: `
      <div>
        <header>
          <slot name="header"></slot>
        </header>
        <main>
          <slot></slot>
        </main>
        <footer>
          <slot name="footer"></slot>
        </footer>
      </div>
    `,
    // ! createElement this.$slots
    render(h) {
      return h('div', [
        h('header', this.$slots.header),
        h('main', this.$slots.default),
        h('footer', this.$slots.footer)
      ])
    },
    // ! jsx this.$slots
    render(h) {
      return (
        <div>
          <header>{this.$slots.header}</header>
          <main>{this.$slots.default}</main>
          <footer>{this.$slots.footer}</footer>
        </div>
      )
    }
  }

  // 父组件
  `
  <div>
    <header>
      <h1>Here might be a page title</h1>
    </header>
    <main>
      <p>A paragraph for the main content.</p>
      <p>And another one.</p>
    </main>
    <footer>
      Here's some contact info
    </footer>
  </div>
`
  export default {
     // ! v-slot:x 或 #x 或 slot='x' (三种写法)
    template: `
      <MySlot>
        <h1 v-slot:header>Here might be a page title</h1>
        <p>A paragraph for the main content.</p>
        <p>And another one.</p>
        <template v-slot:footer>Here's some contact info</template>
      </MySlot>
    `,
    components: {
      MySlot
    },
    // ! createElement h函数第2个参数{ slot: '' }
    render(h) {
      return h('MySlot', [
        h('h1', { slot: 'header' }, 'Here might be a page title'),
        h('p', 'A paragraph for the main content.'),
        h('p', 'And another one.'),
        h('template', { slot: 'footer' }, `Here's some contact info`)
      ])
    },
    // ! jsx slot=''
    render(h) {
      return (
        <MySlot>
          <h1 slot='header'>Here might be a page title</h1>
          <p>A paragraph for the main content.</p>
          <p>And another one.</p>
          <template slot="footer">Here's some contact info</template>
        </MySlot>
      )
    }
  }
</script>
