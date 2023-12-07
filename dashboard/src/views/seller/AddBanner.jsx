import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BsImages } from 'react-icons/bs';
import { FaUpload } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { add_banner } from '../../store/Reducers/bannerReducer';


const AddBanner = () => {

    const { productId } = useParams();
    const dispatch = useDispatch();

    const [image, setImage] = useState('')
    const [imageShow, setImageShow] = useState('');


    //   inmageHandle
    const inmageHandle = (e) => {
        const files = e.target.files
        const length = files.length;

        if (length > 0) {
            setImage(files[0])
            setImageShow(URL.createObjectURL(files[0]))
        }
    }

    // add
    const add = (e) => {
        e.preventDefault()
        const formDate = new FormData();
        formDate.append('productId', productId)
        formDate.append('image', image)
        dispatch(add_banner(formDate))
    }

    return (
        <div className='px-2 lg:px-7 pt-5 '>
            <div className='w-full p-4  bg-[#283046] rounded-md'>
                <div className='flex justify-between items-center pb-4'>
                    <h1 className='text-[#d0d2d6] text-xl font-semibold'>Add Banner</h1>
                    <Link className='bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2 my-2 ' to='/seller/dashboard/banners'>Banners</Link>
                </div>
                <div>
                    <form onSubmit={add}>

                        <div className='mb-6'>

                            <label className='flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed hover:border-indigo-500 w-full text-[#d0d2d6]' htmlFor="image">
                                <span className='text-4xl'><FaUpload /></span>
                                <span>Select banner image</span>
                            </label>
                            <input required onChange={inmageHandle} className='hidden' type="file" id='image' />
                        </div>
                        {
                            imageShow &&
                            <div className='mb-4'>
                                <img className='w-full h-auto' src={imageShow} alt="img" />
                            </div>
                        }
                        <button className='bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-sm px-5 py-2 my-2 ' >Add banner</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddBanner;