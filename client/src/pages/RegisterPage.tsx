import { useForm } from "react-hook-form"
import { registerUser } from "../services/authService";

type RegisterForm = {
    username: string,
    email: string,
    password: string
}

const RegisterPage = () => {

    const { register, handleSubmit } = useForm({
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    });

    const onSubmit = (registerData: RegisterForm) => {
        registerUser(registerData).then(res => {
            console.log(res.status)
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
                            <h5 className="card-title">Register</h5>
                            <form onSubmit={handleSubmit(onSubmit)} className="needs-validation" noValidate>
                                <div className="mb-2">
                                    <label className="form-label" htmlFor="username">Username</label>
                                    <input className="form-control" type="text" {...register('username', { required: true })} id="username" autoFocus
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label" htmlFor="email">Email</label>
                                    <input className="form-control" type="email" {...register('email', { required: true })} id="email" />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label" htmlFor="password">Password</label>
                                    <input className="form-control" type="password" {...register('password', { required: true })} id="password" />
                                </div>
                                <div className="d-grid">
                                    <button className="btn btn-success">Sign Up</button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage