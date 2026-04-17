import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useRoutes } from "./routes";
import Navbar from "./main/Navbar";
import Footer from "./main/Footer";
import { RegionProvider } from "./context/RegionContext";

const App = () => {
  const routes = useRoutes();

  return (
    <RegionProvider>
    <Router>
 
      <div className="min-h-screen flex flex-col justify-between">
        <Navbar/>
        <main className="flex-grow">
          <Routes>
            {routes.map(({ path, element: Element }) => (
              <Route key={path} path={path} element={<Element />} />
            ))}
          </Routes>
        </main>

      </div>

    </Router>
    </RegionProvider>
  );
};



export default App;
