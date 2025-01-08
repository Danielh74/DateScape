import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { postCampground } from '../services/campgroundService';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';

type CampForm = {
    title: string,
    location: string,
    price: number,
    description: string,
}

type Props = {
    show: boolean,
    onClose: () => void
}

type FileForm = {
    files: File[],
    error: string
}

const CampgroundCreateModal = ({ show, onClose }: Props) => {
    const navigate = useNavigate();
    const [files, setFiles] = useState<FileForm>({ files: [], error: '' });
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<CampForm>({
        defaultValues: {
            title: "",
            location: "",
            price: 0.00,
            description: ""
        }
    });

    const onSubmit = (data: CampForm) => {
        setIsLoading(true);
        const formData = new FormData();

        if (files.files.length === 0) {
            setFiles(prev => ({ ...prev, error: 'Must choose at least 1 file' }));
            setIsLoading(false);
            return;
        }

        const campgroundData = {
            title: data.title,
            location: data.location,
            price: data.price,
            description: data.description
        };
        formData.append('campground', JSON.stringify(campgroundData));

        files.files.forEach(file => {
            formData.append('images', file);
        });

        postCampground(formData)
            .then(res => {
                console.log(res);
                navigate(`/campground/${res.data.newCampground.id}`);
                resetForm()
            })
            .catch(err => console.error(err)).finally(() => {
                setIsLoading(false);
            });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const images = Array.from(e.target.files)
            setFiles(prev => ({ ...prev, files: images }));
        }
    };

    const resetForm = () => {
        onClose();
        reset();
        setFiles({ files: [], error: '' });
    };

    return (
        <Modal
            show={show}
            onHide={resetForm}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Create Campground</Modal.Title>
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
                            <input className={`form-control ${files.error && 'border-danger'}`} type="file" name="images" onChange={handleFileChange} multiple id="image" />
                            {files.error && <small className='text-danger'>{files.error}</small>}
                        </div>
                        <div className="row mt-3">
                            <button className="btn btn-success col-6 offset-3" disabled={isLoading} >{isLoading ? 'Loading...' : 'Create Campground'}</button>
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default CampgroundCreateModal