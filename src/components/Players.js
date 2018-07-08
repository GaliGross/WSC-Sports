import React, { Component } from "react";
import FirstPlayer from "./FirstPlayer";

const baseUrl = "https://nodesenior.azurewebsites.net";

class Players extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      error: {
        msg: "",
        showErr: false
      }
    };
  }

  componentDidMount() {
    fetch(baseUrl + "/player/all")
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ players: responseJson });
      })
      .catch(err => {
        this.setState({ error: { msg: err.message, showErr: true } });
        console.error(err);
      });
  }

  render() {
    let {
      error: { msg, showErr },
      players
    } = this.state;
    return (
      <div>
        {showErr && <div>{msg}</div>}
        {players.length > 0 && (
          <FirstPlayer id={players[0]} baseUrl={baseUrl} />
        )}
      </div>
    );
  }
}

export default Players;
