import React from 'react'

// 使用createRef方法创建ref
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  handleSubmit = e => {
    e.preventDefault();
    console.log(this.textInput.current.value);
  };

  render() {
    return (
      <div>
        <form onSubmit={e => this.handleSubmit(e)}>
          <input type="text" ref={this.textInput}/>
          <button>Submit</button>
        </form>
      </div>
    );
  }
}

// 使用回调函数创建ref
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    console.log(this.textInput.value);
  };

  render() {
    return (
      <div>
        <form onSubmit={e => this.handleSubmit(e)}>
          <input type="text" ref={this.setTextInputRef}/>
          <button>Submit</button>
        </form>
      </div>
    );
  }
}

// React.forwardRef
