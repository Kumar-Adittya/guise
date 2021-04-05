import React, { Component } from 'react';
import { upload_img } from '../images/index'
import ProfileTable from './ProfileTable';
import { dataService } from '../utility/data.service';
import { Button } from 'semantic-ui-react';

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
            isProfileTable:false
        }
    }

    handleChange = (e) => {
        this.setState({
            product_image: this.fileInput.value
                ? this.fileInput.files[0]
                : '',
            isUpload: true
        });
        sessionStorage.setItem('isFileAvailable', true);
    }

    getAllProducts = () => {
        this.setState({
            isProfileTable: false
        })
        dataService.getAllProducts(window.localStorage.getItem("token"))
            .then(response => {
                if (response) {
                    this.setState({ userData: response.results,isProfileTable:true })
                } else {
                    window.localStorage.removeItem("token");
                }
            })
    }
    componentDidMount() {
        this.getAllProducts()
    }
    submitHandler = (e) => {
        e.preventDefault();
        const submitData = new FormData();
        submitData.append('product_name', '');
        submitData.append('product_image_name', '');
        submitData.append('product_image', this.state.product_image);
        // console.log(submitData);   
        let token = window.localStorage.getItem('token');
        this.setState({ open: false });
        dataService.createProduct(token, submitData)
            .then(response => {
                if (response) {
                    this.setState({
                        show: true,
                        isUpload: false
                    });
                    this.getAllProducts()
                } else {
                    window.localStorage.removeItem("token");
                }
            })
    }
    render() {
        return (
            <div className="tab-content">
                {console.log(this.state.product_image)}
                <div className="image_caption">
                    <img src={upload_img} alt="Upload" />
                    <p>Upload Images</p>
                </div>
                <form onSubmit={this.submitHandler}>
                    <div className="file_uploader">
                        <label htmlFor="file_upload">
                            <input hidden ref={input => this.fileInput = input} name="data" type="file" onChange={this.handleChange} id="file_upload" multiple />
                            <p>Drop your file(s) JPG/CSV here or <span className="browse">browse</span></p>
                            <p><small>Max. File Size : 1MB</small></p>
                        </label>
                        <span className="badge badge-primary">Sample CSV</span>
                    </div>
                    {this.state.isUpload && <div className="upload_btn">
                        <Button type="submit" primary>Upload</Button>
                    </div>}
                </form>
                {this.state.isProfileTable?
                <ProfileTable userData={this.state.userData} />:null}
            </div>
        );
    }
};

export default UploadTab;