import React, { Component } from 'react';
import MyVideoPlayer from './MyVideoPlayer';

//TODO: change state. add for each node status: inputEdit:true/false. if input was edit (inputEdit:true) then when pooling data with fetch, 
// it will not override the node state. if inputEdit:false, node data will be ovveride. 
// TODO: add function to deal with swiching between state data, to the fetched json.   
class FirstPlayer extends Component{
	constructor(props){
		super(props);
		this.state = {
			firstPlayer:{}
		}
		this.getNestedList = this.getNestedList.bind(this);
		this.handleSubmit =this.handleSubmit.bind(this);
		this.onChangeHandle = this.onChangeHandle.bind(this);
	}
	componentDidMount(){
		let pollingEvrySecond = ()=> {
			fetch(this.props.baseUrl + '/player/' + this.props.id)
			.then((response) => response.json())
			.then((responseJson)=>{
				this.setState({firstPlayer:responseJson});
			})
			.catch((err) =>{
				console.error(err);
			});
		}
		pollingEvrySecond();
		//setInterval(pollingEvrySecond, 1000);

	}

	handleSubmit(e){
		e.preventDefault();
		// post all updated data
		fetch(this.props.baseUrl + '/player/' + this.props.id, {
		    method: 'post',
		    body: JSON.stringify(this.state.firstPlayer)})
			.then((responseJson)=>{
				//ok
			})
			.catch((err) =>{
				console.error(err);
			}); 
	}

	onChangeHandle(e){
		const key = e.target.getAttribute('data-key');
		//clone state to override it with new input value
		let  cloneState = Object.assign({},this.state);
		let pointer = cloneState.firstPlayer;
		const keys = key.split('.');
		for(let i=0; i<keys.length-1; i++){
			pointer = pointer[keys[i]];
		}
		//override coloned state with input data
		pointer[keys[keys.length-1]] = isNaN(e.target.value) ? e.target.value : Number(e.target.value);
		this.setState(cloneState);
	}

	getNestedList(){
		const 	{ firstPlayer } =  this.state,
				playerArr = Object.entries(firstPlayer);
		return (<ul className="treeview">
				{ !!playerArr && playerArr.map((key, i)=>
					(<li className="bulet-0" key={key[0]+i}>{this.getUlContent(key,"",0)}</li>))}
				<input type="submit" value="Save" /></ul>)
	}

	/*
	* @return one of the following tags: input, img or video, and nested list <ul> 
	*/
	getUlContent(k,i,bulletDurker){
		let statePath = (i !== "") ? i + "." +k[0] : k[0]; 
  		if(Array.isArray(k)){
			const key = k[0], value=k[1];
			if(typeof value === "string"){
				if(value.endsWith(".jpg") || value.endsWith('.png')){
					return (<span className="image-wrapper"><input type="text" value={value} data-key={statePath} onChange={this.onChangeHandle}/><img src={value} alt="player" /></span>);
				}
				else if(value.endsWith(".mp4")){
					return (<span className="image-wrapper"><input type="text" value={value} data-key={statePath} onChange={this.onChangeHandle}/><MyVideoPlayer src={value} width="320" height="240" controls/></span>);
				}
				//return input text - value need to point to state path
				return (<span>{key}<input type="text" value={value} data-key={statePath} onChange={this.onChangeHandle}/></span>)
			}
			if(typeof value === "number"){
				//returns input number
				return (<span>{key}<input type="number" value={value} data-key={statePath} onChange={this.onChangeHandle}/></span>)
			}
			if(typeof value === "object"){
				//return <ul><ul>
				const valueArr = Object.entries(value);
				let newStatePath = statePath + "." + key;
				if(statePath.endsWith(key)){
					newStatePath = statePath;
				}
				
				bulletDurker += 40;
				let bulletStyle = `bulet-${bulletDurker}`;

				return (<span>{key}<ul>{key && valueArr.map((k, j)=>(<li className={bulletStyle} key={key+i+j}>{this.getUlContent(k, newStatePath,bulletDurker)}</li>))}</ul></span>)
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
		const { firstPlayer:{ player } } = this.state;
		
		return (<div>
			{player && <form onSubmit={this.handleSubmit}>{this.getNestedList()}
			</form>}
			</div>)
	}

}

export default FirstPlayer;