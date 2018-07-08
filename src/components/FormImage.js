import React, { Component } from "react";
import FormInput from "./FormInput";

class FormImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initalValue: this.props.value,
      value: this.props.value,
      edited: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { edited, initalValue } = this.state;
    if (edited && nextProps.value !== initalValue) {
      return false;
    }
    return true;
  }

  render() {
    const { value } = this.state;
    return (
      <span className="image-wrapper">
        <FormInput
          lable=""
          value={value}
          type="text"
          updateStateHendler={this.props.updateStateHendler}
          statePath={this.props.statePath}
        />
        <img src={value} alt="player" />
      </span>
    );
  }
}

export default FormImage;
