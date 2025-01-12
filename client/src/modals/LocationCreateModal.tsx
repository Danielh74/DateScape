import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { postLocation } from '../services/locationService';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';

type LocationForm = {
    title: string,
    address: string,
    price: number,
    description: string,
    categories: string[]
}

type Props = {
    show: boolean,
    onClose: () => void
}

type FileForm = {
    files: File[],
    error: string
}

const LocationCreateModal = ({ show, onClose }: Props) => {
    const navigate = useNavigate();
    const [files, setFiles] = useState<FileForm>({ files: [], error: '' });
    const [isLoading, setIsLoading] = useState(false);
    const categoryList = ['Outdoor', 'Food', 'Culture', 'Fun', 'Active', 'Romantic'];
    const { register, handleSubmit, reset, formState: { errors } } = useForm<LocationForm>({
        defaultValues: {
            title: "",
            address: "",
            price: 0.00,
            description: "",
            categories: []
        }
    });

    const onSubmit = (data: LocationForm) => {
        setIsLoading(true);
        const formData = new FormData();

        if (files.files.length === 0) {
            setFiles(prev => ({ ...prev, error: 'Must choose at least 1 file' }));
            setIsLoading(false);
            return;
        }

        const locationData = {
            title: data.title,
            address: data.address,
            price: data.price,
            description: data.description,
            categories: data.categories
        };
        formData.append('location', JSON.stringify(locationData));

        files.files.forEach(file => {
            formData.append('images', file);
        });
        postLocation(formData)
            .then(res => {
                console.log(res);
                navigate(`/location/${res.data.newLocation.id}`);
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
                <Modal.Title>Create Location</Modal.Title>
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
                            <label className="form-label" htmlFor="location">Address</label>
                            <input className={`form-control ${errors.address && 'border-danger'}`} type="text" {...register("address", { required: 'Location is required' })} id="location" />
                            {errors.address && <small className="text-danger"> {errors.address.message} </small>}
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
                            {errors.description && <small className="text-danger"> {errors.description.message} </small>}
                        </div>
                        <div className="mb-2">
                            <label>Categories</label>
                            <div>
                                {categoryList.map((category, index) =>
                                    <span key={`category-${index}`} className='ms-2'>
                                        <input className={`form-check-input ${files.error && 'border-danger'}`} type="checkbox" value={category} id={category} {...register('categories')} />
                                        <label className="form-check-label ms-1" htmlFor={category}>{category}</label>
                                    </span>
                                )}
                            </div>

                            {errors.categories && <small className='text-danger'>{errors.categories.message}</small>}
                        </div>
                        <div className="mb-2">
                            <label className="form-label" htmlFor="image">Add images</label>
                            <input className={`form-control ${files.error && 'border-danger'}`} type="file" name="images" onChange={handleFileChange} multiple id="image" />
                            {files.error && <small className='text-danger'>{files.error}</small>}
                        </div>
                        <div className="row mt-3">
                            <button className="btn btn-success col-6 offset-3" disabled={isLoading} >{isLoading ? 'Loading...' : 'Create Location'}</button>
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default LocationCreateModal