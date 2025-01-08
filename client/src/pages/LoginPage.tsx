import { useForm } from "react-hook-form";
import { loginUser } from "../services/authService";
import useAuth from "../hooks/useAuth";
import { User } from "../models/User";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from 'react-toastify';

type LoginForm = {
    username: string,
    password: string
}

const LoginPage = () => {
    const { handleLogin } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            username: "",
            password: ""
        }
    });

    const onSubmit = (loginData: LoginForm) => {
        setIsLoading(true);
        loginUser(loginData)
            .then(res => {
                const userData = res.data.user;
                const user: User = {
                    _id: userData._id,
                    username: userData.username,
                    email: userData.email
                };
                toast.success(res.data.message);
                handleLogin(user);
                navigate('/locations');
            }).catch(err => {
                if (err.status === 400) {
                    toast.error(err.response.data);
                } else {
                    toast.error(err.message);
                }
            }).finally(() => {
                setIsLoading(false);
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
                                    <input className={`form-control ${errors.password && 'border-danger'}`} type="text" {...register('username', { required: 'Username is required' })} id="username" autoFocus
                                    />
                                    {errors.username && <small className="text-danger"> {errors.username.message}</small>}

                                </div>
                                <div className="mb-2">
                                    <label className="form-label" htmlFor="password">Password</label>
                                    <input className={`form-control ${errors.password && 'border-danger'}`} type="password" {...register('password', { required: 'Password is required' })} id="password" />
                                    {errors.password && <small className="text-danger"> {errors.password.message}</small>}
                                </div>
                                <div className="d-grid">
                                    <button className="btn btn-success" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Log in'}</button>
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