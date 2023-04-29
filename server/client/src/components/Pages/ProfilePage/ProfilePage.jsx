import React, { useState } from "react";

import { useForm } from "react-hook-form";

import "./ProfilePage.css";

const ProfilePage = () => {
  const [Fname, setFName] = useState("");
  const [newFName, setFNewName] = useState("");
  const [Lname, setLName] = useState("");
  const [LnewName, setLNewName] = useState("");
  const [email, setEmail] = useState("dummyEmail@gmail.com");
  const [newEmail, setNewEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // console.log(data);
  };

  const onEmailChange = () => {
    setNewEmail(email);
  };
  const onNameChangeF = () => {
    setFNewName(Fname);
  };
  const onNameChangeL = () => {
    setLNewName(Lname);
  };
  return (
    <div className="con-all">
      <div className="bg-white section-margin profile__container">
        <div className="profile__row">
          <div className="profile__col left">
            <h2>Personal Details</h2>

            <div className="profile__personal-details">
              <form onSubmit={handleSubmit(onSubmit)}>
                <label>First Name:</label>
                <input
                  {...register("firstName")}
                  onChange={(e) => setFName(e.target.value)}
                  placeholder="First Name"
                  type="text"
                  name="firstName"
                />
                <span>
                  Current Name: <strong>{newFName}</strong>{" "}
                </span>
                <button
                  onClick={onNameChangeF}
                  type="submit"
                  className="profile__change-btn"
                >
                  Change Name
                </button>
                <br />
                <label>Last Name:</label>
                <input
                  {...register("lastName")}
                  onChange={(e) => setLName(e.target.value)}
                  placeholder="Last Name"
                  type="text"
                  name="lastName"
                />
                <span>
                  Current Name: <strong>{LnewName}</strong>{" "}
                </span>
                <button
                  onClick={onNameChangeL}
                  type="submit"
                  className="profile__change-btn"
                >
                  Change Surname
                </button>
                <br />
                <label>Email address:</label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Change Email"
                  type="email"
                  name="email"
                />
                <span>
                  Current Email Address: <strong>{newEmail}</strong>{" "}
                </span>
                <button
                  onClick={onEmailChange}
                  type="submit"
                  className="profile__change-btn"
                >
                  Change Email
                </button>
                <br />
                <label>Password:</label>
                <input
                  {...register("newPassword")}
                  placeholder="Change Password"
                  type="password"
                  name="email"
                />
                <button type="submit" className="profile__change-btn">
                  Change Password
                </button>
                <br />
                <label className="membership">MEMBERSHIP STATUS: </label>
                <div className="buttons">
                  <button>Cancel</button>
                  <button className="bg-dark">Save</button>
                </div>
              </form>
            </div>
          </div>
          {/* 
        <div className="profile__col right">
          <h2>Personal Details</h2>
          <div className="profile__personal-details membership">
            <h5>MEMBERSHIP STATUS:</h5>
          </div>
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
