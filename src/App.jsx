import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/home";
import Projects from "./components/projects";

function ScrollToTop() {
	const { pathname } = useLocation();
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);
	return null;
}

export default function App() {
	return (
		<>
			<ScrollToTop />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/projects" element={<Projects />} />
			</Routes>
		</>
	);
}
