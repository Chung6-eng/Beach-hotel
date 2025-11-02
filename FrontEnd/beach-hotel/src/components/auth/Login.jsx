import React, { useState } from "react";
import { loginUser } from "../utils/ApiFunctions";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

const Login = () => {
	const [errorMessage, setErrorMessage] = useState("");
	const [login, setLogin] = useState({
		email: "",
		password: ""
	});

	const navigate = useNavigate();
	const auth = useAuth();
	const location = useLocation();
	const redirectUrl = location.state?.path || "/";

	const handleInputChange = (e) => {
		setLogin({ ...login, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📌 Dữ liệu gửi lên BE:", login);

    try {
        const result = await loginUser(login);
        console.log("📌 Kết quả trả về từ BE:", result);

        if (result && result.token) {
            // ✅ Lưu token đúng lúc đúng key
            localStorage.setItem("token", result.token);

            // ✅ Cập nhật auth state
            auth.handleLogin(result.token);

            // ✅ Điều hướng về trang trước đó hoặc "/"
            navigate(redirectUrl, { replace: true });
        } else {
            setErrorMessage("Invalid username or password. Please try again.");
        }
    } catch (error) {
        console.error(error);
        setErrorMessage("Login failed. Please try again.");
    }

    setTimeout(() => {
        setErrorMessage("");
    }, 4000);
};

	return (
		<section className="container col-3 mt-5 mb-5">
			{errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<div className="row mb-3">
					<label htmlFor="email" className="col-sm-12 col-form-label text-start">
						Email
					</label>
					<div>
						<input
							id="email"
							name="email"
							type="email"
							className="form-control"
							value={login.email}
							onChange={handleInputChange}
							required
						/>
					</div>
				</div>

				<div className="row mb-3">
					<label htmlFor="password" className="col-sm-12 col-form-label text-start">
						Password
					</label>
					<div>
						<input
							id="password"
							name="password"
							type="password"
							className="form-control"
							value={login.password}
							onChange={handleInputChange}
							required
						/>
					</div>
				</div>

				<div className="mb-3">
					<button type="submit" className="btn btn-hotel" style={{ marginRight: "10px" }}>
						Login
					</button>
					<span style={{ marginLeft: "10px" }}>
						Don't have an account yet? <Link to={"/register"}>Register</Link>
					</span>
				</div>
			</form>
		</section>
	);
};

export default Login;
