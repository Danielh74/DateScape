import { useForm } from "react-hook-form"
import { registerUser } from "../services/authService";
import { useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useTranslation } from "react-i18next";
import ThirdPartyAuth from "../components/ThirdPartyAuth";


type RegisterForm = {
    username: string,
    email: string,
    password: string
}

const RegisterPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { handleLogin } = useAuth()
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    });

    const onSubmit = (registerData: RegisterForm) => {
        setIsLoading(true);
        registerUser(registerData)
            .then(res => {
                toast.success(res.data.message);
                handleLogin(res.data.user);
                navigate('/login');
            }).catch(err => {
                if (err.status === 400) {
                    toast.error(err.response.data);
                } else {
                    toast.error(err.message);
                }
            }).finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <main className="col-md-6 col-xl-4">
                    <div className="card shadow">
                        <div className="card-body">
                            <h5 className="card-title fs-3 text-center">{t('create_account')}</h5>
                            <form onSubmit={handleSubmit(onSubmit)} className="needs-validation" noValidate>
                                <div className="mb-2">
                                    <label className="form-label" htmlFor="username">{t('username')}</label>
                                    <input className={`form-control ${errors.username && 'border-danger'}`} type="text" {...register('username', { required: 'Username is required' })} id="username" autoFocus />
                                    {errors.username && <small className="text-danger"> {errors.username.message}</small>}
                                </div>
                                <div className="mb-2">
                                    <label className="form-label" htmlFor="email">{t('email')}</label>
                                    <input className={`form-control ${errors.email && 'border-danger'}`} type="email" {...register('email', { required: 'Email is required' })} id="email" />
                                    {errors.email && <small className="text-danger"> {errors.email.message}</small>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="password">{t('password')}</label>
                                    <input className={`form-control ${errors.password && 'border-danger'}`} type="password" {...register('password', { required: 'Password is required' })} id="password" />
                                    {errors.password && <small className="text-danger"> {errors.password.message}</small>}
                                </div>
                                <div className="d-grid">
                                    <button className="btn btn-dark rounded-3" disabled={isLoading}>{isLoading ? t('loading') + '...' : t('button.signup')}</button>
                                </div>
                            </form>

                            <ThirdPartyAuth />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default RegisterPage