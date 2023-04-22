import React from "react";
// import Navbar from "./Navbar";
import { FiArrowRight } from "react-icons/fi";
import Testimonial from "./Testimonial";
import Contact from "./Contact";
import Services from "./Services";
import Work from "./Work";
import Footer from "../../utils/Footer";
import "../../utils/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      {/* <Navbar /> */}
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img
            style={{
              borderRadius: "20px",
              height: "18rem",
            }}
            src="https://th.bing.com/th/id/OIP.8lPvLtwNekF8Vip6DUoDHAHaDe?pid=ImgDet&rs=1"
            alt=""
          />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">
            Fitness isn't about being better than someone else, it's about being
            better than you used to be.
          </h1>
          <p className="primary-text">
            Your body can stand almost anything. It's your mind that you have to
            convince.
          </p>
          <button className="secondary-button">
            Join Now <FiArrowRight />{" "}
          </button>
        </div>
      </div>
      {/* <hr /> */}
      <Services />
      <Work />
      <Testimonial />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
