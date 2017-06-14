var React = require('react');
var ReactDOM = require('react-dom');
var WindowSizeListener = require('react-window-size-listener-dev');

var App = React.createClass({
	render () {
		return (
			<div>
				<WindowSizeListener />
			</div>
		);
	}
});

ReactDOM.render(<App />, document.getElementById('app'));
