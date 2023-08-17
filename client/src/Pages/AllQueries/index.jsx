import React, { useEffect, useState, useRef } from "react";
import "./style.css";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
	addQuery,
	getQueries,
	getQuerySlot,
	host,
	searchQueries,
} from "../../utils/APIRoute";
import { Layout } from "../../Components";
import { toast } from "react-toastify";
import axios from "axios";
import { io } from "socket.io-client";
import moment from "moment";
import MessageIcon from "@mui/icons-material/Message";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { promiseToaster, toastOption } from "../../Constants/constants";

const AllQueries = () => {
	const socket = useRef();
	const navigate = useNavigate();
	const [currentuser, setCurrentuser] = useState(undefined);
	const [query, setQuery] = useState("");
	const [allQuery, setAllQueries] = useState([]);
	function handleAddMessage() {
		const dataPromise = new Promise(function (resolve, reject) {
			axios
				.post(addQuery, {
					message: query,
					userId: currentuser.username,
				})
				.then((res) => {
					if (res.data.status === false) {
						reject(new Error(res.data.msg));
					} else {
						socket.current.emit("message", {
							userId: currentuser.username,
							message: query,
						});
						resolve("Added Query");
					}
				})
				.catch((err) => {
					reject(new Error("Something went wrong ?"));
				});
		});

		toast.promise(dataPromise, promiseToaster, toastOption);
	}
	async function checkCurrentUser() {
		const user = localStorage.getItem("branchInternational");
		const parsedUser = await JSON.parse(user);
		setCurrentuser(parsedUser);
		var userId = parsedUser.username;
		if (parsedUser.admin) {
			userId = "";
		}
		const dataPromise = new Promise(function (resolve, reject) {
			axios
				.post(getQueries, { userId: userId })
				.then((res) => {
					if (res.data.status === false) {
						reject(new Error(res.data.msg));
					} else {
						setAllQueries(res.data.data);
						resolve("Queries Fetched");
					}
				})
				.catch((err) => {
					reject(new Error("Something went wrong ?"));
				});
		});

		toast.promise(dataPromise, promiseToaster, toastOption);
	}
	function handleSearch() {
		const dataPromise = new Promise(function (resolve, reject) {
			axios
				.post(searchQueries, { searchKeyword: query })
				.then((res) => {
					if (res.data.status === false) {
						reject(new Error(res.data.msg));
					} else {
						setAllQueries(res.data.data);
						resolve("Completed Search");
					}
				})
				.catch((err) => {
					reject(new Error("Something went wrong ?"));
				});
		});
		toast.promise(dataPromise, promiseToaster, toastOption);
	}
	function handleAdminSlot() {
		const ids = allQuery.slice(0, 5).map((doc) => {
			return doc._id;
		});
		const dataPromise = new Promise(function (resolve, reject) {
			axios
				.post(getQuerySlot, { userId: currentuser.username, ids })
				.then((res) => {
					if (res.data.status === false) {
						reject(new Error(res.data.msg));
					} else {
						navigate("/resolvequeries");
						resolve("Added to your slot");
					}
				})
				.catch((err) => {
					reject(new Error("Something went wrong ?"));
				});
		});
		toast.promise(dataPromise, promiseToaster, toastOption);
	}
	useEffect(() => {
		checkCurrentUser();
		socket.current = io(host);
		if (socket.current) {
			socket.current.on("message", (msg) => {
				setAllQueries((prev) => [
					...prev,
					{ message: msg.message, userId: msg.userId, time: Date.now() },
				]);
			});
		}
	}, []);

	return (
		<Layout>
			<div className="queries_main">
				<div className="queries_box">
					{currentuser && !currentuser.admin && (
						<div className="queries_ask">
							<input
								type={"text"}
								onChange={(e) => setQuery(e.target.value)}
								className="queries_ask_input"
								placeholder="Add Query"
							/>

							<Button
								color="primary"
								variant="contained"
								className="mui_btn "
								onClick={() => handleAddMessage()}
							>
								<AddCircleIcon />
								<p>Add Query</p>
							</Button>
						</div>
					)}
					{currentuser && currentuser.admin && (
						<div className="queries_admin">
							<input
								type={"text"}
								onChange={(e) => setQuery(e.target.value)}
								className="queries_ask_input"
								placeholder="Search Query"
							/>

							<Button
								color="primary"
								variant="contained"
								className="mui_btn"
								onClick={() => handleSearch()}
							>
								<SearchIcon />
								<p>Search</p>
							</Button>
							<Button
								color="primary"
								variant="contained"
								className="mui_btn queries_getslot"
								onClick={() => handleAdminSlot()}
							>
								<MessageIcon />
								<p>Get Slot</p>
							</Button>
						</div>
					)}

					<div className="queries_all">
						{allQuery.map((val, idx) => (
							<div className="query_main">
								<div className="query_info">
									<div className="query_mess">Message : {val.message}</div>
									<div className="query_details">
										<div>User Id : {val.userId}</div>
										<div style={{ color: "#bf0000", fontWeight: "900" }}>
											{moment(val.time).format("h:mm a, MMMM Do YYYY")}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default AllQueries;
