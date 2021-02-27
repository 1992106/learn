<script>
// 子组件
const MyScopedSlot = {
  // ! <slot name='' :x=''></slot>
  template: `
    <div>
        <header>
          <slot name="header" :xxx="aaa"></slot>
        </header>
        <main>
          <slot></slot>
        </main>
        <footer>
          <slot name="footer" :yyy="bbb"></slot>
        </footer>
      </div>
  `,
  data() {
    return {
      aaa: 'My Scoped Slot header',
      bbb: 'My Scoped Slot footer'
    };
  },
  // this.$scopedSlots 访问作用域插槽，每个作用域插槽都是一个返回若干 VNode 的函数
  // ! createElement this.$scopedSlots
  render(h) {
    return h('div', [
      h('header', this.$scopedSlots.header({ xxx: this.aaa })),
      h('main', this.$scopedSlots.default),
      h('footer', this.$scopedSlots.footer({ yyy: this.bbb }))
    ]);
  },
  // ! jsx this.$scopedSlots
  render(h) {
    return (
      <div>
        <header>{this.$scopedSlots.header({ xxx: this.aaa })}</header>
        <main>{this.$scopedSlots.default}</main>
        <footer>{this.$scopedSlots.footer({ yyy: this.bbb })}</footer>
      </div>
    );
  }
};

// 父组件
`
  <div>
    <header>
      <h1>Here might be a page title</h1>
      My Scoped Slot header
    </header>
    <main>
      <p>A paragraph for the main content.</p>
      <p>And another one.</p>
    </main>
    <footer>
      Here's some contact info
      My Scoped Slot footer
    </footer>
  </div>
`;
export default {
  // ! v-slot:x='y' 或 #x='y' 或 slot='x'/slot-scope='y' (三种写法)
  template: `
    <MyScopedSlot>
      <template v-slot:header="slotProps">
        <h1>Here might be a page title</h1>
        {{slotProps.xxx}}
      </template>
      <template v-slot:default>
        <p>A paragraph for the main content.</p>
        <p>And another one.</p>
      </template>
      <template v-slot:footer="slotProps">
        Here's some contact info
        {{slotProps.yyy}}
      </template>
    </MyScopedSlot>
  `,
  components: {
    MyScopedSlot
  },
  // ! createElement h函数第2个参数{ scopedSlots: '' }
  render(h) {
    return h('MyScopedSlot', {
      scopedSlots: {
        header: (slotProps) => [h('h1', 'Here might be a page title'),`${slotProps.xxx}`],
        default: () => [h('p', 'A paragraph for the main content.'),h('p', 'And another one.')],
        footer: (slotProps) => `Here's some contact info${slotProps.yyy}`
      }
    });
  },
  // ! jsx
  render(h) {
    const scopedSlots = {
      header: (slotProps) => (<h1>Here might be a page title</h1> + `${slotProps.xxx}`),
      footer: (slotProps) => `Here's some contact info${slotProps.yyy}`
    }
    return (
      <MyScopedSlot scopedSlots={scopedSlots}>
        <template slot='default'>
          <p>A paragraph for the main content.</p>
          <p>And another one.</p>
        </template>
      </MyScopedSlot>
    )
  },
};
</script>
