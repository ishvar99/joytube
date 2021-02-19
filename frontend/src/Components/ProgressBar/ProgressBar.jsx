import React from 'react';
import './ProgressBar.css';
const Progress = ({done}) => {
	const [style, setStyle] = React.useState({});
	console.log(done);
	setTimeout(() => {
		const newStyle = {
			opacity: 1,
			width: `${done}%`
  }
		setStyle(newStyle);
	}, 100);
	
	return (
  <div>
  <p style={{textAlign:"center"}}>Processing Video...</p>
		<div className="progress">
			<div className="progress-done" style={style}>
				{done}%
			</div>
		</div>
  </div>
	)
}
export default Progress;

