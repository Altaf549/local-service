import axios from '../network/axiosConfig';
import {API_ENDPOINTS} from '../constant/ApiEndpoints';
import {HomeData, HomeApiResponse} from '../types/home';

export type {
  Banner,
  ServiceCategory,
  Service,
  Serviceman,
  PujaType,
  Puja,
  Brahman,
  HomeData,
  HomeApiResponse,
} from '../types/home';

export const getHomeData = async (): Promise<HomeData> => {
  try {
    const response = await axios.get<HomeApiResponse>(API_ENDPOINTS.HOME);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch home data');
  } catch (error) {
    throw error;
  }
};

