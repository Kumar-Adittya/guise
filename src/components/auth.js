import React, { Component } from 'react';
import { dataService } from '../utility/data.service';
import EmployeeTab from './EmployeeTab';
import Header from './Header';  

export const ThemeContext = React.createContext('light');

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: true,
            username: 'sudheer',
            password: 'sudh@112',
            isFileAvailable: false
        }
    }

    componentDidMount() {
        if (!window.localStorage.getItem("token")) {
            dataService.authToken(this.state.username, this.state.password)
                .then(response => {
                    if (response.token) {
                        console.log(response)
                        window.localStorage.setItem('token', response.token)
                        window.localStorage.setItem('version', 'v-0.01')
                        this.setState({
                            loader: false
                        })
                    } else {
                        // alert('Something Went Wrong !')
                    }
                })
        }
        else {
            this.setState({
                loader: false
            })
        }
 
    }
    render() {
        return (
            <div className="validation_wrapper">
                <ThemeContext.Provider value={{state: this.state.isFileAvailable}}> 
                { 
                    this.state.loader ?
                        <div className="spinner">
                            <div className="loader"></div>
                        </div>
                        :
                        <>
                            <Header/>
                            <EmployeeTab />
                        </>
                }
                </ThemeContext.Provider>
            </div>
        );
    }
}


export default Login;