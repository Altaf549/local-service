import axios from '../network/axiosConfig';
import {API_ENDPOINTS} from '../constant/ApiEndpoints';
import {HomeData, HomeApiResponse, ServiceCategory, PujaType, Service, ServiceWithServicemen, Puja, Serviceman, Brahman} from '../types/home';
import {ImagePickerResult} from '../utils/imagePicker';

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

// Login API functions
export const userLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post(API_ENDPOINTS.USER_LOGIN, {
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const servicemanLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post(API_ENDPOINTS.SERVICEMAN_LOGIN, {
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const brahmanLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post(API_ENDPOINTS.BRAHMAN_LOGIN, {
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(API_ENDPOINTS.LOGOUT);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Registration API functions
export const userRegister = async (name: string, email: string, mobile_number: string, password: string) => {
  try {
    const response = await axios.post(API_ENDPOINTS.USER_REGISTER, {
      name,
      email,
      mobile_number,
      password
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const servicemanRegister = async (name: string, email: string, mobile_number: string, password: string) => {
  try {
    const response = await axios.post(API_ENDPOINTS.SERVICEMAN_REGISTER, {
      name,
      email,
      mobile_number,
      password
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const brahmanRegister = async (name: string, email: string, mobile_number: string, password: string) => {
  try {
    const response = await axios.post(API_ENDPOINTS.BRAHMAN_REGISTER, {
      name,
      email,
      mobile_number,
      password
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// User Profile Update API function
export const updateUserProfile = async (profileData: {
  current_password: string;
  name?: string;
  email?: string;
  mobile_number?: string;
  address?: string;
  new_password?: string;
  profile_photo?: ImagePickerResult;
}) => {
  try {
    const formData = new FormData();
    
    // Add required field
    formData.append('current_password', profileData.current_password);
    
    // Add optional fields only if they exist
    if (profileData.name) formData.append('name', profileData.name);
    if (profileData.email) formData.append('email', profileData.email);
    if (profileData.mobile_number) formData.append('mobile_number', profileData.mobile_number);
    if (profileData.address) formData.append('address', profileData.address);
    if (profileData.new_password) formData.append('new_password', profileData.new_password);
    if (profileData.profile_photo) {
      formData.append('profile_photo', {
        uri: profileData.profile_photo.uri,
        type: profileData.profile_photo.type || 'image/jpeg',
        name: profileData.profile_photo.fileName || 'profile_photo.jpg',
      } as any);
    }
    
    const response = await axios.post(API_ENDPOINTS.USER_PROFILE_UPDATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

