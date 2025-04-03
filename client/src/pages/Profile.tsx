import { Avatar } from "@mui/material";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import { toast } from "react-toastify";
import { updateProfileImage } from "../services/authService";
import { Loader } from "../components/Loaders";

function Profile() {
    const { currentUser, updateUser } = useAuth();
    const [file, setFile] = useState<File>();
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const image = Array.from(e.target.files)[0];
            setFile(image);
        }
    };
    const onSubmit = () => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('image', file!);
        updateProfileImage(formData)
            .then(res => {
                updateUser(res.data.user);
                toast.success(res.data.message);
            })
            .catch(err => toast.error(err.response.data))
            .finally(() => { setIsLoading(false) });
    };

    if (isLoading)
        return (<Loader />);

    return (
        <main className="d-flex flex-column align-items-center mt-3">
            <button className="btn rounded-circle p-0">{
                <Avatar style={{ height: 200, width: 200 }} src={currentUser!.image?.url || undefined}>
                    {!currentUser!.image?.url && currentUser?.username?.[0]}
                </Avatar>
            }
            </button>
            <input className={`form-control`} type="file" name="images" onChange={handleFileChange} id="image" />
            <button onClick={onSubmit}>send</button>
        </main>
    )
};

export default Profile