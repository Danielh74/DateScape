import { Campground } from "../models/Campground";
import { useForm } from 'react-hook-form'
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { updateCampground } from "../services/campgroundService";

type CampForm = {
    title: string,
    location: string,
    price: number,
    description: string,
    deleteImages: string[]
}

type Props = {
    campground: Campground
    show: boolean,
    onClose: () => void,
    onUpdate: (campground: Campground) => void
}

const CampgroundEditModal = ({ campground, show, onClose, onUpdate }: Props) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<CampForm>({
        defaultValues: {
            title: campground.title,
            location: campground.location,
            price: campground.price,
            description: campground.description,
            deleteImages: []
        }
    });

    const onSubmit = (data: CampForm) => {
        setIsLoading(true);
        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });

        const campgroundData = {
            title: data.title,
            location: data.location,
            price: data.price,
            description: data.description,
        };
        formData.append('campground', JSON.stringify(campgroundData));

        data.deleteImages.forEach(img => formData.append('deleteImages[]', img));

        updateCampground(campground.id, formData).then(res => {
            onUpdate(res.data.campground);
            onClose();
        }).catch(err => {
            console.log(err);
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    return (
        <Modal
            show={show}
            onHide={onClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Edit Campground </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <form onSubmit={handleSubmit(onSubmit)} className="needs-validation" encType="multipart/form-data">
                        <div className="mb-2">
                            <label className="form-label" htmlFor="title">Title</label>
                            <input className={`form-control ${errors.title && 'border-danger'}`} type="text" {...register("title", { required: 'Title is required' })} id="title" />
                            {errors.title && <small className="text-danger"> {errors.title.message} </small>}
                        </div>
                        <div className="mb-2">
                            <label className="form-label" htmlFor="location">Location</label>
                            <input className={`form-control ${errors.location && 'border-danger'}`} type="text" {...register("location", { required: 'Location is required' })} id="location" />
                            {errors.location && <small className="text-danger"> {errors.location.message} </small>}
                        </div>
                        <div className=" mb-2">
                            <label htmlFor="price">Price</label>
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <input type="number" className={`form-control ${errors.price && 'border-danger'}`} id="price"
                                    {...register("price",
                                        {
                                            required: 'Price is required',
                                            min: {
                                                value: 0,
                                                message: 'Value cannot be less than zero'
                                            }
                                        })} />
                                {errors.price && <small className="text-danger"> {errors.price.message} </small>}
                            </div>
                        </div>
                        <div className="mb-2">
                            <label className="form-label" htmlFor="description">Description</label>
                            <textarea className={`form-control ${errors.description && 'border-danger'}`} id="description"
                                {...register('description', { required: 'Description is required' })}></textarea>
                            {errors.description && <small className="text-danger"> {errors.description?.message} </small>}
                        </div>
                        <div className="mb-2">
                            <label className="form-label" htmlFor="image">Add images</label>
                            <input className='form-control' type="file" name="images" onChange={handleFileChange} multiple id="image" />
                        </div>
                        <div className="row mt-3">
                            <button className="btn btn-success col-6 offset-3" disabled={isLoading} >{isLoading ? 'Loading...' : 'Edit Campground'}</button>
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default CampgroundEditModal;