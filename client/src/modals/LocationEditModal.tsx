import { DateLocation } from "../models/DateLocation";
import { useForm } from 'react-hook-form'
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { updateLocation } from "../services/locationService";

type LocationForm = {
    title: string,
    address: string,
    price: number,
    description: string,
    deleteImages: string[]
}

type Props = {
    location: DateLocation
    show: boolean,
    onClose: () => void,
    onUpdate: (location: DateLocation) => void
}

const LocationEditModal = ({ location, show, onClose, onUpdate }: Props) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<LocationForm>({
        defaultValues: {
            title: location.title,
            address: location.address,
            price: location.price,
            description: location.description,
            deleteImages: []
        }
    });

    const onSubmit = (data: LocationForm) => {
        setIsLoading(true);
        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });

        const locationData = {
            title: data.title,
            address: data.address,
            price: data.price,
            description: data.description,
        };
        formData.append('location', JSON.stringify(locationData));

        data.deleteImages.forEach(img => formData.append('deleteImages[]', img));

        updateLocation(location.id, formData).then(res => {
            onUpdate(res.data.location);
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
                <Modal.Title>Edit Location </Modal.Title>
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
                            {errors.description && <small className="text-danger"> {errors.description?.message} </small>}
                        </div>
                        <div className="mb-2">
                            <label className="form-label" htmlFor="image">Add images</label>
                            <input className='form-control' type="file" name="images" onChange={handleFileChange} multiple id="image" />
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