import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import { Layout } from "../../Components";
import { toast } from "react-toastify";
import { registerRoute } from "../../utils/APIRoute";
import axios from "axios";
import {
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
} from "@mui/material";
const toastOption = {
	position: "bottom-right",
	autoClose: 8000,
	pauseOnHover: true,
	theme: "light",
};

const SignUp = () => {
	const [info, setinfo] = useState({
		username: "",
		email: "",
		password: "",
		confirmPass: "",
		admin: true,
	});
	const navigate = useNavigate();
	function handleSubmit() {
		const { email, username, password, admin } = info;
		if (handleValidation()) {
			const dataPromise = new Promise(function (resolve, reject) {
				axios
					.post(registerRoute, {
						username,
						email,
						password,
						admin,
					})
					.then((res) => {
						if (res.data.status === false) {
							reject(new Error(res.data.msg));
						} else {
							localStorage.setItem(
								"branchInternational",
								JSON.stringify(res.data.user)
							);
							navigate("/allqueries");
							resolve("Registered");
						}
					})
					.catch((err) => {
						reject(new Error("Something went wrong ?"));
					});
			});
			toast.promise(
				dataPromise,
				{
					pending: {
						render() {
							return "Processing Request";
						},
					},
					success: {
						render({ data }) {
							return `Successfully ${data} 👌`;
						},
					},
					error: {
						render({ data }) {
							return `${data}`;
						},
					},
				},
				toastOption
			);
		}
	}
	function handleValidation() {
		const { username, email, password, confirmPass } = info;
		if (password !== confirmPass) {
			toast.error("Password and Confirm password should be same", toastOption);
			return false;
		} else if (username.length < 3) {
			toast.error("Username should be greater than 3", toastOption);
			return false;
		} else if (password.length < 8) {
			toast.error("Password should be greater than 8", toastOption);
			return false;
		} else if (email.length === 0) {
			toast.error("Email is required", toastOption);
			return false;
		}
		return true;
	}
	function handleChange(e) {
		setinfo({ ...info, [e.target.name]: e.target.value });
	}

	return (
		<Layout>
			<div className="auth">
				<div className="auth_left">
					<div className="auth_featureText">
						<h1 className="auth_title">
							Welcome to <span>Family</span>
						</h1>
						<p className="auth_subtitle">
							A few click away for creating your account with Branch
							International
						</p>
					</div>
					<div className="auth_buttons">
						<input
							type={"text"}
							onChange={handleChange}
							className="auth_input"
							name="username"
							placeholder="Username"
						/>
						<input
							type={"text"}
							onChange={handleChange}
							className="auth_input"
							name="email"
							placeholder="Email"
						/>
						<input
							type={"password"}
							onChange={handleChange}
							className="auth_input"
							placeholder="Password"
							name="password"
						/>
						<input
							type={"password"}
							onChange={handleChange}
							className="auth_input"
							placeholder="Confirm Password"
							name="confirmPass"
						/>
						<RadioGroup
							row
							name="row-radio-buttons-group"
							defaultValue={true}
							onChange={handleChange}
							name="admin"
						>
							<FormControlLabel
								value={true}
								control={<Radio />}
								style={{ color: "white" }}
								label="Admin"
							/>
							<FormControlLabel
								value={false}
								control={<Radio />}
								label="Customer"
							/>
						</RadioGroup>
						<Button
							color="primary"
							variant="contained"
							className="mui_btn"
							onClick={handleSubmit}
						>
							<LockIcon />
							<p>Sign Up</p>
						</Button>
					</div>
					<Divider
						style={{
							background: "rgba(255,255,255,0.1)",
							marginBottom: "50px",
						}}
					/>
					<div style={{ color: "white" }}>
						Already have an Account
						<Link to={"/signin"} className="auth_createaccount">
							Sign In
						</Link>
					</div>
				</div>

				<div className="auth_right">
					<img
						className="auth_image"
						src="https://www.hrkatha.com/wp-content/uploads/2021/08/Branch.png"
						alt="Feature IMG"
					/>
				</div>
			</div>
		</Layout>
	);
};

export default SignUp;
