import React, { Component } from 'react';
import videoConnect  from 'react-html5video';
import 'react-html5video/dist/styles.css';



const MyVideoPlayer = ({ video, videoEl, children, ...restProps }) => {
	return(
    <div>
        <video {...restProps}>
            { children }
        </video>
    </div>
)};

export default videoConnect(MyVideoPlayer)