import React, { Component } from 'react';
import MyVideoPlayer from './MyVideoPlayer';

//TODO: change state. add for each node status: inputEdit:true/false. if input was edit (inputEdit:true) then when pooling data with fetch, 
// it will not override the node state. if inputEdit:false, node data will be ovveride. 
// TODO: add function to deal with swiching between state data, to the fetched json.   
class FirstPlayer extends Component{
	constructor(props){
		super(props);
		this.state = {
			player:{}
		}
		this.getNestedList = this.getNestedList.bind(this);
		this.handleSubmit =this.handleSubmit.bind(this);
		this.onChangeHandle = this.onChangeHandle.bind(this);
	}

	componentWillReceiveProps(nextProps){
		let pollingEvrySecond = ()=> {
			fetch(nextProps.baseUrl + '/player/' + nextProps.id)
			.then((response) => response.json())
			.then((responseJson)=>{
				this.setState({player:responseJson});
			})
			.catch((err) =>{
				console.error(err);
			});
		}
		pollingEvrySecond();
		setInterval(pollingEvrySecond, 1000);
			
	}

	handleSubmit(e){
		e.preventDefault();
		// post all updated data
		fetch(this.props.baseUrl + '/player/' + this.props.id, {
		    method: 'post',
		    body: JSON.stringify(this.state.player)})
			.then((responseJson)=>{
				//ok
			})
			.catch((err) =>{
				console.error(err);
			}); 
	}

	onChangeHandle(e){
		let { player } = this.state;
		const key = e.target.getAttribute('data-key');
		//clone state to override it with new input value
		let  cloneState = Object.assign({},this.state);
		let pointer = cloneState.player;
		const keys = key.split('.');
		for(let i=0; i<keys.length-1; i++){
			pointer = pointer[keys[i]];
		}
		//override coloned state with input data
		pointer[keys[keys.length-1]] = e.target.value;
		this.setState(cloneState);
	}

	getNestedList(){
		const 	{ player } =  this.state,
				playerArr = Object.entries(player);
		return (<ul className="treeview">
				{ !!playerArr && playerArr.map((key, i)=>
					(<li key={key[0]+i}>{this.getUlContent(key,"")}</li>))}
				<input type="submit" value="Save" /></ul>)
	}

	/*
	* @return one of the following tags: input, img or video, and nested list <ul> 
	*/
	getUlContent(k,i){
		let statePath = (i !== "") ? i + "." +k[0] : k[0]; 
  		if(Array.isArray(k)){
			const key = k[0], value=k[1];
			if(typeof value === "string"){
				if(value.endsWith(".jpg") || value.endsWith('.png')){
					return (<span><img src={value}/></span>);
				}
				else if(value.endsWith(".mp4")){
					return (<span><MyVideoPlayer src={value} width="320" height="240" controls/></span>);
				}
				//return input text - value need to point to state path
				return (<span>{key}<input type="text" value={value} data-key={statePath} onChange={this.onChangeHandle}/></span>)
			}
			if(typeof value === "number"){
				//returns input number
				return (<span>{key}<input type="number" value={value} data-key={statePath} onChange={e=> this.setState({})}/></span>)
			}
			if(typeof value === "object"){
				//return <ul><ul>
				const valueArr = Object.entries(value);
				let newStatePath = statePath + "." + key;
				if(statePath.endsWith(key)){
					newStatePath = statePath;
				}
				//if (!valueArr){return}
				return (<span>{key}<ul>{key && valueArr.map((k, j)=>(<li key={key+i+j}>{this.getUlContent(k, newStatePath)}</li>))}</ul></span>)
			}	
		}
	}

	getInputHtml(propertyValue){
		return (<li><input 
					type="text" 
					value={propertyValue} 
					onChange={e=>this.setState({})}/></li>)	
	}


	render(){
		const { player:{ player, statistics, team } } = this.state;
		
		return (<div>
			{player && <form onSubmit={this.handleSubmit}>{this.getNestedList()}
			</form>}
			</div>)
	}

}

export default FirstPlayer;