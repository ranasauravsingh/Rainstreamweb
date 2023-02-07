import { React, useEffect, useState } from "react";

import { Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const StudentTable = () => {
	// ---------------------Student Form Controllers------------------
	let obj = {
		studentName: "",
		email: "",
		mobile: "",
		gender: "",
		hobbie: [],
	};

	// ---------------------Initial States---------------------------
	let [formData, setFormData] = useState([]);
	let [searchData, setSearchData] = useState([]);
	let [inputs, setInputs] = useState(obj);
	const [errors, setErrors] = useState({});
	const [updatedId, setUpdatedId] = useState(-1);
	const [searchInput, setSearchInput] = useState("");
	const [show, setShow] = useState(false);
	const [flag, setFlag] = useState(false);

	// ---------------------Handling Functions-----------------------
	const handleClose = () => {
		setShow(false);
		setInputs(obj);
		setErrors({});
	};
	const handleShow = () => setShow(true);

	const handleCheckbox = (event) => {
		const name = event.target.name;
		const value = event.target.value;

		let dummy = inputs.hobbie;
		dummy.push(value);
		setInputs((ccc) => ({ ...ccc, [name]: dummy }));
		// console.log(inputs.hobbie);
		if (!name.length) {
			setErrors((ccc) => ({
				...ccc,
				hobbie: "Plz Select at least one Hobbie.",
			}));
		} else {
			setErrors((ccc) => ({ ...ccc, [name]: "" }));
		}
	};

	const handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		const id = event.target.id;
		const lengthMin = event.target.minLength;

		setInputs((ccc) => ({ ...ccc, [name]: value }));

		if (value === "") {
			setErrors((ccc) => ({ ...ccc, [name]: `Plz Insert ${id} First.` }));
		} else if (value.length < lengthMin) {
			setErrors((ccc) => ({
				...ccc,
				[name]: `${id} must be at least ${lengthMin} chars long`,
			}));
		} else {
			setErrors((ccc) => ({ ...ccc, [name]: "" }));
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (inputs.studentName === "" || inputs.studentName.length <= "10") {
			setErrors((ccc) => ({
				...ccc,
				studentName: "student name must be at least 10 chars long.",
			}));
		} else if (inputs.email === "") {
			setErrors((ccc) => ({ ...ccc, email: "Plz Insert Email First." }));
		} else if (inputs.mobile === "" || inputs.mobile.length !== 10) {
			setErrors((ccc) => ({
				...ccc,
				mobile: "mobile no. must be 10 chars long.",
			}));
		} else if (inputs.gender === "") {
			setErrors((ccc) => ({ ...ccc, gender: "Plz Select Gender." }));
		} else if (inputs.hobbie.length === 0) {
			setErrors((ccc) => ({
				...ccc,
				hobbie: "Plz Select at least one Hobbie.",
			}));
		} else {
			if (updatedId !== -1) {
				let dData = formData.slice();
				// console.log(dData[updatedId]);
				dData[updatedId] = inputs;
				setFormData(dData);
				alert("Student Data updated successfully");
			} else {
				setFormData((ccc) => [...ccc, inputs]);
				alert("Student Data inserted successfully");
			}

			handleClose();
			setErrors({});
			setInputs(obj);
		}
	};

	const handleUpdate = (item) => {
		// console.log(formData[item].hobbie);
		handleShow();
		setInputs(formData[item]);
		setInputs((ccc) => ({ ...ccc, [inputs.hobbie]: formData[item].hobbie }));

		setUpdatedId(item);
	};

	const handleDelete = (item) => {
		if (window.confirm("Are you sure you want to delete the student data?")) {
			let dData = formData.slice();
			dData.splice(item, 1);
			setFormData(dData);
			alert("Student Data deleted successfully");
		}
	};

	// -------------------------Handling Search---------------------------
	const handleSearch = (event) => {
		setSearchInput(event.target.value);
	};
	useEffect(() => {
		if (searchInput.length > 0) {
			let dData = formData.filter((item) => {
				return item.studentName.match(searchInput);
			});

			setSearchData(dData);
			setFlag(true);
			// console.log(dData);
		}
		// eslint-disable-next-line
	}, [searchInput]);

	return (
		<>
			{/* Student List */}
			<h3>Student List</h3>
			<input
				type="text"
				placeholder="Search here"
				onChange={(e) => {
					handleSearch(e);
				}}
				value={searchInput}
			/>
			<div className="container d-flex justify-content-center mt-3">
				<Table variant="primary" striped bordered>
					<thead>
						<tr>
							<td>Sr No.</td>
							<td>Student Name</td>
							<td>Student Email</td>
							<td>Mobile No.</td>
							<td>Gender</td>
							<td>Hobbies</td>
							<td colSpan={2}>Action</td>
						</tr>
					</thead>
					<tbody>
						{formData &&
							formData.map((ind, i) => {
								return (
									<tr key={i}>
										<td>{i + 1}</td>
										<td>{ind.studentName}</td>
										<td>{ind.mobile}</td>
										<td>{ind.email}</td>
										<td>{ind.gender}</td>
										<td>
											<Table>
												<tbody>
													{ind.hobbie &&
														ind.hobbie.map((hobby, j) => {
															return (
																<tr key={j}>
																	<td>{hobby}</td>
																</tr>
															);
														})}
												</tbody>
											</Table>
										</td>

										<td>
											<button
												type="button"
												className="btn btn-secondary"
												onClick={() => handleUpdate(i)}
											>
												Update
											</button>
										</td>
										<td>
											<button
												type="button"
												className="btn btn-secondary"
												onClick={() => handleDelete(i)}
											>
												Delete
											</button>
										</td>
									</tr>
								);
							})}
					</tbody>
				</Table>
			</div>

			{/* Student Input Form */}
			<div className="container">
				<Button variant="primary" onClick={handleShow}>
					Add Student
				</Button>

				<Modal
					show={show}
					onHide={handleClose}
					backdrop="static"
					keyboard={false}
				>
					<Modal.Header closeButton>
						<Modal.Title>Add Student</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="modal-body">
							<div className="row">
								<div className="col mb-3">
									<label htmlFor="studentName" className="form-label">
										Student Name
									</label>
									<span style={{ float: "right", color: "red" }}>
										{errors.studentName}
									</span>
									<input
										type="text"
										id="studentName"
										name="studentName"
										className="form-control"
										placeholder="Enter Student Name"
										minLength="10"
										value={inputs.studentName || ""}
										onChange={(e) => {
											handleChange(e);
										}}
									/>
								</div>
							</div>
							<div className="row">
								<div className="col mb-3">
									<label htmlFor="email" className="form-label">
										Student Email
									</label>
									<span style={{ float: "right", color: "red" }}>
										{errors.email}
									</span>
									<input
										type="email"
										id="email"
										name="email"
										className="form-control"
										placeholder="Enter Student Email"
										value={inputs.email || ""}
										onChange={(e) => {
											handleChange(e);
										}}
									/>
								</div>
							</div>
							<div className="row">
								<div className="col mb-3">
									<label htmlFor="mobile" className="form-label">
										Mobile No.
									</label>
									<span style={{ float: "right", color: "red" }}>
										{errors.mobile}
									</span>
									<input
										type="text"
										id="mobile"
										name="mobile"
										className="form-control"
										placeholder="Enter Mobile No."
										minLength="10"
										value={inputs.mobile || ""}
										onChange={(e) => {
											handleChange(e);
										}}
									/>
								</div>
							</div>
							<div className="row">
								<div className="col mb-3">
									<label htmlFor="gender" className="form-label">
										Gender
									</label>
									<span style={{ float: "right", color: "red" }}>
										{errors.gender}
									</span>

									<div className="form-check">
										<input
											className="form-check-input"
											type="radio"
											name="gender"
											value="Male"
											id="Male"
											onChange={(e) => {
												handleChange(e);
											}}
										/>
										<label className="form-check-label" htmlFor="Male">
											Male
										</label>
									</div>
									<div className="form-check">
										<input
											className="form-check-input"
											type="radio"
											name="gender"
											value="Female"
											id="Female"
											onChange={(e) => {
												handleChange(e);
											}}
										/>
										<label className="form-check-label" htmlFor="Female">
											Female
										</label>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col mb-3">
									<label htmlFor="hobbies" className="form-label">
										Hobbies
									</label>
									<span style={{ float: "right", color: "red" }}>
										{errors.hobbie}
									</span>
									<div className="form-check">
										<input
											className="form-check-input"
											type="checkbox"
											name="hobbie"
											value="Playing Games"
											onChange={(e) => {
												handleCheckbox(e);
											}}
										/>
										<label className="form-check-label" htmlFor="Playing Games">
											Playing Games
										</label>
									</div>
									<div className="form-check">
										<input
											className="form-check-input"
											type="checkbox"
											name="hobbie"
											value="Reading Book"
											onChange={(e) => {
												handleCheckbox(e);
											}}
										/>
										<label className="form-check-label" htmlFor="Reading Book">
											Reading Book
										</label>
									</div>
									<div className="form-check">
										<input
											className="form-check-input"
											type="checkbox"
											name="hobbie"
											value="Travelling"
											onChange={(e) => {
												handleCheckbox(e);
											}}
										/>
										<label className="form-check-label" htmlFor="Travelling">
											Travelling
										</label>
									</div>
									<div className="form-check">
										<input
											className="form-check-input"
											type="checkbox"
											name="hobbie"
											value="Cooking"
											onChange={(e) => {
												handleCheckbox(e);
											}}
										/>
										<label className="form-check-label" htmlFor="Cooking">
											Cooking
										</label>
									</div>
								</div>
							</div>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="secondary"
							onClick={() => {
								handleClose();
							}}
						>
							Close
						</Button>
						<Button
							variant="primary"
							onClick={(e) => {
								handleSubmit(e);
							}}
						>
							Submit
						</Button>
					</Modal.Footer>
				</Modal>
			</div>

			{/* Search List */}
			{flag === true ? (
				<div className="container mt-3">
					<h6>Search List</h6>
					<Table variant="primary" striped bordered>
						<thead>
							<tr>
								<td>Sr No.</td>
								<td>Student Name</td>
								<td>Student Email</td>
								<td>Mobile No.</td>
								<td>Gender</td>
								<td>Hobbies</td>
							</tr>
						</thead>
						<tbody>
							{searchData &&
								searchData.map((ind, i) => {
									return (
										<tr key={i}>
											<td>{i + 1}</td>
											<td>{ind.studentName}</td>
											<td>{ind.mobile}</td>
											<td>{ind.email}</td>
											<td>{ind.gender}</td>
											<td>
												<Table>
													<tbody>
														{ind.hobbie &&
															ind.hobbie.map((hobby, j) => {
																return (
																	<tr key={j}>
																		<td>{hobby}</td>
																	</tr>
																);
															})}
													</tbody>
												</Table>
											</td>
										</tr>
									);
								})}
						</tbody>
					</Table>
				</div>
			) : (
				""
			)}
		</>
	);
};

export default StudentTable;
