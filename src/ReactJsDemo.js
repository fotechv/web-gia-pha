import React from "react";

// Tham khảo https://reactjs.org/docs/refs-and-the-dom.html

export class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    console.log(this.props.myRef);
    return <div ref={this.myRef} />;
  }
}

export class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.textInput.current.focus();
  }

  render() {
    // tell React that we want to associate the <input> ref
    // with the `textInput` that we created in the constructor
    return (
      <div className="form-inline">
        {/* <input type="text" className="form-control col-sm-10" ref={this.textInput} /> */}
        {/* <input type="button" value="Focus the text input" onClick={this.focusTextInput} /> */}

        <div className="form-group mb-2">
          <label htmlFor="staticEmail2" className="sr-only">
            Email
          </label>
          <input type="text" readOnly className="form-control-plaintext" id="staticEmail2" defaultValue="email@example.com" />
        </div>
        <div className="form-group mx-sm-3 mb-2">
          <label htmlFor="inputPassword2" className="sr-only">
            Password
          </label>
          <input type="password" className="form-control" id="inputPassword2" placeholder="Password" ref={this.textInput} />
        </div>
        <button type="submit" className="btn btn-primary mb-2" value="Focus the text input" onClick={this.focusTextInput}>
          Confirm identity
        </button>
      </div>
    );
  }
}

export class AutoFocusTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.textInput.current.focusTextInput();
  }

  render() {
    return <CustomTextInput ref={this.textInput} />;
  }
}

function MyFunctionComponent() {
  return <input />;
}

export class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }
  render() {
    // This will *not* work!
    return <MyFunctionComponent ref={this.textInput} />;
  }
}
