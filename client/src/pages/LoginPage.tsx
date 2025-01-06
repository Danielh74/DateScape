import { useForm } from "react-hook-form";
import { loginUser } from "../services/authService";
import useAuth from "../hooks/useAuth";
import { User } from "../models/User";
import { useNavigate } from "react-router-dom";

type LoginForm = {
    username: string,
    password: string
}

const LoginPage = () => {
    const { handleLogin } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm({
        defaultValues: {
            username: "",
            password: ""
        }
    });

    const onSubmit = (loginData: LoginForm) => {
        loginUser(loginData)
            .then(res => {
                const userData = res.data;
                const user: User = {
                    _id: userData._id,
                    username: userData.username,
                    email: userData.email
                };
                handleLogin(user);
                navigate('/campgrounds');
            }).catch(e => {
                console.log(e)
            });
    }

    return (
        <div className="container justify-content-center align-items-center mt-5">
            <div className="row">
                <div className="col-md-6 offset-md-3 col-xl-4 offset-xl-4">
                    <div className="card shadow ">
                        <div className="card-body ">
                            <h5 className="card-title">Login</h5>
                            <form onSubmit={handleSubmit(onSubmit)} className="needs-validation" noValidate>
                                <div className="mb-2">
                                    <label className="form-label" htmlFor="username">Username</label>
                                    <input className="form-control" type="text" {...register('username', { required: true })} id="username" autoFocus
                                    />
                                    <div className="invalid-feedback">
                                        Username is required.
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <label className="form-label" htmlFor="password">Password</label>
                                    <input className="form-control" type="password" {...register('password', { required: true })} id="password" />
                                    <div className="invalid-feedback">
                                        Password is required.
                                    </div>
                                </div>
                                <div className="d-grid">
                                    <button className="btn btn-success">Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage