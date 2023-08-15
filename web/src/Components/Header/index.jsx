import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./style.css";
import MenuIcon from "@mui/icons-material/Menu";

const Header = (props) => {
	const [openMobileNavigation, setOpenMobileNavigation] = useState(false);
	const [currentUser,setCurrentUser] = useState(undefined)
	async function checkCurrentUser() {
		const user = localStorage.getItem("branchInternational");
		const parsedUser = await JSON.parse(user); 
		setCurrentUser(parsedUser);
	}
	useEffect(()=>{
		checkCurrentUser();
	},[localStorage.getItem("branchInternational")])
	return (
		<>
			<nav className={`${openMobileNavigation ? "nav_open_mobile" : ""}`}>
				<div className="logo">
					Branch <span>International</span>
				</div>
				<label
					onClick={() => setOpenMobileNavigation(!openMobileNavigation)}
					className={`menu_btn`}
				>
					<MenuIcon />
				</label>
				<ul onClick={() => setOpenMobileNavigation(!openMobileNavigation)}>
					<li>
						<NavLink exact to="/resolvequeries" className="header_iconbox">
							{currentUser && (currentUser.admin?"To Resolve":"Resolved")}
						</NavLink>
					</li>
					<li>
						<NavLink exact to="/allqueries" className="header_iconbox">
							{currentUser && (currentUser.admin?"All Queries":"My Queries")}
						</NavLink>
					</li>
					<li>
						<NavLink exact to="/signin" className="header_iconbox">
							SignIn
						</NavLink>
					</li>
					<li>
						<NavLink exact to="/signup" className="header_iconbox">
							SignUp
						</NavLink>
					</li>
					{localStorage.getItem("branchInternational") && (
						<li onClick={()=>localStorage.removeItem("branchInternational")}>
							<Link exact to="/signin" className="header_iconbox">
								Logout
							</Link>
						</li>
					)}
				</ul>
			</nav>
			{props.children}
		</>
	);
};

export default Header;
