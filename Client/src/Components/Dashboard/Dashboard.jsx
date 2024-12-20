import React,{useState,useEffect} from "react";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import "./Dashboard.css";

const Dashboard = (props) => {

  const [users,setUsers]=useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      const toastId = toast.loading("Fetching details, please wait...", {
        position: "top-center",
      });

      try {
        const response = await axios.get(`${props.api}/allusers`);
        const totalUsers = response.data.users?.length || 0;
        setUsers(totalUsers);
        toast.update(toastId, {
          render: "Data fetched successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.update(toastId, {
          render: "Failed to fetch user details.",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    };

    fetchUsers();
  }, [props.api]);

  return (
    <div className="maindash-container">
      <div className="dash-container">
        <h1 className="main-head">Admin Dashboard</h1>
        <div className="item-container">
          <div className="dash-card">
            <h2 className="card-head">Number of Current Users: {users}</h2>
          </div>
          <div className="dash-card">
            <h2 className="card-head">Manage Users</h2>
            <NavLink to="/alluser">
              <Button variant="outlined" id="item-btn">
                Click here
              </Button>
            </NavLink>
          </div>
          <div className="dash-card">
            <h2 className="card-head">Add New User</h2>
            <NavLink to="/form">
              <Button variant="outlined" id="item-btn">
                Click here
              </Button>
            </NavLink>
          </div>
        </div>
        <a href="/" className="btn btn-primary">
          Logout
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
