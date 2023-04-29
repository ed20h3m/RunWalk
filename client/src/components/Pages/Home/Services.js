import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
const Services = () => {
  return (
    <div className="work-section-wrapper">
      <div className="work-section-top">
        <p className="primary-subheading">More than just gym</p>

        <p className="primary-text">
          "From cardio to strength training, we've got everything you need for a
          complete workout."
        </p>
      </div>
      <div className="work-section-bottom">
        <div className="work-section-info">
          <div className="info-boxes-img-container">
            <img
              style={{
                borderRadius: "9px",
                width: "13rem",
              }}
              src="https://th.bing.com/th/id/OIP.Af5xytSPhssIbIACQ0PnYAHaE8?pid=ImgDet&rs=1"
              alt=""
            />
          </div>
          <h2>Cardio equipment</h2>
        </div>{" "}
        <div className="work-section-info">
          <div className="info-boxes-img-container">
            <img
              style={{
                borderRadius: "9px",
                width: "13rem",
              }}
              src="https://th.bing.com/th/id/OIP.TviM-I03wjBCk9NSF2KM9wHaE2?pid=ImgDet&rs=1"
              alt=""
            />
          </div>
          <h2>Strength training equipment</h2>
        </div>{" "}
        <div className="work-section-info">
          <div className="info-boxes-img-container">
            <img
              style={{
                borderRadius: "9px",
                width: "13rem",
              }}
              src="https://olympiafitnessri.com/wp-content/uploads/2021/03/People-doing-pushups-together-in-a-health-club-class-853407238_5976x3984-scaled-e1615396175580.jpeg"
              alt=""
            />
          </div>
          <h2>Group fitness classes</h2>
        </div>
      </div>
    </div>
  );
};

export default Services;
