import React, { Component } from 'react';
import { livestream_img } from '../images/index'
// import ProfileTable from './ProfileTable';
import { dataService } from '../utility/data.service';
import { Button } from 'semantic-ui-react';
import $ from "jquery";

class LiveStreamTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            show: false,
            userData: [],
            videoUrl: '',
            videoPath: '',
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
                    // for (let i = 0; i < response.results.length; i++) {
                    //     // let findInString = response.results[i].product_image.toLowerCase()
                    //     // if (findInString.indexOf('mp4') > -1 || findInString.indexOf('webm') > -1 || findInString.indexOf('mov') > -1) {
                    //     //     arrAllVideos.push(response.results[i])
                    //     // }
                    //     let findInString = response.results[i].product_image.toLowerCase()
                    //     if (findInString === '' || findInString.indexOf('mp4') > -1 || findInString.indexOf('webm') > -1 || findInString.indexOf('mov') > -1) {
                    //         arrAllVideos.push(response.results[i])
                    //     }

                    // }
                    this.setState({ userData: arrAllVideos, isProfileTable: true })
                } else {
                    window.localStorage.removeItem("token");
                }
            })
    }
    handleChangePath = (e) => {
        let fileVal = e.target.value
        if (fileVal.trim() !== '') {
            this.setState({
                videoPath: fileVal,
                isUpload: true
            });
        } else {
            this.setState({
                isUpload: false
            });
        }
    }
    handleChangeUrl = (e) => {
        let fileVal = e.target.value;
        if (fileVal.trim() !== '') {
            this.setState({
                videoUrl: fileVal,
                isUpload: true
            });
        } else {
            this.setState({
                isUpload: false
            });
        }
    }
    submitHandler = (e) => {
        e.preventDefault();
        const submitData = new FormData();

        // submitData.append('video_path', this.state.product_image); 
        if (this.state.videoUrl !== '') {
            submitData.append('rtsp_link', this.state.videoUrl);
            submitData.append('video_path', '');
        } else {
            submitData.append('rtsp_link', 'None');
            submitData.append('video_path', this.state.videoPath);
        }

        this.setState({ open: false });
        dataService.uploadVideo(submitData)
            .then(response => {
                if (response) {
                    this.setState({
                        show: true,
                        isUpload: false,
                        videoPath: '',
                        videoUrl: ''
                    });
                    alert(response.statusText)
                    this.getAllProducts()
                } else {
                    window.localStorage.removeItem("token");
                    this.setState({
                        videoPath: '',
                        videoUrl: '',
                        isUpload: false
                    })
                }
                $('input').val('');
            })
            .catch(error => { 
               alert(error)
                this.setState({
                    videoPath: '',
                    videoUrl: '',
                    isUpload: false,
                })
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
                        <input type="text" onChange={this.handleChangeUrl}  placeholder="Enter URL" className="form-control" />
                    </div>
                    <p className="upload-text">Upload Video Path</p>
                    <form onSubmit={this.submitHandler}>
                        <div className="form-group">
                            <input type="text" onChange={this.handleChangePath} placeholder="Enter Path" className="form-control" />
                        </div>
                        {this.state.isUpload && <div className="upload_btn">
                            <Button type="submit" primary>Upload</Button>
                        </div>}
                    </form>
                </div>
                {/* {this.state.isProfileTable ?
                    <ProfileTable userData={this.state.userData} headerType={'video'} /> :
                    <div className="spinner">
                        <div className="loader"></div>
                    </div>
                } */}
            </div>
        );
    }
};

export default LiveStreamTab;