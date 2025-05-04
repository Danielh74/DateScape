import { t } from "i18next";
import { FcGoogle } from "react-icons/fc";


const googleLogin = () => {
    const backendURI = import.meta.env.VITE_BACKEND_URI || 'http://localhost:8080/api';
    window.open(`${backendURI}/google`, "_self");
}

const ThirdPartyAuth = () => {
    return (
        <>
            <div className="position-relative my-4">
                <div className="border-top position-absolute top-50 start-0 w-100 translate-middle-y"></div>
                <div className="position-relative text-center">
                    <span className="bg-white px-2 text-uppercase text-muted small">{t('choose_auth')}</span>
                </div>
            </div>
            <div className="row">
                <button
                    className="btn fs-1 p-0 d-flex align-items-center justify-content-center"
                    onClick={googleLogin}
                >
                    <FcGoogle />
                </button>
            </div>
        </>
    )
}

export default ThirdPartyAuth