import React, { Component } from 'react';
import { table_user, bin_icon, edit_icon } from '../images/index'
import { Table, Button, Modal } from 'semantic-ui-react'
import { dataService } from '../utility/data.service';
// import {Alert} from 'react-bootstrap';

const token = window.localStorage.getItem('token');
class ProfileTable extends Component {
    // const [open, setOpen] = useState(false);
    // const [show, setShow] = useState(true);
    // const [loading, setLoading] = useState(true);
    // const [userData, setUserData] = useState([]);
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            show: false,
            loading: true,
            userData: [],
            product_name: '',
            product_image_name: '',
            product_image: '',
            edit_id: '',
            dlt_id: ''
        }
        console.log(this.props.userData) 
        this.upload = React.createRef();
    }

    // getAllProducts = () => {
    //     dataService.getAllProducts(window.localStorage.getItem("token"))
    //         .then(response => {
    //             if (response) {
    //                 if (!this.props.updateType) {
    //                     this.setState({ userData: response.results })
    //                 }
    //                 if (this.props.updateType) {
    //                     this.setState({ userData: this.props.userData })
    //                 }
    //             } else {
    //                 window.localStorage.removeItem("token");
    //             }
    //         })
    // }
    uploadNewData = () => {
        this.props.onCreateProduct(this.getAllProducts);
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }
    handleFileChange = () => {
        this.setState({
            product_image: this.fileInput.value
                ? this.fileInput.files[0]
                : ''
        })
    }
    submitHandler = (e) => {
        e.preventDefault();
        const submitData = new FormData();
        submitData.append('id', this.state.edit_id);
        // submitData.append('token', window.localStorage.getItem('token'));
        submitData.append('product_name', this.state.product_name);
        submitData.append('product_image_name', this.state.product_image_name);
        submitData.append('product_image', this.state.product_image);
        console.log(submitData);
        let id = submitData.get("id");
        this.setState({ open: false });
        dataService.editProduct(token, id, submitData)
            .then(response => {
                if (response) {
                    let arrAllData = this.state.userData
                    for (let i = 0; i < arrAllData.length; i++) {
                        if (arrAllData[i].id === response.id) {
                            let idx = i
                            arrAllData[idx] = response
                        } 
                    }
                    this.setState({
                        show: true,
                        userData: arrAllData
                    });
                } else {
                    window.localStorage.removeItem("token");
                }
            })
    }

    deleteProduct = (id) => {
        dataService.deleteProduct(token, id)
            .then(response => {
                if (response) {
                    let arrAllData = this.state.userData
                    for (let i = 0; i < arrAllData.length; i++) {
                        if (arrAllData[i].id === response.id) {
                            let idx = i
                            arrAllData[idx] = response
                        } 
                    }
                    this.setState({
                        show: true,
                        userData: arrAllData
                    });
                } else {
                    window.localStorage.removeItem("token");
                }
            })
    }
    closePopup = () => {
        this.setState({ show: false })
    }

    componentDidMount() {
        this.setState({
            userData: this.props.userData
        })

    }


    render() {
        return (
            <div className="table-wrap">
                {this.state.show && <div className="success-message">
                    <div className="close-icon" onClick={this.closePopup}>&times;</div>
                    <div className="success-heading">Image Upload Guidelines</div>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. diam sollicitudin.</p>
                </div>}

                <h3 className="table-heading">Registered : 256 <span className="badge badge-primary"><span className="badge-icon primary">?</span>Error : 06</span></h3>
                <div className="table-responsive">
                    <Table basic='very'>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Image Name</Table.HeaderCell>
                                <Table.HeaderCell>ID</Table.HeaderCell>
                                <Table.HeaderCell>Person Name</Table.HeaderCell>
                                <Table.HeaderCell>Last Modified</Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {this.state.userData.map((ele, i) => {
                                return (
                                    <Table.Row key={i}>
                                        <Table.Cell><img src={'https://res.cloudinary.com/dzdecrhc3/' + ele.product_image} alt="profile" />{ele.product_image_name}</Table.Cell>
                                        <Table.Cell>{ele.id}</Table.Cell>
                                        <Table.Cell>{ele.product_name}</Table.Cell>
                                        <Table.Cell>{ele.last_update}</Table.Cell>
                                        <Table.Cell>
                                            {!ele.product_name && <span className="badge badge-primary" onClick={() => this.setState({ open: true, edit_id: ele.id })}>Add Info</span>}
                                            {ele.product_name && <div><span className="table-icon" onClick={() => this.setState({ open: true, edit_id: ele.id })}><img src={edit_icon} alt=" " /></span>
                                                <span className="table-icon" onClick={() => this.deleteProduct(ele.id)}><img src={bin_icon} alt=" " /></span></div>
                                            }
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            })
                            }
                        </Table.Body>
                    </Table>
                </div>
                {/* modal  */}
                <div className="modal-wrap">
                    <Modal
                        onClose={() => this.setState({ open: false })}
                        onOpen={() => this.setState({ open: true })}
                        open={this.state.open}
                        size='mini'
                    >
                        <Modal.Header>
                            <span className="img_wrap"><img src={table_user} alt="profile" /> Edit Image</span>
                            <div
                                className="close-icon"
                                onClick={() => this.setState({ open: false })}
                            >&times;</div>
                        </Modal.Header>
                        <Modal.Content >
                            <Modal.Description>
                                <form onSubmit={this.submitHandler}>
                                    <div className="form-group">
                                        <label>Product Name</label>
                                        <input name="product_name" type="text" value={this.state.product_name} onChange={this.handleInputChange} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Product Image Name</label>
                                        <input name="product_image_name" type="text" value={this.state.product_image_name} onChange={this.handleInputChange} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Product Image</label>
                                        <input name="product_image" ref={input => this.fileInput = input} type="file" onChange={this.handleFileChange} className="form-control" />
                                    </div>
                                    <Button primary className="w-100">Save</Button>
                                </form>
                            </Modal.Description>
                        </Modal.Content>
                    </Modal>
                </div>
            </div>
        );
    }

};

export default ProfileTable;