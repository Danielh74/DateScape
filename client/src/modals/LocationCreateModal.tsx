import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { postLocation } from '../services/locationService';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';

type LocationForm = {
    title: string,
    address: string,
    price: number,
    description: string,
    categories: string[],
    images: FileList
}

type Props = {
    show: boolean,
    onClose: () => void
}

const LocationCreateModal = ({ show, onClose }: Props) => {
    const navigate = useNavigate();
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


        const locationData = {
            title: data.title,
            address: data.address,
            price: data.price,
            description: data.description,
            categories: data.categories
        };

        formData.append('location', JSON.stringify(locationData));

        Array.from(data.images).forEach(file => {
            formData.append('images', file);
        });

        postLocation(formData)
            .then(res => {
                navigate(`/location/${res.data.newLocation.id}`);
                resetForm()
            })
            .catch(err => toast.error(err.response.data))
            .finally(() => {
                setIsLoading(false);
            });
    };

    const resetForm = () => {
        onClose();
        reset();
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
                            <input
                                className={`form-control ${errors.title && 'border-danger'}`}
                                type="text"
                                {...register("title", {
                                    required: "Title is required",
                                    minLength: { value: 2, message: "Title must be at least 2 characters" },
                                    maxLength: { value: 100, message: "Title cannot exceed 100 characters" }
                                })}
                                id="title" />
                            {errors.title && <small className="text-danger"> {errors.title.message} </small>}
                        </div>
                        <div className="mb-2">
                            <label className="form-label" htmlFor="location">Address</label>
                            <input
                                className={`form-control ${errors.address && 'border-danger'}`}
                                type="text"
                                {...register("address", {
                                    required: 'Location is required'
                                })}
                                id="location" />
                            {errors.address && <small className="text-danger"> {errors.address.message} </small>}
                        </div>
                        <div className=" mb-2">
                            <label htmlFor="price">Price</label>
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <input
                                    type="number"
                                    className={`form-control ${errors.price && 'border-danger'}`}
                                    id="price"
                                    {...register("price",
                                        {
                                            required: "Price is required",
                                            min: { value: 0, message: "Price cannot be negative" },
                                            valueAsNumber: true
                                        })} />
                                {errors.price && <small className="text-danger"> {errors.price.message} </small>}
                            </div>
                        </div>
                        <div className="mb-2">
                            <label className="form-label" htmlFor="description">Description</label>
                            <textarea
                                className={`form-control ${errors.description && 'border-danger'}`}
                                id="description"
                                {...register('description', {
                                    required: "Description is required",
                                    minLength: { value: 2, message: "Description must be at least 2 characters" },
                                    maxLength: { value: 2000, message: "Description cannot exceed 2000 characters" }
                                })} />
                            {errors.description && <small className="text-danger"> {errors.description.message} </small>}
                        </div>
                        <div className="mb-2">
                            <label>Categories</label>
                            <div>
                                {categoryList.map(category =>
                                    <span key={`category-${category}`} className='ms-2'>
                                        <input
                                            className={`form-check-input ${errors.categories && 'border-danger'}`}
                                            type="checkbox"
                                            value={category}
                                            id={`category-${category}`}
                                            {...register('categories', {
                                                validate: value =>
                                                    value.length > 0 || 'Select at least one category'
                                            })} />
                                        <label className="form-check-label ms-1" htmlFor={`category-${category}`}>{category}</label>
                                    </span>
                                )}
                            </div>

                            {errors.categories && <small className='text-danger'>{errors.categories.message}</small>}
                        </div>
                        <div className="mb-2">
                            <label className="form-label" htmlFor="image">Add images</label>
                            <input
                                className={`form-control ${errors.images && 'border-danger'}`}
                                type="file"
                                accept="image/*"
                                multiple
                                id="image"
                                {...register('images', {
                                    validate: files =>
                                        files?.length > 0 || 'Must choose at least 1 file'
                                })} />
                            {errors.images && <small className='text-danger'>{errors.images.message}</small>}
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