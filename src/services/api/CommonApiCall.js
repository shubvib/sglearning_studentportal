// import { Network } from '../network/Network';
import { UrlConfig } from '../../config';
import Api from './Api';
import CommonFunctions from '../../utils/CommonFunctions';
import { toast } from 'react-toastify';
/***common api call here, which is used to check at multiple places
 *  to do: use this function when using separate account and branches array(support admin loginOnly)
 * 
 */

const loginWithGoogle = (tokenId) => {
    return new Promise((resolve, reject) => {
        Api.postApi(UrlConfig.apiUrls.loginWithGoogle, { providerToken: tokenId })
            .then((response) => {
                const { data } = response;
                if (data && data.length > 0) {
                    const userSet = CommonFunctions.setUserAccountDetails(data);
                    if (userSet) {
                        // history.push(UrlConfig.routeUrls.dashboard);
                        resolve(response);
                    } else {
                        const errorMessage = 'Something went wrong'
                        toast(errorMessage, {
                            type: "error",
                        });
                    }
                }
            })
            .catch(error => {
                reject(error);
            })
    });
}


const getClientSecreteKey = (payload) => {
    console.log('payload', payload);
    return new Promise((resolve, reject) => {
        Api.postApi(UrlConfig.apiUrls.getClientSecreteKey, payload)
            .then((response) => {
                console.log('response', response);
                const { data } = response;
                resolve(response);
            })
            .catch(error => {
                console.log('error', error);
                reject(error)
            })
    });
}
export default {
    loginWithGoogle,
    getClientSecreteKey
}