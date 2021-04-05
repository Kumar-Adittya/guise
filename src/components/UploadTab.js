import React, { Component } from 'react';
import { upload_img } from '../images/index'
import ProfileTable from './ProfileTable';
import { dataService } from '../utility/data.service'; 

import DropFile from './DropFile'

class UploadTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            show: false,
            userData: [],
            product_name: '',
            product_image_name: '',
            product_image: '',
            isUpload: false,
            isProfileTable: false,
            validFiles: []
        }
    }

    handleCallback = (childData) => { 
        this.setState({validFiles: childData})
    }

    handleChange = (e) => {
        let fileVal = this.fileInput.value
        ? this.fileInput.files[0]
        : '';
        this.setState({
            product_image: fileVal, 
        });
        sessionStorage.setItem('isFileAvailable', true); 
        
    }

    getAllProducts = () => {
        this.setState({
            isProfileTable: false, 
        })
        dataService.getAllProducts(window.localStorage.getItem("token"))
            .then(response => {
                if (response) {
                    var arrAllImages = []
                    for (let i = 0; i < response.results.length; i++) {
                        let findInString = response.results[i].product_image.toLowerCase()
                        if(findInString.indexOf('png') > -1 || findInString.indexOf('jpg') > -1 || findInString.indexOf('jpeg') > -1){
                            arrAllImages.push(response.results[i])
                        } 
                    }
                    this.setState({ userData: arrAllImages, isProfileTable: true })
                } else {
                    window.localStorage.removeItem("token");
                }
            })
    }
    componentDidMount() {
        this.getAllProducts(); 
    }
    submitHandler = (e) => {
        e.preventDefault(); 
        let token = window.localStorage.getItem('token');
        this.setState({ open: false });
        console.log("ValidFiles", this.state.validFiles);
        for (let i = 0; i < this.state.validFiles.length; i++) {
            const submitData = new FormData();
            submitData.append('product_name', '');
            submitData.append('product_image_name', ''); 
            submitData.append('product_image', this.state.validFiles[i]);  
            
        dataService.createProduct(token, submitData)
            .then(response => {
                if (response) { 
                    this.setState(prevState => { 
                        return {
                            ...prevState,
                            show: true,
                            isUpload: false, 
                            userData: [...prevState.userData, response]
                        }
                    });
                    this.getAllProducts() 
                } else {
                    window.localStorage.removeItem("token");
                }
            })
        }
    }
    render() {
        return (
            <div className="tab-content">
                <div className="image_caption">
                    <img src={upload_img} alt="Upload" />
                    <p>Upload Images</p>
                </div> 
                    {/* <div className="file_uploader">
                        <label htmlFor="file_upload">
                            <input hidden ref={input => this.fileInput = input} accept="image/*" name="data" type="file" onChange={this.handleChange} id="file_upload" />
                            <p>Drop your file(s) JPG/PNG/JPEG here or <span className="browse">browse</span></p>
                            <p><small>Max. File Size : 1MB</small></p>
                        </label>
                        <span className="badge badge-primary">Sample CSV</span> 
                    </div> */}
                     
                <DropFile uploadFiles = {this.submitHandler} isUpload = {this.state.isUpload} parentCallback={this.handleCallback}/>
                {this.state.isProfileTable ?
                    <ProfileTable userData={this.state.userData} headerType={'image'}/> :
                    <div className="spinner">
                        <div className="loader"></div>
                    </div>
                }
            </div>
        );
    }
};

export default UploadTab;