import { Outlet } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

function Root() {

  return (
    <>
    <Header />
      <ScrollToTop />
      <Outlet />
    <Footer />
    </>
  )
}

export default Root
