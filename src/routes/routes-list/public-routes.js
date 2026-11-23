import About from "../../pages/About";
import Contact from "../../pages/Contact";
import Home from "../../pages/Home";
import Services from "../../pages/Services";
import Toolkit from "../../pages/Toolkit";
import Tools from "../../pages/Tools";
import SheBelongs from "../../pages/us/SheBelongs";
import BecomeMentor from "../../pages/us/BecomeMentor";
import GetHelp from "../../pages/us/GetHelp";


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
    path: "/toolkit-enam",
    element: Toolkit,
  },
  {
    path: "/bnb-tools-enam",
    element: Tools,
  },
  {
    path: "/shebelongs",
    element: SheBelongs,
  },
  {
    path: "/become-a-mentor",
    element: BecomeMentor,
  },
  {
    path: "/get-help",
    element: GetHelp,
  },
];
