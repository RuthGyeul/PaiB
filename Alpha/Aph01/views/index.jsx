import React from 'react';

class App extends React.Component {
	render() {
		return (
			<>
				<link rel="stylesheet" href="/public/styles.css" />
				<div className="App">
					<header className="App-header">
						<img src="/public/logo.svg" className="App-logo" alt="logo" />
						<p>
							<code>PaiB Server Activated</code>
						</p>
						<a
							className="App-link"
							href="https://stats.uptimerobot.com/Vo4oVIlnOX"
							target="_blank"
							rel="noopener noreferrer"
						>
							Server Status
						</a>
					</header>
				</div>
			</>
		);
	}
}

export default App;
