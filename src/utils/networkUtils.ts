
import NetInfo from "@react-native-community/netinfo";

export const checkInternet = async (): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  } catch (error) {
    Console.log("Internet check error:", error);
    return false;
  }
};
