import About from "../../pages/About";
import Contact from "../../pages/Contact";
import Home from "../../pages/Home";
import Services from "../../pages/Services";
import Tools from "../../pages/Tools";


export const publicRoutes = [
  {
    path: "/",
    element: Home,
  },
    {
    path: "/about",
    element: About,
  },
   {
    path: "/services",
    element: Services,
  },
    {
    path: "/contact-us",
    element: Contact,
  },
    {
    path: "/bnb-tools-enam",
    element: Tools,
  },
];
