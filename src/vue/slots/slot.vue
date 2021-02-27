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
    // this.$slots 访问静态插槽的内容，每个插槽都是一个 VNode 数组
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
        <template v-slot:header>
          <h1 >Here might be a page title</h1>
        </template>
        <p>A paragraph for the main content.</p>
        <p>And another one.</p>
        <template v-slot:footer>Here's some contact info</template>
      </MySlot>
    `,
    components: {
      MySlot
    },
    // ! createElement
    // ??? scopedSlots或者slot
    render(h) {
      return h('MySlot', {
        scopedSlots: {
          header: () => h('h1', 'Here might be a page title'),
          footer: () => `Here's some contact info`
        }
      }, [
        h('p', 'A paragraph for the main content.'),
        h('p', 'And another one.')
      ])
      // 错误写法？？？
      // return h('MySlot', [
      //   h('template', { slot: 'header' } [ h('h1', 'Here might be a page title') ]),
      //   h('p', 'A paragraph for the main content.'),
      //   h('p', 'And another one.'),
      //   h('template', { slot: 'footer' }, `Here's some contact info`)
      // ])
    },
    // ! jsx slot=''
    render(h) {
      return (
        <MySlot>
          <template slot="header"><h1>Here might be a page title</h1></template>
          <p>A paragraph for the main content.</p>
          <p>And another one.</p>
          <template slot="footer">Here's some contact info</template>
        </MySlot>
      )
    }
  }
</script>
