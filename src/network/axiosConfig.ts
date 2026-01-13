
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../redux/store';
import { clearUserData, setIsUser } from '../redux/slices/userSlice';
import Console from '../utils/Console';
const LogColors: any = {
    default: null,
    black: 30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    magenta: 35,
    cyan: 36,
    white: 37,
    grey: 90,
    redBright: 91,
    greenBright: 92,
    yellowBright: 93,
    blueBright: 94,
    magentaBright: 95,
    cyanBright: 96,
    whiteBright: 97,
};
export const MAIN_URL = 'http://192.168.1.36:8000'
export const DEV_URL = '/api';
// export const PRODUCTION_URL = '';



// @info chnage to prod url before release
export const BASE_URL = MAIN_URL + DEV_URL;

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axios.interceptors.request.use(
    request => {
        Console.log(`\x1b[${LogColors.blue}m%s\x1b[0m`, 'Starting Request -- ');
        Console.log('headers : ', JSON.stringify(request.headers));
        Console.log(
            'url : ',
            `\x1b[${95}m${JSON.stringify(request.baseURL + '' + request.url)}\x1b[0m`,
        );
        Console.log('method : ', JSON.stringify(request.method));
        Console.log('data : ', JSON.stringify(request.data));
        return request;
    },
    error => {
        Console.log(`\x1b[${31}m%s\x1b[0m`, 'request error');
        Console.log(
            `\x1b[${91}m%s\x1b[0m`,
            JSON.stringify(error.name),
            'error msg : ',
            JSON.stringify(error.message),
        );
        return Promise.reject(error);
    },
);

axios.interceptors.response.use(
    
    response => {
        if (response) {
            Console.log(`\x1b[${32}m%s\x1b[0m`, 'Response -- ', response.status);
            // console.log('Response :', JSON.stringify(response.data, null, 2));
        }
        return response;
    },
    // uncomment and createAsyncThunk error not caught
    error => {
        Console.log('errorData2', error.response.status)
        if (error) {
             Console.log(`\x1b[${31}m%s\x1b[0m`, 'response error', error);
            Console.log(
                `\x1b[${91}m%s\x1b[0m`,
                'error msg : ',
                JSON.stringify(
                    error.response.data.message || error.response.data.error,
                ),
            );
            if (error.response.status == 401 && error.response.data.type == undefined) {
                Console.log('errorData4', error)
                resetAppData();
            }
        }
        return Promise.reject(error);
    },
);

const resetAppData = async () => {
    const { dispatch } = store;
    
    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    // Clear AsyncStorage
    await AsyncStorage.removeItem('urser_token');
    await AsyncStorage.removeItem('user_info');
    Console.log('resetAppData called');
    dispatch(clearUserData());
    dispatch(setIsUser(false));
    
    
    // Navigate to Login screen
    // if (navigationRef.current && navigationRef.current.navigate) {
    //     // Reset user state
    //     dispatch(resetUser());
    //     navigationRef.current.navigate(ONBOARD);
    // }
};

export default axios;
