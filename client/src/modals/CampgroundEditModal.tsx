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
    const { register, handleSubmit } = useForm<CampForm>({
        defaultValues: {
            title: campground.title,
            location: campground.location,
            price: campground.price,
            description: campground.description,
            deleteImages: []
        }
    });

    const onSubmit = (data: CampForm) => {
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
        })
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
                            <input className="form-control" type="text" {...register("title", { required: true })} id="title" />
                            <div className="invalid-feedback">
                                Title is required.
                            </div>
                        </div>
                        <div className="mb-2">
                            <label className="form-label" htmlFor="location">Location</label>
                            <input className="form-control" type="text" {...register("location", { required: true })} id="location" />
                            <div className="invalid-feedback">
                                Location is required.
                            </div>
                        </div>
                        <div className=" mb-2">
                            <label htmlFor="price">Price</label>
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <input type="number" className="form-control" placeholder="0.00" id="price" {...register("price", { required: true, min: 0.01 })} />
                                <div className="invalid-feedback">
                                    Price is required.
                                </div>
                            </div>
                        </div>
                        <div className="mb-2">
                            <label className="form-label" htmlFor="description">Description</label>
                            <textarea className="form-control" id="description"
                                {...register('description', { required: true })}></textarea>
                            <div className="invalid-feedback">
                                Description is required.
                            </div>
                        </div>
                        <div className="mb-2">
                            <label className="form-label" htmlFor="image">Add images</label>
                            <input className="form-control" type="file" name="images" onChange={handleFileChange} multiple id="image" />
                        </div>
                        <div>
                            {campground?.images.map((img, i) =>
                                <div className="row" key={img._id}>
                                    <div className="col">
                                        <img src={img.url} className="img-thumbnail row" style={{ width: 75 }} alt="" />
                                        <input type="checkbox" {...register('deleteImages')} value={img.filename} id={`img-${i}`}></input>
                                        <label htmlFor={`img-${i}`}>Delete?</label>
                                    </div>

                                </div>
                            )}
                        </div>
                        <div className="row border-top mt-2">
                            <button className="btn btn-success col-4 offset-4 mt-2" data-bs-dismiss="modal">Save changes</button>
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default CampgroundEditModal;