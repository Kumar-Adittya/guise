import React, { Component } from 'react';
import { upload_img } from '../images/index'
import ProfileTable from './ProfileTable';
import { dataService } from '../utility/data.service'; 

import DropFile from './DropFile'
import { log } from 'util'; 
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
            validFiles: [],
            c_id: 0
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
        const countData = new FormData();
        countData.append('count', '0');

        dataService.getAllProducts(countData)
            .then(response => {
                if (response) {
                    let arrAllImages = [], response_arr = response.records && Object.values(response.records), clientId_arr = Object.keys(response.records);
                    
                    for(let ele in clientId_arr){ 
                        response_arr[ele].c_id = clientId_arr[ele];
                    }  
                    for (let i = 0; i < response_arr.length; i++) { 
                        arrAllImages.push(response_arr[i]); 
                    }
                    let count = arrAllImages.length + 4; 
                    this.setState({ userData: arrAllImages, isProfileTable: true, c_id: count })
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
        this.setState({ open: false }); 
        const submitData = new FormData();
        submitData.append(this.state.c_id, 'John Doe'); 
        for (let i = 0; i < this.state.validFiles.length; i++) {
            submitData.append(this.state.c_id+'_'+i, this.state.validFiles[i]);  
        }   
        dataService.createProduct(submitData)
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
                    this.getAllProducts(); 
                } else {
                    window.localStorage.removeItem("token");
                }
            })
        
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
                     
                <DropFile uploadFiles = {(e) => this.submitHandler(e, this.state.c_id)} isUpload = {this.state.isUpload} parentCallback={this.handleCallback}/>
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