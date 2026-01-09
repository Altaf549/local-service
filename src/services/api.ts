import axios from '../network/axiosConfig';
import {API_ENDPOINTS} from '../constant/ApiEndpoints';
import {HomeData, HomeApiResponse, ServiceCategory, PujaType, Service, ServiceWithServicemen, Puja, Serviceman, Brahman} from '../types/home';

export type {
  Banner,
  ServiceCategory,
  Service,
  ServiceWithServicemen,
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

export const getServiceCategories = async (): Promise<ServiceCategory[]> => {
  try {
    const response = await axios.get<{success: boolean; data: ServiceCategory[]}>(API_ENDPOINTS.SERVICE_CATEGORIES);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch service categories');
  } catch (error) {
    throw error;
  }
};

export const getServiceCategoryDetails = async (id: number): Promise<ServiceCategory> => {
  try {
    const response = await axios.get<{success: boolean; data: ServiceCategory}>(`${API_ENDPOINTS.SERVICE_CATEGORY_DETAILS}/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch service category details');
  } catch (error) {
    throw error;
  }
};

export const getServices = async (): Promise<Service[]> => {
  try {
    const response = await axios.get<{success: boolean; data: Service[]}>(API_ENDPOINTS.SERVICES);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch services');
  } catch (error) {
    throw error;
  }
};

export const getServiceDetails = async (id: number): Promise<ServiceWithServicemen> => {
  try {
    const response = await axios.get<{success: boolean; data: ServiceWithServicemen}>(`${API_ENDPOINTS.SERVICE_DETAILS}/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch service details');
  } catch (error) {
    throw error;
  }
};

export const getPujaTypes = async (): Promise<PujaType[]> => {
  try {
    const response = await axios.get<{success: boolean; data: PujaType[]}>(API_ENDPOINTS.PUJA_TYPES);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch puja types');
  } catch (error) {
    throw error;
  }
};

export const getPujaTypeDetails = async (id: number): Promise<PujaType> => {
  try {
    const response = await axios.get<{success: boolean; data: PujaType}>(`${API_ENDPOINTS.PUJA_TYPE_DETAILS}/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch puja type details');
  } catch (error) {
    throw error;
  }
};

export const getPujas = async (): Promise<Puja[]> => {
  try {
    const response = await axios.get<{success: boolean; data: Puja[]}>(API_ENDPOINTS.PUJAS);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch pujas');
  } catch (error) {
    throw error;
  }
};

export const getPujaDetails = async (id: number): Promise<any> => {
  try {
    const response = await axios.get<{success: boolean; data: any}>(`${API_ENDPOINTS.PUJA_DETAILS}/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch puja details');
  } catch (error) {
    throw error;
  }
};

export const getServicemen = async (): Promise<Serviceman[]> => {
  try {
    const response = await axios.get<{success: boolean; data: Serviceman[]}>(API_ENDPOINTS.SERVICEMEN);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch servicemen');
  } catch (error) {
    throw error;
  }
};

export const getServicemanDetails = async (id: number): Promise<any> => {
  try {
    const response = await axios.get<{success: boolean; data: any}>(`${API_ENDPOINTS.SERVICEMEN}/details/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch serviceman details');
  } catch (error) {
    throw error;
  }
};

export const getBrahmans = async (): Promise<Brahman[]> => {
  try {
    const response = await axios.get<{success: boolean; data: Brahman[]}>(API_ENDPOINTS.BRAHMANS);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch brahmans');
  } catch (error) {
    throw error;
  }
};

export const getBrahmanDetails = async (id: number): Promise<any> => {
  try {
    const response = await axios.get<{success: boolean; data: any}>(`${API_ENDPOINTS.BRAHMANS}/details/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch brahman details');
  } catch (error) {
    throw error;
  }
};

