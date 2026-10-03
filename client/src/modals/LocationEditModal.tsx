import { DateLocation } from "../models/DateLocation";
import { useForm } from 'react-hook-form'
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { updateLocation } from "../services/locationService";
import { toast } from "react-toastify";

type LocationForm = {
    title: string,
    address: string,
    price: number,
    description: string,
    categories: string[],
    images?: FileList,
    deleteImages: string[]
}

type Props = {
    location: DateLocation
    show: boolean,
    onClose: () => void,
    onUpdate: (location: DateLocation) => void
}

const LocationEditModal = ({ location, show, onClose, onUpdate }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const categoryList = ['Outdoor', 'Food', 'Culture', 'Fun', 'Active', 'Romantic'];
    const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm<LocationForm>({
        defaultValues: {
            title: location.title,
            address: location.address,
            price: location.price,
            description: location.description,
            categories: location.categories,
            deleteImages: []
        }
    });

    useEffect(() => {
        reset({
            title: location.title,
            address: location.address,
            price: location.price,
            description: location.description,
            categories: location.categories,
            deleteImages: []
        });
    }, [location, reset]);

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

        Array.from(data.images ?? []).forEach(file => {
            formData.append('images', file);
        });

        data.deleteImages.forEach(img => formData.append('deleteImages', img));

        updateLocation(location.id, formData).then(res => {
            onUpdate(res.data.location);
            onClose();
        }).catch(err => {
            toast.error(err.response?.data || 'Failed to update location');
        }).finally(() => {
            setIsLoading(false);
        });
    };

    return (
        <Modal
            show={show}
            onHide={onClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Edit Location </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <form onSubmit={handleSubmit(onSubmit)} className="needs-validation" encType="multipart/form-data">
                        <div className="mb-2">
                            <label className="form-label" htmlFor="title">Title</label>
                            <input
                                className={`form-control ${errors.title && 'border-danger'}`}
                                type="text"
                                {...register("title", { required: 'Title is required' })}
                                id="title" />
                            {errors.title && <small className="text-danger"> {errors.title.message} </small>}
                        </div>

                        <div className="mb-2">
                            <label className="form-label" htmlFor="location">Address</label>
                            <input
                                className={`form-control ${errors.address && 'border-danger'}`}
                                type="text"
                                {...register("address", { required: 'Location is required' })}
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
                                    {...register("price", {
                                        required: 'Price is required',
                                        valueAsNumber: true,
                                        min: {
                                            value: 0,
                                            message: 'Value cannot be less than zero'
                                        }
                                    })} />
                            </div>
                            {errors.price && <small className="text-danger"> {errors.price.message} </small>}
                        </div>

                        <div className="mb-2">
                            <label className="form-label" htmlFor="description">Description</label>
                            <textarea
                                className={`form-control ${errors.description && 'border-danger'}`}
                                id="description"
                                {...register('description', { required: 'Description is required' })}>
                            </textarea>
                            {errors.description && <small className="text-danger"> {errors.description?.message} </small>}
                        </div>

                        <div className="mb-2">
                            <label>Categories</label>
                            <div>
                                {categoryList.map((category) =>
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
                                className='form-control'
                                type="file"
                                accept="image/*"
                                multiple
                                id="image"
                                {...register('images')} />
                            {errors.images && <small className='text-danger'>{errors.images.message}</small>}
                        </div>

                        <div>
                            {location.images.map((img, i) =>
                                <span key={img._id}>
                                    <img src={img.thumbnail} alt="" />

                                    <input
                                        type="checkbox"
                                        {...register('deleteImages', {
                                            validate: value => {
                                                const newImages = getValues('images');

                                                const newImageCount = newImages?.length ?? 0;
                                                const remainingImages =
                                                    location.images.length - value.length + newImageCount;

                                                return (
                                                    remainingImages > 0 ||
                                                    'Location must contain at least one image'
                                                );
                                            }
                                        })}
                                        value={img.filename}
                                        id={`img-${i}`} />

                                    <label htmlFor={`img-${i}`}>Delete?</label>
                                </span>
                            )}

                            {errors.deleteImages && <div className="text-danger"> {errors.deleteImages.message}</div>}
                        </div>

                        <div className="row mt-3">
                            <button className="btn btn-success col-6 offset-3" disabled={isLoading} >{isLoading ? 'Loading...' : 'Edit Location'}</button>
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default LocationEditModal;