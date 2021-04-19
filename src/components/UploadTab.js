import React, { Component } from 'react';
import { upload_img, csvFile } from '../images/index'
import ProfileTable from './ProfileTable';
import { dataService } from '../utility/data.service';
import DropFile from './DropFile'
// import { log } from 'util';
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
            validFiles: {},
            csv_file: {},
            isAllUser: false,
            error_msg: '0'
        }
    }

    handleCallback = (childData) => {
        this.setState({ validFiles: childData })
        this.setState({
            csv_file: childData[0]
        })
        console.log(childData[0])
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
    registerClient = (e) => {
        e.preventDefault();
        this.setState(prevState => {
            return {
                ...prevState,
                isAllUser: true,
            }
        })
    }
    saveData = (e) => {
        e.preventDefault();
        let saveImgData = [];
        for (let i = 0; i < this.state.validFiles.length; i++) {
            console.log(this.state.validFiles[i]);
            let obj = {};
            obj["name"] = '';
            obj["img"] = this.state.validFiles[i];
            obj["date"] = new Date().toLocaleDateString("en-US");
            saveImgData.push(obj);
        }
        this.setState(prevState => {
            return {
                ...prevState,
                show: true,
                isUpload: !this.state.isUpload,
                userData: [...prevState.userData, ...saveImgData]
            }
        });
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
                    let arrAllImages = [];
                    if (response.records) {
                        var response_arr = response.records && Object.values(response.records), clientId_arr = Object.keys(response.records);


                        for (let ele in clientId_arr) {
                            response_arr[ele].c_id = clientId_arr[ele];
                        }
                        for (let i = 0; i < response_arr.length; i++) {
                            arrAllImages.push(response_arr[i]);
                        }
                    }
                    let count = arrAllImages.length + 1;
                    this.setState({ userData: arrAllImages, isProfileTable: true, c_id: count });


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
        submitData.append('csv_file', this.state.csv_file, this.state.csv_file.name);

        dataService.createProduct(submitData)
            .then(response => {
                if (response) {
                    this.setState(prevState => {
                        return {
                            ...prevState,
                            show: true,
                            isUpload: !this.state.isUpload,
                            userData: [...prevState.userData, response],
                            error_msg: response.error_msg,
                            csv_file: {}
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
                {console.log("userData", this.state.userData)}
                <div className="image_caption">
                    <img src={upload_img} alt="Upload" />
                    <p>Upload CSV</p>
                </div>


                {/* <div className="file_uploader">
                        <label htmlFor="file_upload">
                            <input hidden ref={input => this.fileInput = input} accept="image/*" name="data" type="file" onChange={this.handleChange} id="file_upload" />
                            <p>Drop your file(s) JPG/PNG/JPEG here or <span className="browse">browse</span></p>
                            <p><small>Max. File Size : 1MB</small></p>
                        </label>
                        <span className="badge badge-primary">Sample CSV</span> 
                    </div> */}
                <div className="sample_download">
                    <a href={csvFile} download>Download Sample</a>
                </div>
                <DropFile uploadFiles={(e) => this.submitHandler(e)} isUpload={!this.state.isUpload} registerClient={(e) => this.registerClient(e)} parentCallback={this.handleCallback} />
                {this.state.isProfileTable ?
                    <ProfileTable userData={this.state.userData} isShow={this.state.show} isAllUser={this.state.isAllUser} headerType={'image'} errorMsg={this.state.error_msg} /> :
                    <div className="spinner">
                        <div className="loader"></div>
                    </div>
                }
            </div>
        );
    }
};

export default UploadTab;