import axios from '../network/axiosConfig';
import {API_ENDPOINTS} from '../constant/ApiEndpoints';
import {HomeData, HomeApiResponse, ServiceCategory, PujaType, Service, ServiceWithServicemen, Puja, Serviceman, Brahman} from '../types/home';
import {ImagePickerResult} from '../utils/imagePicker';
import Console from '../utils/Console';

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

// Delete Account API function
export const deleteAccount = async () => {
  try {
    const response = await axios.delete(API_ENDPOINTS.DELETE_ACCOUNT);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Booking API functions
export const createServiceBooking = async (bookingData: {
  service_id: number;
  serviceman_id: number;
  booking_date: string;
  booking_time: string;
  address: string;
  mobile_number: string;
  notes?: string;
}) => {
  try {
    const response = await axios.post(API_ENDPOINTS.SERVICE_BOOKING, bookingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPujaBooking = async (bookingData: {
  puja_id: number;
  brahman_id: number;
  booking_date: string;
  booking_time: string;
  address: string;
  mobile_number: string;
  notes?: string;
}) => {
  try {
    const response = await axios.post(API_ENDPOINTS.PUJA_BOOKING, bookingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserBookings = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.BOOKINGS);
    if (response.data.success) {
      return response.data;
    }
    throw new Error('Failed to fetch bookings');
  } catch (error) {
    throw error;
  }
};

export const getAllBookings = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.ADMIN_BOOKINGS);
    if (response.data.success) {
      return response.data;
    }
    throw new Error('Failed to fetch all bookings');
  } catch (error) {
    throw error;
  }
};

export const getBookingDetails = async (id: number) => {
  try {
    Console.log("Fetching booking details for ID:", id);
    const response = await axios.get(`${API_ENDPOINTS.BOOKINGS}/${id}`);
    if (response.data.success) {
      return response.data;
    }
    throw new Error('Failed to fetch booking details');
  } catch (error) {
    throw error;
  }
};

export const updateBooking = async (id: number, bookingData: {
  booking_date?: string;
  booking_time?: string;
  address?: string;
  mobile_number?: string;
  notes?: string;
}) => {
  try {
    const response = await axios.put(`${API_ENDPOINTS.BOOKINGS}/${id}`, bookingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Serviceman Profile Update API function
export const updateServicemanProfile = async (profileData: {
  government_id: string;
  id_proof_image?: ImagePickerResult;
  address: string;
  profile_photo?: ImagePickerResult;
}) => {
  try {
    const formData = new FormData();
    
    // Add required fields
    formData.append('government_id', profileData.government_id);
    formData.append('address', profileData.address);
    
    // Add optional files
    if (profileData.id_proof_image) {
      formData.append('id_proof_image', {
        uri: profileData.id_proof_image.uri,
        type: profileData.id_proof_image.type || 'image/jpeg',
        name: profileData.id_proof_image.fileName || 'id_proof_image.jpg',
      } as any);
    }
    
    if (profileData.profile_photo) {
      formData.append('profile_photo', {
        uri: profileData.profile_photo.uri,
        type: profileData.profile_photo.type || 'image/jpeg',
        name: profileData.profile_photo.fileName || 'profile_photo.jpg',
      } as any);
    }
    
    const response = await axios.post(API_ENDPOINTS.SERVICEMAN_PROFILE_UPDATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Serviceman Profile Data API function
export const getServicemanProfileData = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.SERVICEMAN_PROFILE_DATA);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Brahman Profile Update API function
export const updateBrahmanProfile = async (profileData: {
  government_id: string;
  id_proof_image?: ImagePickerResult;
  address: string;
  profile_photo?: ImagePickerResult;
}) => {
  try {
    const formData = new FormData();
    
    // Add required fields
    formData.append('government_id', profileData.government_id);
    formData.append('address', profileData.address);
    
    // Add optional files
    if (profileData.id_proof_image) {
      formData.append('id_proof_image', {
        uri: profileData.id_proof_image.uri,
        type: profileData.id_proof_image.type || 'image/jpeg',
        name: profileData.id_proof_image.fileName || 'id_proof_image.jpg',
      } as any);
    }
    
    if (profileData.profile_photo) {
      formData.append('profile_photo', {
        uri: profileData.profile_photo.uri,
        type: profileData.profile_photo.type || 'image/jpeg',
        name: profileData.profile_photo.fileName || 'profile_photo.jpg',
      } as any);
    }
    
    const response = await axios.post(API_ENDPOINTS.BRAHMAN_PROFILE_UPDATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Brahman Profile Data API function
export const getBrahmanProfileData = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.BRAHMAN_PROFILE_DATA);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Serviceman Status API function
export const getServicemanStatus = async (id: number) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.SERVICEMAN_STATUS}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Brahman Status API function
export const getBrahmanStatus = async (id: number) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.BRAHMAN_STATUS}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelBooking = async (id: number, cancellationReason?: string) => {
  try {
    const response = await axios.put(`${API_ENDPOINTS.BOOKINGS}/cancel/${id}`, {
      cancellation_reason: cancellationReason
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const acceptBooking = async (id: number) => {
  try {
    const response = await axios.put(`${API_ENDPOINTS.BOOKING_ACCEPT}/${id}`, {});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const completeBooking = async (id: number) => {
  try {
    const response = await axios.put(`${API_ENDPOINTS.BOOKING_COMPLETE}/${id}`, {});
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Service Prices API functions
export const getAllServicePrices = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.SERVICE_PRICES_ALL);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch service prices');
  } catch (error) {
    throw error;
  }
};

// Puja Prices API functions
export const getAllPujaPrices = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.PUJA_PRICES_ALL);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch puja prices');
  } catch (error) {
    throw error;
  }
};

// Update Service Price API function
export const addServicePrice = async (serviceId: number, price: string) => {
  try {
    const response = await axios.post(`${API_ENDPOINTS.SERVICE_PRICE_ADD}/${serviceId}`, {
      price
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update existing Service Price API function
export const updateServicePrice = async (serviceId: number, price: string) => {
  try {
    const response = await axios.put(`${API_ENDPOINTS.SERVICE_PRICE_UPDATE}/${serviceId}`, {
      price
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete Service Price API function
export const deleteServicePrice = async (serviceId: number) => {
  try {
    const response = await axios.delete(`${API_ENDPOINTS.SERVICE_PRICE_UPDATE}/${serviceId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update Puja Price API function
export const addPujaPrice = async (pujaId: number, price: string, materialFile?: any) => {
  try {
    const formData = new FormData();
    formData.append('price', price);
    
    if (materialFile) {
      formData.append('material_file', {
        uri: materialFile.uri,
        type: materialFile.type || 'application/pdf',
        name: materialFile.fileName || 'material_file.pdf',
      } as any);
    }
    
    const response = await axios.post(`${API_ENDPOINTS.PUJA_PRICE_ADD}/${pujaId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update existing Puja Price API function
export const updatePujaPrice = async (pujaId: number, price: string, materialFile?: any) => {
  try {
    const formData = new FormData();
    formData.append('price', price);
    
    if (materialFile) {
      formData.append('material_file', {
        uri: materialFile.uri,
        type: materialFile.type || 'application/pdf',
        name: materialFile.fileName || 'material_file.pdf',
      } as any);
    }
    
    const response = await axios.put(`${API_ENDPOINTS.PUJA_PRICE_UPDATE}/${pujaId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete Puja Price API function
export const deletePujaPrice = async (pujaId: number) => {
  try {
    const response = await axios.delete(`${API_ENDPOINTS.PUJA_PRICE_UPDATE}/${pujaId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Serviceman Experience API functions
export const getServicemanExperiences = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.SERVICEMAN_EXPERIENCES);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch serviceman experiences');
  } catch (error) {
    throw error;
  }
};

export const addServicemanExperience = async (experienceData: any) => {
  try {
    const response = await axios.post(API_ENDPOINTS.SERVICEMAN_EXPERIENCE_ADD, experienceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateServicemanExperience = async (id: number, experienceData: any) => {
  try {
    const response = await axios.put(`${API_ENDPOINTS.SERVICEMAN_EXPERIENCE_UPDATE}/${id}`, experienceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteServicemanExperience = async (experienceId: number) => {
  try {
    const response = await axios.delete(`${API_ENDPOINTS.SERVICEMAN_EXPERIENCE_UPDATE}/${experienceId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Brahman Experience API functions
export const getBrahmanExperiences = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.BRAHMAN_EXPERIENCES);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch brahman experiences');
  } catch (error) {
    throw error;
  }
};

export const addBrahmanExperience = async (experienceData: any) => {
  try {
    const response = await axios.post(API_ENDPOINTS.BRAHMAN_EXPERIENCE_ADD, experienceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBrahmanExperience = async (id: number, experienceData: any) => {
  try {
    const response = await axios.put(`${API_ENDPOINTS.BRAHMAN_EXPERIENCE_UPDATE}/${id}`, experienceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBrahmanExperience = async (experienceId: number) => {
  try {
    const response = await axios.delete(`${API_ENDPOINTS.BRAHMAN_EXPERIENCE_UPDATE}/${experienceId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Achievement API functions
export const getServicemanAchievements = async (): Promise<any[]> => {
  try {
    const response = await axios.get<{success: boolean; data: any[]}>(API_ENDPOINTS.SERVICEMAN_ACHIEVEMENTS);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch serviceman achievements');
  } catch (error) {
    throw error;
  }
};

export const addServicemanAchievement = async (achievementData: any) => {
  try {
    const response = await axios.post(API_ENDPOINTS.SERVICEMAN_ACHIEVEMENT_ADD, achievementData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateServicemanAchievement = async (id: number, achievementData: any) => {
  try {
    const response = await axios.put(`${API_ENDPOINTS.SERVICEMAN_ACHIEVEMENT_UPDATE}/${id}`, achievementData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteServicemanAchievement = async (achievementId: number) => {
  try {
    const response = await axios.delete(`${API_ENDPOINTS.SERVICEMAN_ACHIEVEMENT_UPDATE}/${achievementId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBrahmanAchievements = async (): Promise<any[]> => {
  try {
    const response = await axios.get<{success: boolean; data: any[]}>(API_ENDPOINTS.BRAHMAN_ACHIEVEMENTS);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch brahman achievements');
  } catch (error) {
    throw error;
  }
};

export const addBrahmanAchievement = async (achievementData: any) => {
  try {
    const response = await axios.post(API_ENDPOINTS.BRAHMAN_ACHIEVEMENT_ADD, achievementData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBrahmanAchievement = async (id: number, achievementData: any) => {
  try {
    const response = await axios.put(`${API_ENDPOINTS.BRAHMAN_ACHIEVEMENT_UPDATE}/${id}`, achievementData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBrahmanAchievement = async (achievementId: number) => {
  try {
    const response = await axios.delete(`${API_ENDPOINTS.BRAHMAN_ACHIEVEMENT_UPDATE}/${achievementId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

