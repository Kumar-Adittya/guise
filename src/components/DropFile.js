import React, { useRef, useState, useEffect } from 'react';
import { Button } from 'semantic-ui-react';   

const DropFile = (props) => {

    const fileInputRef = useRef();
    const modalImageRef = useRef();
    const modalRef = useRef();
    const progressRef = useRef();
    const uploadRef = useRef();
    const uploadModalRef = useRef();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [validFiles, setValidFiles] = useState([]);
    const [unsupportedFiles, setUnsupportedFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');  
    const [fileExceed, setFileExceed] = useState(false);  
    const [upload, setUpload] = useState(props.isUpload); 
    
    

    useEffect(() => {
        let filteredArr = selectedFiles.reduce((acc, current) => {
            const x = acc.find(item => item.name === current.name);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);
        setValidFiles([...filteredArr]); 
        setUpload(true);
    }, [selectedFiles]);
    
    useEffect(() => {
        setValidFiles([]);
        setSelectedFiles([])
    },[props.isUpload]); 

    useEffect(() => {
        if(validFiles.length < 5){
            setFileExceed(false);
            props.parentCallback(validFiles); 
        }
        else {
            setFileExceed(true);
        }
         
    }, [validFiles])

    const preventDefault = (e) => {
        e.preventDefault(); 
    }

    const dragOver = (e) => {
        preventDefault(e);
    }

    const dragEnter = (e) => {
        preventDefault(e); 
    }

    const dragLeave = (e) => {
        preventDefault(e);
    }

    const fileDrop = (e) => {
        preventDefault(e); 
        const files = e.dataTransfer.files;
        console.log(files.length); 
        if (files.length) {
            handleFiles(files); 
        } 
    }

    const filesSelected = () => {   
        if (fileInputRef.current.files.length) { 
            handleFiles(fileInputRef.current.files);
        }
    }

    const fileInputClicked = () => {
        fileInputRef.current.click(); 
    }

    const handleFiles = (files) => {  
        for(let i = 0; i < files.length; i++) { 
            if (validateFile(files[i])) {
                setSelectedFiles(prevArray => [...prevArray, files[i]]);
            } else {
                files[i]['invalid'] = true;
                setSelectedFiles(prevArray => [...prevArray, files[i]]);
                setErrorMessage('File type not permitted');
                setUnsupportedFiles(prevArray => [...prevArray, files[i]]);
            }
        } 
    }

    const validateFile = (file) => {
        if (file.type !== 'text/csv' || file.type !== 'application/vnd.ms-excel') {
            return false;
        } 
        return true;
    }

    const fileSize = (size) => {
        if (size === 0) {
          return '0 Bytes';
        }
        const k = 5120;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    const fileType = (fileName) => {
        return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
    }

    const removeFile = (name) => { 
        const index = validFiles.findIndex(e => e.name === name);
        const index2 = selectedFiles.findIndex(e => e.name === name);
        const index3 = unsupportedFiles.findIndex(e => e.name === name);
        validFiles.splice(index, 1);
        selectedFiles.splice(index2, 1); 
        setValidFiles([...validFiles]);
        setSelectedFiles([...selectedFiles]); 
        if (index3 !== -1) {
            unsupportedFiles.splice(index3, 1);
            setUnsupportedFiles([...unsupportedFiles]);
        }
    }

    const openImageModal = (file) => {
        const reader = new FileReader();
        modalRef.current.style.display = "block";
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            modalImageRef.current.style.backgroundImage = `url(${e.target.result})`;
        }
    }

    const closeModal = () => {
        modalRef.current.style.display = "none";
        modalImageRef.current.style.backgroundImage = 'none';
    } 

    const closeUploadModal = () => {
        uploadModalRef.current.style.display = 'none';
    }
     

    return (
        <>   
            <div className="container">
                <div className="btn-wrap">{unsupportedFiles.length === 0 && selectedFiles.length > 0 && !fileExceed ? <Button primary className="btn-sm btn-outline" onClick={(e) => props.uploadFiles(e)}>Register</Button> : ''}</div>
                {unsupportedFiles.length ? <p>Please remove all unsupported files.</p> : ''}
                <div className="file_uploader"
                    onDragOver={dragOver}
                    onDragEnter={dragEnter}
                    onDragLeave={dragLeave}
                    onDrop={fileDrop}
                    onClick={fileInputClicked}
                > 
                      <div className="inner_upload">
                      <p>Drop your CSV file here or <span className="browse">browse</span></p>
                            <p><small>Max. File Size : 5MB</small></p> 
                    <input
                        ref={fileInputRef}
                        className="file-input"
                        type="file"
                        // multiple
                        onChange={filesSelected}
                    />
                      </div>
                </div>
               { upload ? <div className="file-display-container">
                    {fileExceed && <p className="file-error-message">Client have maximum 4 images. </p>}
                    { 
                        validFiles.map((data, i) => 
                            <div className="file-status-bar" key={i}>
                                <div onClick={!data.invalid ? () => openImageModal(data) : () => removeFile(data.name)}> 
                                    <div className="file-type">{fileType(data.name)}</div>
                                    <span className={`file-name ${data.invalid ? 'file-error' : ''}`}>{data.name}</span>
                                    <span className="file-size">({fileSize(data.size)})</span> {data.invalid && <span className='file-error-message'>({errorMessage})</span>}
                                </div>
                                <div className="file-remove" onClick={() => removeFile(data.name)}>X</div>
                            </div>
                        )
                    }
                </div> : null}
            </div>
            <div className="modal" ref={modalRef}>
                <div className="overlay"></div>
                <span className="close" onClick={(() => closeModal())}>X</span>
                <div className="modal-image" ref={modalImageRef}></div>
            </div>

            <div className="upload-modal" ref={uploadModalRef}>
                <div className="overlay"></div>
                <div className="close" onClick={(() => closeUploadModal())}>X</div>
                <div className="progress-container">
                    <span ref={uploadRef}></span>
                    <div className="progress">
                        <div className="progress-bar" ref={progressRef}></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DropFile;