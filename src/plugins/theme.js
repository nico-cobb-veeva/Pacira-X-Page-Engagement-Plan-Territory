import { isOnline } from '@/lib/helper/commonUtils';
const THEME_CLASSES = {
  online: "online-theme",
  mobile: "mobile-device-theme",
};

const detectDeviceTheme = () => {
  return isOnline()
    ? "online"
    : "mobile";
};

export default {
  install() {
    const theme = detectDeviceTheme();
    document.documentElement.classList.add(THEME_CLASSES[theme]);
  },
};