import { Avatar, Badge } from "@mui/material";
import useAuth from "../hooks/useAuth";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { updateProfileImage } from "../services/authService";
import { Loader } from "../components/Loaders";
import { FaCamera } from "react-icons/fa";

function Profile() {
    const { currentUser, updateUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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
            <div className="row bg-dark-subtle rounded-2 p-2">
                <span><b>Username:</b> {currentUser?.username}</span>
                <span><b>Email:</b> {currentUser?.email}</span>
            </div>


        </main>
    )
};

export default Profile