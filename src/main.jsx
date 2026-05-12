import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<HelmetProvider>
			<ErrorBoundary>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</ErrorBoundary>
		</HelmetProvider>
	</React.StrictMode>,
)