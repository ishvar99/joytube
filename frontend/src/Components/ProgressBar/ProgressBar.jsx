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
	}, 200);
	
	return (
  <div>
		<div className="progress">
			<div className="progress-done" style={style}>
				{done>=10&&`${done}%`}
			</div>
		</div>
  </div>
	)
}
export default Progress;

