import React, { Component } from "react";

class FormInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initalValue: this.props.value,
      value: this.props.value,
      edited: false
    };
    this.onChangeHandle = this.onChangeHandle.bind(this);
    this.updateStateHendler = this.updateStateHendler.bind(this);
  }

  onChangeHandle(e) {
    this.setState({ value: e.target.value, edited: true });
    this.props.onChanedHandler && this.props.onChanedHandler(e);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { edited, initalValue } = this.state;
    if (edited && nextProps.value !== initalValue) {
      return false;
    }
    if(!edited && nextProps.value !== initalValue){
      // if new value was fetched will update state
      this.setState({initalValue:nextProps.value, value: nextProps.value})
     
    }
    return true;
  }

  updateStateHendler() {
    const { value } = this.state,
      { statePath } = this.props;
    this.props.updateStateHendler(statePath, value);
  }

  render() {
    const { value } = this.state,
      { lable, type } = this.props;
    return (
      <span>
        {lable}
        <input
          className="form-input"
          type={type}
          value={value}
          onBlur={this.updateStateHendler}
          onChange={this.onChangeHandle}
        />
      </span>
    );
  }
}

export default FormInput;
