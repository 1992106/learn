/* eslint-disable no-invalid-this */
import React, { createRef, useRef } from 'react';

/**
 * !!! 创建ref的三种方法（createRef，useRef，回调函数ref）
 */
// 1.当ref属性用于HTML元素时，创建的 ref 接收底层 DOM 元素作为其 current 属性
// 2.当 ref 属性用于自定义的 class 组件时， ref 对象接收组件的挂载实例作为其 current 属性
// 3.不能在函数组件上使用 ref 属性，因为函数组件没有实例。父组件获取子组件的ref，其实是在获取子组件的实例

// 仅支持class组件内部使用createRef方法创建ref
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = createRef();
  }

  handleSubmit = e => {
    e.preventDefault();
    console.log(this.textInput.current.value);
  };

  render() {
    return (
      <div>
        <form onSubmit={e => this.handleSubmit(e)}>
          <input type="text" ref={this.textInput} />
          <button>Submit</button>
        </form>
      </div>
    );
  }
}

// 仅限于在函数组件内部使用useRef创建ref
// （你不能在函数组件上使用 ref 属性，因为函数组件没有实例；但是在函数组件内部使用 ref 属性，只要它指向一个 DOM 元素或 class 组件）
const CustomTextInput = () => {
  const textInput = useRef();

  const handleSubmit = e => {
    e.preventDefault();
    console.log(textInput.current.value);
  };

  return (
    <div>
      <form onSubmit={e => handleSubmit(e)}>
        <input type="text" ref={textInput} />
        <button>Submit</button>
      </form>
    </div>
  );
};

// 使用回调函数创建ref（class组件和函数组件都支持）
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = null;
  }

  setTextInputRef = element => {
    this.textInput = element;
  };

  handleSubmit = e => {
    e.preventDefault();
    console.log(this.textInput.value);
  };

  render() {
    return (
      <div>
        <form onSubmit={e => this.handleSubmit(e)}>
          <input type="text" ref={this.setTextInputRef} />
          <button>Submit</button>
        </form>
      </div>
    );
  }
}
const CustomTextInput = () => {
  let textInput = null;

  const setTextInputRef = element => {
    textInput = element;
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log(textInput.value);
  };

  return (
    <div>
      <form onSubmit={e => handleSubmit(e)}>
        <input type="text" ref={setTextInputRef} />
        <button>Submit</button>
      </form>
    </div>
  );
};

/**
 * !!! 父组件获取子组件本身
 * class组件和函数组件
 */
// class组件直接使用ref即可绑定子组件实例
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    };
    this.textInput = createRef();
  }

  handleText = () => {
    this.setState({ text: 'text' });
  };

  render() {
    return (
      <div>
        <input ref={textInput} />
      </div>
    );
  }
}
class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.childInstance = createRef();
    // childInstance可以访问子组件的text，handleText，textInput
  }

  render() {
    return (
      // 直接使用ref即可绑定子组件实例
      <CustomTextInput ref={childInstance} />
    );
  }
}

// 函数组件（forwardRef和useImperativeHandle）
const CustomTextInput = forwardRef((props, ref) => {
  const [text, setText] = useState('');
  const textInput = useRef();

  const handleText = () => {
    setText('text');
  };

  // 该 hook 需要定义抛出给父组件的可以使用的state或方法
  // 相当于代理了子组件的方法
  useImperativeHandle(ref, () => ({
    text,
    handleText,
    textInput
  }));

  return (
    <div>
      <input ref={textInput} />
    </div>
  );
});
const Parent = () => {
  const childInstance = useRef();
  // childInstance可以访问子组件的text，handleText，textInput
  return <CustomTextInput ref={childInstance} />;
};

/**
 * !!! 父组件获取子组件内部的class组件和DOM元素
 * 2种方法（forwardRef转发和传递回调函数）
 */

// 传递回调函数
const CustomTextInput = props => {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
};
class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = null;
  }

  setTextInputRef = element => {
    this.textInput = element;
  };

  render() {
    return (
      <CustomTextInput inputRef={setTextInputRef} />
      // inputRef通过props传递给子组件CustomTextInput的input标签，这样子this.textInput就可以获取子组件CustomTextInput中的input标签
      // 如果inputRef写成ref，是不能通过props传递给子组件CustomTextInput，因为react内部会处理特殊的props（如：ref、key），直接获取子组件的实例。
      // ref 和 key 并不是一个 prop，它由 React 专门处理
    );
  }
}

// forwardRef
const CustomTextInput = forwardRef((props, ref) => {
  // forwardRef是一项将 ref 自动地通过组件传递到其一子组件的技巧
  return (
    <div>
      <input ref={ref} />
    </div>
  );
});
const Parent = () => {
  const textInput = useRef();

  return <CustomTextInput ref={textInput} />;
};

// 高阶函数forwardRef的用法
