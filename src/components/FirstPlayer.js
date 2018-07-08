import React, { Component } from "react";
import FormImage from "./FormImage";
import FormInput from "./FormInput";
import FormVideo from "./FormVideo";

class FirstPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstPlayer: {}, // read only
      firstPlayerEdited: {} // a copy of firstPlayer fetched from service. can be override by input data
    };
    this.getNestedList = this.getNestedList.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateState = this.updateState.bind(this);
  }
  componentDidMount() {
    let isFetchFirstTime = true;
    let pollingEvrySecond = () => {
      fetch(this.props.baseUrl + "/player/" + this.props.id)
        .then(response => response.json())
        .then(responseJson => {
          this.setState({ firstPlayer: responseJson });
          if (isFetchFirstTime) {
            isFetchFirstTime = false;
            this.setState({ firstPlayerEdited: responseJson });
          }
        })
        .catch(err => {
          console.error(err);
        });
    };
    pollingEvrySecond();
    setInterval(pollingEvrySecond, 1000);
  }

  updateState(key, value) {
    //clone state to override it with new input value
    let cloneState = Object.assign({}, this.state.firstPlayerEdited);
    let pointer = cloneState;
    const keys = key.split(".");
    for (let i = 0; i < keys.length - 1; i++) {
      pointer = pointer[keys[i]];
    }
    //override coloned state with input data
    pointer[keys[keys.length - 1]] = value;
    this.setState({ firstPlayerEdited: cloneState });
  }

  // On subnit event will post the firstPlayerEdited
  handleSubmit(e) {
    e.preventDefault();
    // post all updated data
    fetch(this.props.baseUrl + "/player/" + this.props.id, {
      method: "post",
      body: JSON.stringify(this.state.firstPlayerEdited)
    })
      .then(responseJson => {
        //ok
      })
      .catch(err => {
        console.error(err);
      });
  }

  getNestedList() {
    const { firstPlayer } = this.state,
      playerArr = Object.entries(firstPlayer);
    return (
      <ul className="treeview">
        {!!playerArr &&
          playerArr.map((key, i) => (
            <li className="bulet-0" key={key[0] + i}>
              {this.getUlContent(key, "", 0)}
            </li>
          ))}
        <input type="submit" value="Save" />
      </ul>
    );
  }

  /*
	* @return one of the following tags: input, img or video, and nested list <ul> 
	*/
  getUlContent(k, i, bulletDurker) {
    let statePath = i !== "" ? i + "." + k[0] : k[0];
    if (Array.isArray(k)) {
      const key = k[0],
        value = k[1];
      if (typeof value === "string") {
        if (value.endsWith(".jpg") || value.endsWith(".png")) {
          return (
            <FormImage
              value={value}
              updateStateHendler={this.updateState}
              statePath={statePath}
            />
          );
        } else if (value.endsWith(".mp4")) {
          return (
            <FormVideo
              lable={key}
              value={value}
              type="text"
              updateStateHendler={this.updateState}
              statePath={statePath}
            />
          );
        }
        //return input text - value need to point to state path
        return (
          <FormInput
            lable={key}
            value={value}
            type="text"
            updateStateHendler={this.updateState}
            statePath={statePath}
          />
        );
      }
      if (typeof value === "number") {
        //returns input number
        return (
          <FormInput
            lable={key}
            value={value}
            type="number"
            updateStateHendler={this.updateState}
            statePath={statePath}
          />
        );
      }
      if (typeof value === "object") {
        //return <ul><ul>
        const valueArr = Object.entries(value);
        let newStatePath = statePath + "." + key;
        if (statePath.endsWith(key)) {
          newStatePath = statePath;
        }

        bulletDurker += 40;
        let bulletStyle = `bulet-${bulletDurker}`;

        return (
          <span>
            {key}
            <ul>
              {key &&
                valueArr.map((k, j) => (
                  <li className={bulletStyle} key={key + i + j}>
                    {this.getUlContent(k, newStatePath, bulletDurker)}
                  </li>
                ))}
            </ul>
          </span>
        );
      }
    }
  }

  render() {
    const {
      firstPlayer: { player }
    } = this.state;

    return (
      <div>
        {player && (
          <form onSubmit={this.handleSubmit}>{this.getNestedList()}</form>
        )}
      </div>
    );
  }
}

export default FirstPlayer;
