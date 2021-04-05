import React, { Component } from 'react';
import { livestream_img } from '../images/index'
import ProfileTable from './ProfileTable';
import { dataService } from '../utility/data.service';
import { Button } from 'semantic-ui-react';

class LiveStreamTab extends Component {
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
            isProfileTable: false
        }
    }
    getAllProducts = () => {
        this.setState({
            isProfileTable: false
        })
        dataService.getAllProducts(window.localStorage.getItem("token"))
            .then(response => {
                if (response) {
                    var arrAllVideos = []
                    for (let i = 0; i < response.results.length; i++) {
                        // let findInString = response.results[i].product_image.toLowerCase()
                        // if (findInString.indexOf('mp4') > -1 || findInString.indexOf('webm') > -1 || findInString.indexOf('mov') > -1) {
                        //     arrAllVideos.push(response.results[i])
                        // }
                        let findInString = response.results[i].product_image.toLowerCase()
                        if (findInString === '' || findInString.indexOf('mp4') > -1 || findInString.indexOf('webm') > -1 || findInString.indexOf('mov') > -1) {
                            arrAllVideos.push(response.results[i])
                        }

                    }
                    this.setState({ userData: arrAllVideos, isProfileTable: true })
                } else {
                    window.localStorage.removeItem("token");
                }
            })
    }
    handleChange = (e) => {
        let fileVal = this.fileInput.value
            ? this.fileInput.files[0]
            : '';
        this.setState({
            product_image: fileVal,
            isUpload: true
        });
    }
    handleChangeUrl = (e) => {
        let fileVal = e.target.value;
        if (fileVal.trim() !== '') {
            this.setState({
                product_image_name: fileVal,
                isUpload: true
            });
        }else{
            this.setState({
                isUpload: false
            });
        }
    }
    submitHandler = (e) => {
        e.preventDefault();
        const submitData = new FormData();
        submitData.append('product_name', '');
        if(this.state.product_image_name !== ''){
            submitData.append('product_image_name', this.state.product_image_name);
            submitData.append('product_image', '');
        }else{
            submitData.append('product_image_name', '');
            submitData.append('product_image', this.state.product_image);
        }
        let token = window.localStorage.getItem('token');
        this.setState({ open: false });
        dataService.createProduct(token, submitData)
            .then(response => {
                if (response) {
                    this.setState({
                        show: true,
                        isUpload: false,
                        product_image_name: '',
                        product_image: ''
                    });
                    this.getAllProducts()
                } else {
                    window.localStorage.removeItem("token");
                }
            })
    }

    componentDidMount() {
        this.getAllProducts();
    }

    render() {
        return (
            <div>
                <div className="tab-content live-stream">
                    <div className="image_caption">
                        <img src={livestream_img} alt="Upload" />
                    </div>
                    <div className="form-group">
                        <input type="text" onChange={this.handleChangeUrl} placeholder="Enter URL" className="form-control" />
                    </div>
                    <p className="upload-text">Upload Video</p>
                    <form onSubmit={this.submitHandler}>
                        <div className="file_uploader">
                            <label htmlFor="file_upload">
                                <input ref={input => this.fileInput = input} accept="video/*" name="data" type="file" onChange={this.handleChange} hidden id="file_upload" />
                                <p>Drop your file(s) MPEG-4, WEBM & MOV here or <span className="browse">browse</span></p>
                                <p><small>Max. File Size : NA</small></p>
                            </label>
                        </div>
                        {this.state.isUpload && <div className="upload_btn">
                            <Button type="submit" primary>Upload</Button>
                        </div>}
                    </form>
                </div>
                {this.state.isProfileTable ?
                    <ProfileTable userData={this.state.userData} headerType={'video'} /> :
                    <div className="spinner">
                        <div className="loader"></div>
                    </div>
                }
            </div>
        );
    }
};

export default LiveStreamTab;