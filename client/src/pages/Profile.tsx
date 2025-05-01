import { Avatar, Badge } from "@mui/material";
import useAuth from "../hooks/useAuth";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { updateProfileImage } from "../services/authService";
import { Loader } from "../components/Loaders";
import { FaCamera } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function Profile() {
    const { currentUser, updateUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { t, i18n } = useTranslation();

    const submitImage = (file: File) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('image', file);
        updateProfileImage(formData)
            .then(res => {
                updateUser(res.data.user);
                toast.success(res.data.message);
            })
            .catch(err => toast.error(err.response.data))
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const image = e.target.files?.[0];
        if (image) {
            submitImage(image);
        }
    };

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    };

    if (isLoading)
        return (<Loader />);

    return (
        <main className="container mt-3">
            <div className="row justify-content-center">
                <div className="col-auto text-center">
                    <Badge
                        className="mb-3"
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                            <button
                                className="border-2 border-light rounded-circle"
                                style={{ width: 40, height: 40 }}
                                onClick={() => { fileInputRef.current?.click() }}
                            >
                                <FaCamera style={{ width: 15, height: 15 }} />
                            </button>
                        }
                    >
                        <Avatar style={{ height: 200, width: 200 }} alt="Profile image" src={currentUser!.image?.url || undefined}>
                            {!currentUser!.image?.url && currentUser!.username?.[0]}
                        </Avatar>
                    </Badge>
                    <input
                        style={{ display: "none" }}
                        accept="image/*"
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange} />
                </div>
            </div>
            <div className="card">
                <ul className="list-group list-group-flush p-0">
                    <li className="list-group-item bg-dark-subtle"><b>{t('username')}:</b> {currentUser?.username}</li>
                    <li className="list-group-item bg-dark-subtle"><b>{t('email')}:</b> {currentUser?.email}</li>
                    <li className="list-group-item bg-dark-subtle"><b>{t('language')}:</b>
                        <button className={`btn ${i18n.language === 'en' && 'fw-semibold'}`} onClick={() => changeLanguage('en')}>
                            <img src="https://flagcdn.com/us.svg" alt="English" width="24" height="16" /> {t('english')}
                        </button>
                        <button className={`btn ${i18n.language === 'he' && 'fw-semibold'}`} onClick={() => changeLanguage('he')}>
                            <img src="https://flagcdn.com/il.svg" alt="Hebrew" width="24" height="16" /> {t('hebrew')}
                        </button>
                    </li>
                </ul>
            </div>

        </main>
    )
};

export default Profile