import config from "./config";

export const dataService = {
    authToken,
    getAllProducts,
    createProduct,
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
function getAllProducts(token) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': "Token " + token,
        }
    };

    return fetch(config.apiUrl + '/products/api', requestOptions)
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
function deleteProduct(token, id) {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Authorization': "Token " + token,
        }
    };
    return fetch(config.apiUrl + '/products/api/delete?id=' + id, requestOptions)
        .then((res) => res.json()).then((result) => {
            return result;
        });
}
function createProduct(token, formdata) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': "Token " + token,
        },
        body: formdata
    };
    return fetch(config.apiUrl + '/products/api/create', requestOptions)
        .then((res) => res.json()).then((result) => {
            return result;
        });
}
