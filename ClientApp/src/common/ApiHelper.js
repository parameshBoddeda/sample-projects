import Axios from 'axios';

Axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const webAPIURL = () => {
    let url = '/api';
    return url
};

const instance = Axios.create({
    withCredentials: false,
    baseURL: webAPIURL(),
})

export default class APIHelper {
    static apiUrl() {
        return webAPIURL();
    }

    static get(url, obj) {
        return new Promise((resolve, reject) => {
            instance
                .get(url, obj)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    static post(url, obj) {
        return new Promise((resolve, reject) => {
            instance
                .post(url, obj)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    static delete(url) {

        return new Promise((resolve, reject) => {
            instance
                .delete(url)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}