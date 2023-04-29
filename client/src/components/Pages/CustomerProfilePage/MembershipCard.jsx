import React, { useEffect, useContext } from "react";
import { SessionContext } from "../../../context/Sessions/SessionState";

const MembershipCard = () => {
  const { GetInfo, info } = useContext(SessionContext);
  useEffect(() => {
    GetInfo();
  }, [info]);
  return (
    <div className="membership-card">
      <h3>Memberships</h3>
      <div className="cards">
        <div className="monthly">
          <div className="title">
            <h3>Monthly </h3>
          </div>
          <h5>1. Subscribe only for £{info.MonthlyPrice} monthly</h5>
          <h5>2. Full Access To all facilities</h5>
          <h5>3. Booking from 8 m to 10pm</h5>
          <h5>4. Amend Bookings from your account</h5>
          <h5>5. Book Multiple sessions at once</h5>
          <h5>6. Cancel At Any Time</h5>
          {/* <div className="sub-con">
            <button className="sub-btn">Subscribe</button>
          </div> */}
        </div>
        <div className="yearly">
          <div className="title">
            <h3>Annual</h3>
          </div>
          <h5>1. Subscribe only for £{info.AnnualPrice} Annually</h5>
          <h5>2. Full Access To all facilities</h5>
          <h5>3. Booking from 8 m to 10pm</h5>
          <h5>4. Amend Bookings from your account</h5>
          <h5>5. Book Multiple sessions at once</h5>
          <h5>6. Cancel At Any Time</h5>
          {/* <div className="sub-con">
            <button className="sub-btn">Subscribe</button>
          </div> */}
        </div>
      </div>
    </div>
  );
};
export default MembershipCard;
