import config from "./config";

export const dataService = {
    authToken,
    getAllProducts,
    createProduct,
    uploadVideo,
    editProduct,
    deleteProduct
};



function authToken(username, password) {
    let formdata = new FormData();
        formdata.append("username", username);
        formdata.append("password", password);

    const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    return fetch(config.apiUrl + '/products/api-token-auth/', requestOptions)
        .then((res) => res.json()).then((result) => {
            console.log(result)
            return result;
        });
}
function getAllProducts(formdata) {
    const requestOptions = {
        method: 'POST',
        // headers: {
        //     'Content-Type': 'multipart/form-data',
        //     'Authorization': "Token " + token,
        // }
        body: formdata,
        redirect: 'follow'
    };

    return fetch(config.apiUrl2 + '/get_records', requestOptions)
        .then((res) => res.json()).then((result) => {
            return result;
        });
}
function editProduct(token, id, formdata) {
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Authorization': "Token " + token,
        },
        body: formdata
    };

    return fetch(config.apiUrl + '/products/api/' + id, requestOptions)
        .then((res) => res.json()).then((result) => {
            return result;
        });
}
function deleteProduct(formdata) {
    const requestOptions = {
        method: 'POST',
        // headers: {
        //     'Authorization': "Token " + token,
        // }
        body: formdata,
        redirect: 'follow' 
    };
    return fetch(config.apiUrl2 + '/delete_image', requestOptions)
        .then((res) => res.json()).then((result) => {
            return result;
        });
}
function createProduct(formdata) {
    const requestOptions = {
        method: 'POST',
        // headers: {
        //     'Authorization': "Token " + token,
        // },
        body: formdata,
        redirect: 'follow'
    };
    return fetch(config.apiUrl2+'/register', requestOptions)
        .then((res) => res.json()).then((result) => {
            return result;
        });
}
function uploadVideo(formdata) {
    const requestOptions = {
        method: 'POST', 
        body: formdata,
        redirect: 'follow'
    };
    return fetch(config.apiUrl2+'/ipcam', requestOptions)
        .then((res) => res).then((result) => {
            return result;
        });
}

