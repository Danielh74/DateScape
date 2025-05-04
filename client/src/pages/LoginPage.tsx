import { useForm } from "react-hook-form";
import { loginUser } from "../services/authService";
import useAuth from "../hooks/useAuth";
import { User } from "../models/User";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import ThirdPartyAuth from "../components/ThirdPartyAuth";

type LoginForm = {
    username: string,
    password: string
}

const LoginPage = () => {
    const { handleLogin } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, setError } = useForm({
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
                    displayName: userData.displayName,
                    email: userData.email,
                    favLocations: userData.favLocations,
                    avatar: userData.image
                };
                toast.success(res.data.message);
                handleLogin(user);
                navigate('/locations');
            }).catch(err => {
                if (err.status === 400) {
                    toast.error(err.response.data);
                } else if (err.status === 401) {
                    setError('root', { message: "User does not exist" })
                } else {
                    toast.error(err.message);
                }
            }).finally(() => {
                setIsLoading(false);
            });
    }

    return (
        <div className="container justify-content-center align-items-center mt-5">
            <div className="row justify-content-center">
                <main className="col-md-6 col-xl-4">
                    <div className="card shadow ">
                        <div className="card-body">
                            <h5 className="card-title fs-3 text-center">{t('log_in')}</h5>
                            <form onSubmit={handleSubmit(onSubmit)} className="needs-validation" noValidate>
                                <div className="mb-2">
                                    <label className="form-label" htmlFor="username">{t('username')}</label>
                                    <input className={`form-control ${errors.password && 'border-danger'}`} type="text" {...register('username', { required: 'Username is required' })} id="username" autoFocus
                                    />
                                    {errors.username && <small className="text-danger"> {errors.username.message}</small>}

                                </div>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="password">{t('password')}</label>
                                    <input className={`form-control ${errors.password && 'border-danger'}`} type="password" {...register('password', { required: 'Password is required' })} id="password" />
                                    {errors.password && <small className="text-danger"> {errors.password.message}</small>}
                                </div>

                                <button className="btn btn-success rounded-5 w-100" disabled={isLoading}>{isLoading ? t('logging_in') + '...' : t('button.login')}</button>

                                {errors.root && <p className="text-center text-danger mb-0 mt-2"> {errors.root.message}</p>}

                                <ThirdPartyAuth />
                            </form>
                        </div>
                    </div>
                </main>

            </div>
        </div>
    )
}

export default LoginPage