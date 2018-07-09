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
    this.onChanedHandler = this.onChanedHandler.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { edited, initalValue } = this.state;
    if (edited && nextProps.value !== initalValue) {
      return false;
    }
    if(!edited && nextProps.value === initalValue){
      // if new value was fetched will write the new value to firstPlayerEdited
    
    }
    return true;
  }

  onChanedHandler(e){
    this.setState({value:e.target.value, edited:true});
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
          onChanedHandler={this.onChanedHandler}
          updateStateHendler={this.props.updateStateHendler}
          statePath={this.props.statePath}
        />
        <MyVideoPlayer src={value} width="320" height="240" controls />
      </span>
    );
  }
}

export default FormVideo;
