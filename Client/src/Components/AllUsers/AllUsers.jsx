import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import Button from "@mui/material/Button";
import "./AllUsers.css";

const AllUsers = (props) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({
    role: "",
    permission: [],
    status: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const toastId = toast.loading("Fetching details, please wait...", {
        position: "top-center",
      });

      try {
        const response = await axios.get(`${props.api}/allusers`);
        setUsers(response.data.users);
        toast.update(toastId, {
          render: "Data fetched successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } catch (err) {
        console.error("Error fetching users:", err);
        toast.update(toastId, {
          render: "Error in fetching details.",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    };

    fetchUsers();
  }, [props.api]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    const toastId = toast.loading("Deleting user, please wait...", {
      position: "top-center",
    });

    try {
      await axios.delete(`${props.api}/deleteuser/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      toast.update(toastId, {
        render: "User deleted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.update(toastId, {
        render: "Error in deleting user.",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const handleEditClick = (user) => {
    setEditMode(user._id);
    setEditData({
      role: user.role,
      permission: user.permission,
      status: user.status,
    });
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (userId) => {
    const toastId = toast.loading("Saving changes, please wait...", {
      position: "top-center",
    });

    try {
      await axios.put(`${props.api}/updateuser/${userId}`, editData);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, ...editData } : user
        )
      );
      toast.update(toastId, {
        render: "Changes saved successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      setEditMode(null); 
    } catch (err) {
      console.error("Error saving changes:", err);
      toast.update(toastId, {
        render: "Error in saving changes.",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDetails = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  return (
    <div className="users-container">
      <h1 className="main-head">User Management</h1>

      <div style={{ margin: "20px 0px" }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearch}
          style={{
            padding: "10px",
            width: "90%",
            margin: "0 auto",
            display: "block",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h2>No user found</h2>
        </div>
      ) : (
        <div style={{ width: "90%", margin: "2vh auto", overflowX: "auto" }}>
          <table border="3" style={{ width: "100%", textAlign: "center" }}>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Name</th>
                <th>Check Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <React.Fragment key={user._id}>
                  <tr>
                    <td data-label="S.No">{index + 1}.</td>
                    <td data-label="Name">{user.name}</td>
                    <td data-label="Check Details">
                      <button
                        className="form-select"
                        onClick={() => toggleDetails(user._id)}
                      >
                        {expandedUserId === user._id
                          ? "Hide Details"
                          : "Show Details"}
                      </button>
                    </td>
                    <td data-label="Actions">
                      <button
                        className="btn btn-danger delbtn"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {expandedUserId === user._id && (
                    <tr>
                      <td colSpan="4">
                        <div
                          style={{
                            padding: "10px",
                            display: "flex",
                            textAlign: "left",
                          }}
                        >
                          <ul>
                            <li style={{ marginBottom: "10px" }}>
                              <strong>Name: </strong> {user.name}
                            </li>
                            <li style={{ marginBottom: "10px" }}>
                              <strong>Email ID: </strong> {user.email}
                            </li>
                            <li style={{ marginBottom: "10px" }}>
                              <strong>Role: </strong>{" "}
                              {editMode === user._id ? (
                                <select
                                  value={editData.role}
                                  onChange={(e) =>
                                    handleEditChange("role", e.target.value)
                                  }

                                  style={{
                                    padding: "5px",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                  }}
                                >
                                  <option value="Editor">Editor</option>
                                  <option value="Viewer">Viewer</option>
                                  <option value="Developer">Developer</option>
                                  
                                </select>
                              ) : (
                                user.role
                              )}
                            </li>
                            <li style={{ marginBottom: "10px" }}>
                              <strong>Status: </strong>{" "}
                              {editMode === user._id ? (
                                <select
                                  value={editData.status}
                                  onChange={(e) =>
                                    handleEditChange("status", e.target.value)
                                  }

                                  style={{
                                    padding: "5px",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                  }}
                                >
                                  <option value="Active">Active</option>
                                  <option value="Inactive">Inactive</option>
                                </select>
                              ) : (
                                user.status
                              )}
                            </li>
                            <li>
                              <strong>Permission: </strong>{" "}
                              {editMode === user._id ? (
                                <select
                                  multiple
                                  value={editData.permission}
                                  onChange={(e) =>
                                    handleEditChange(
                                      "permission",
                                      Array.from(
                                        e.target.selectedOptions,
                                        (opt) => opt.value
                                      )
                                    )
                                  }

                                  style={{
                                    padding: "5px",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                    width: "100%",
                                  }}
                                >
                                  <option value="Read">Read</option>
                                  <option value="Write">Write</option>
                                  <option value="Execute">Edit</option>
                                </select>
                              ) : (
                                user.permission.join(", ")
                              )}
                            </li>
                          </ul>
                          {editMode === user._id ? (
                            <button
                              className="btn btn-primary editbtn"
                              onClick={() => handleSave(user._id)}
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              className="btn btn-secondary editbtn"
                              onClick={() => handleEditClick(user)}
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td colSpan="4">
                      <hr
                        style={{
                          borderTop: "3px solid black",
                          margin: "10px 0",
                        }}
                      />
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <NavLink to="/dashboard">
        <Button variant="outlined" id="homebtn">
          Go to dashboard
        </Button>
      </NavLink>
    </div>
  );
};

export default AllUsers;
