import React, { Component } from 'react';
import MyVideoPlayer from './MyVideoPlayer';

class FirstPlayer extends Component{
	constructor(props){
		super(props);
		this.state = {
			player:{}
		}
	}

	componentWillReceiveProps(nextProps){
			fetch(nextProps.baseUrl + '/player/' + nextProps.id)
			.then((response) => response.json())
			.then((responseJson)=>{
				this.setState({player:responseJson});
			})
			.catch((err) =>{
				console.error(err);
			});
			//src={statistics.lastgame.game_highlights}
	}


	render(){
		const { player:{ player, statistics, team } } = this.state;
		
		return (<div>
		
			{player && <form>
				<ul className="treeview">
					<li className="player"> Player
						<ul>
							<li>Name</li>
							<li>Image</li>
							<img src={player.player_highlights}/>
							<li>statistics
								<ul>
									<li>Points</li>
									<li>Points</li>
								</ul>
							</li>
							<li>Last Game
								<ul>
									<li>Clip</li>
								</ul>
							</li>
							<MyVideoPlayer src={statistics.lastgame.game_highlights} width="320" height="240" controls/>
							<input type="submit" value="Save" />
						</ul>
					</li>
				</ul>	
			</form>}
			</div>)
	}

}

export default FirstPlayer;