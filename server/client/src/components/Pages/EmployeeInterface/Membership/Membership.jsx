import React, { useState } from 'react';
import './Membership.css';
import { useContext } from 'react';
import { AuthContext } from '../../../../context/Authentication/AuthState';
import { useEffect } from 'react';

const MembershipButton = ({isMember}) => {
  const [showModal, setShowModal] = useState(false);
  const {customer, PutCustomer, GetCustomerDetails} = useContext(AuthContext)

  const handleSubscribe = () => {
    // handle subscription logic here
      PutCustomer({_id: customer._id, isMember: true}).then(()=>
      {
        if(localStorage.getItem('customer_email'))
        GetCustomerDetails(localStorage.getItem('customer_email'))
      })
   
    setShowModal(false);
  }

  const handleCancel = () => {
    // handle cancel subscription logic here
    PutCustomer({_id: customer._id, isMember: false}).then(()=>
    {
      if(localStorage.getItem('customer_email'))
      GetCustomerDetails(localStorage.getItem('customer_email'))
    }
  )
  }
  const handleClose = () => {
    // handle cancel subscription logic here
    setShowModal(false)
  }

  useEffect(()=>{
    console.log(customer)
  },[customer])
  
  return (
    <>
      <button className="click-button" onClick={() => setShowModal(true)}>
        Membership
      </button>
      {showModal && (
        <div className="membership-modal">
          <div className="membership-modal-content">
            {isMember ? (
              <>
                <h3>You are currently subscribed to:</h3>
                <h2>Run Walk Sports Centre Subscription</h2>
                <button  onClick={handleCancel}>Cancel subscription</button>
                <button  onClick={handleClose}>Close</button>
              </>
            ) : (
              <>
                <h3>Choose a membership option:</h3>
                <button onClick={() => handleSubscribe()}>Subscribe to Monthly membership</button>
                <button onClick={() => handleSubscribe()}>Subscribe to Annual membership</button>
                <button  onClick={handleClose}>Close</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
  
};

export default MembershipButton;
