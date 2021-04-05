import React from 'react';
import { livestream_img } from '../images/index'

const LiveStreamTab = () => {
    return (
        <div>
            <div className="tab-content live-stream">
                <div className="image_caption">
                    <img src={livestream_img} alt="Upload" />
                </div>
                <div className="form-group">
                    <input type="text" placeholder="Enter URL" className="form-control" />
                </div>
                <p className="upload-text">Upload Images</p>
                <div className="file_uploader">
                    <label htmlFor="file_upload">
                        <input hidden type="file" id="file_upload" multiple />
                        <p>Drop your file(s) JPG/CSV here or <span className="browse">browse</span></p>
                        <p><small>Max. File Size : 1MB</small></p>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default LiveStreamTab;