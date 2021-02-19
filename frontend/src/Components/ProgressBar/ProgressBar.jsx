import React from 'react';
import {useState} from 'react'
import './ProgressBar.css';
const Progress = ({done}) => {
 console.log('Progress Bar');
	const [style, setStyle] = useState({});
	setTimeout(() => {
		const newStyle = {
			opacity: 1,
			width: `${done}%`
  }
		setStyle(newStyle);
	}, 300);
	
	return (
  <div>
  <p style={{textAlign:"center"}}>{done>90?"Generating Thumbnail...":"Processing Video..."}</p>
		<div className="progress">
			<div className="progress-done" style={style}>
				{done}%
			</div>
		</div>
  </div>
	)
}
export default Progress;

