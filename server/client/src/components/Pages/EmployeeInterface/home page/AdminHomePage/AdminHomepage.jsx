import React, { useState, useContext, useEffect } from "react";
import "./AdminHomepage.css";
import Footer from "../../../../utils/Footer";
import Activity from "../Activity/Activity";
import SearchBar from "../SearchBar/SearchBar";
import { SessionContext } from "../../../../../context/Sessions/SessionState";
import { AlertContext } from "../../../../../context/Alert/Alert";
import Loading from "../../../../utils/Loading";
import { useNavigate } from "react-router";
import MembershipButton from "../../Membership/Membership";
import { AuthContext } from "../../../../../context/Authentication/AuthState";
const AdminHomepage = () => {
  
  const navigate = useNavigate();
  const { BookedSessions, GetSessions } = useContext(SessionContext);
  const { isLoading } = useContext(AlertContext);
  const {customer, GetCustomerDetails} = useContext(AuthContext)
  const [customerEmail, setCustomerEmail] = useState(null)
  
  useEffect(()=> {
    if(localStorage["customer_email"])
    {
      setCustomerEmail(localStorage["customer_email"])
      GetCustomerDetails(localStorage["customer_email"])
      GetSessions(localStorage["customer_email"])
    }
  },[])

  useEffect(()=>{
    if(customer?.Email)
    {
      localStorage.setItem("customer_email", customer.Email);
      setCustomerEmail(customer.Email);
      GetSessions(customer.Email)  
    }
  },[customer])

 
  return isLoading ? (
    <Loading />
  ) : (
    <>
      <SearchBar customerEmail = {customerEmail}/>
      
        {BookedSessions.length > 0 || customer ? 
        (
          <>
          <div className="activities-container">
         {BookedSessions.map(
            (
              activity //Rendering each activity component
            ) => <Activity key={activity._id} {...activity}></Activity>
          )}
           </div>
            <div className="buttons-container">
            <button className="click-button" onClick = {()=>{navigate("booking")}}>Book Session</button>
            <MembershipButton isMember = {customer?.isMember}></MembershipButton>
          </div>
          </>
        ) : (
          <div style={{ paddingBottom: "460px" }}></div>
        )}
     
     
      <Footer />
    </>
  );
};

export default AdminHomepage;
