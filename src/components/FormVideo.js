import React, { Component } from "react";
import MyVideoPlayer from "./MyVideoPlayer";
import FormInput from "./FormInput";

class FormVideo extends Component {
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
    const { value } = this.state,
      { lable, type } = this.props;
    return (
      <span className="image-wrapper">
        {lable}
        <FormInput
          lable=""
          value={value}
          type={type}
          updateStateHendler={this.props.updateStateHendler}
          statePath={this.props.statePath}
        />
        <MyVideoPlayer src={value} width="320" height="240" controls />
      </span>
    );
  }
}

export default FormVideo;
