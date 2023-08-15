import React, { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SendIcon from "@mui/icons-material/Send";
import {
	addQuery,
	adminQueries,
	customerQueries,
	getQueries,
	host,
	resolveQuery,
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

const ResolveQueries = () => {
	const socket = useRef();
	const [allQuery, setAllQueries] = useState([]);
	const [currentSelected, setCurrentSelected] = useState("");
	const [currentUser, setCurrentUser] = useState(undefined);
	async function getQueries() {
		const user = localStorage.getItem("branchInternational");
		const parsedUser = await JSON.parse(user);
		setCurrentUser(parsedUser);
		var dataPromise;
		if (parsedUser.admin) {
			dataPromise = new Promise(function (resolve, reject) {
				axios
					.post(adminQueries, { userId: parsedUser.username })
					.then((res) => {
						if (res.data.status === false) {
							reject(new Error(res.data.msg));
						} else {
							setAllQueries(res.data.data);
							resolve("Query Fetched");
						}
					})
					.catch((err) => {
						reject(new Error("Something went wrong ?"));
					});
			});
		} else {
			dataPromise = new Promise(function (resolve, reject) {
				axios
					.post(customerQueries, { userId: parsedUser.username })
					.then((res) => {
						if (res.data.status === false) {
							reject(new Error(res.data.msg));
						} else {
							setAllQueries(res.data.data);
							resolve("Query Fetched");
						}
					})
					.catch((err) => {
						reject(new Error("Something went wrong ?"));
					});
			});
		}

		toast.promise(dataPromise, promiseToaster, toastOption);
	}
	
	function handleResolve() {
		const solution = document.getElementsByClassName(`${currentSelected}`)[0]
			.value;
		const dataPromise = new Promise(function (resolve, reject) {
			axios
				.post(resolveQuery, { queryId: currentSelected, solution })
				.then((res) => {
					if (res.data.status === false) {
						reject(new Error(res.data.msg));
					} else {
						socket.current.emit("resolve", {
							queryId: currentSelected,
							solution: solution,
						});
						resolve("Query resolved");
					}
				})
				.catch((err) => {
					reject(new Error("Something went wrong ?"));
				});
		});

		toast.promise(dataPromise, promiseToaster, toastOption);
	}
	function updateQueries(queries, msg) {
		const objIndex = queries.findIndex((val) => val._id === msg.queryId);
		const updatedQueries = [...queries];
		updatedQueries[objIndex].resolved = msg.solution;
		return updatedQueries;

	}
	function filterQueries(queries,msg) {
		const result = queries.filter((query) => query._id !== msg.queryId);
		return result;
	}
	async function handleSocket() {
		socket.current = io(host);
		const user = localStorage.getItem("branchInternational");
		const parsedUser = await JSON.parse(user);
		if(parsedUser.admin){
			socket.current.on("resolve", (msg) => {
				setAllQueries((prev) => [...filterQueries(prev,msg)]);
			});
		}
		else{
			socket.current.on("resolve", (msg) => {
				setAllQueries((prev) => [...updateQueries(prev, msg)]);
			});
		}
	}
	useEffect(() => {
		getQueries();
		handleSocket();
	}, []);
	return (
		<Layout>
			<div className="queries_main">
				<div className="queries_box">
					<div className="queries_all queries_resolve_section">
						{allQuery.map((val, idx) => (
							<div
								className={`query_main ${
									val.resolved !== "" ? "query_main_resolved" : ""
								}`}
							>
								{currentUser.admin && (
									<button onClick={() => setCurrentSelected(val._id)}>
										Resolve
									</button>
								)}
								<div className="query_info">
									<div className="query_mess">Message : {val.message}</div>
									<div className="query_details">
										{" "}
										<div>User Id : {val.userId}</div>
										<div style={{ color: "#bf0000", fontWeight: "900" }}>
											{moment(val.time).format("h:mm a, MMMM Do YYYY")}
										</div>
									</div>
									<div
										className={`query_resolve ${
											(currentUser.admin && currentSelected === val._id) ||
											val.resolved !== ""
												? "query_resolve_vis"
												: ""
										}`}
									>
										{currentUser.admin ? (
											<>
												<input
													type={"text"}
													placeholder="Enter Solution"
													className={`query_resolve_input ${val._id}`}
												/>
												<button onClick={() => handleResolve()}>
													<SendIcon />
												</button>
											</>
										) : (
											<>
												<div className="resolved_solution">
													Solution :{val.resolved}
												</div>
											</>
										)}
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

export default ResolveQueries;
