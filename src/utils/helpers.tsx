import toast from "react-hot-toast";
import { RiCloseCircleFill } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

export const showSuccess = (message = "Success", timeout = 4000) => {
  toast(message, {
    id: "success-toast",
    position: "top-center",
    icon: (
      <FaCheckCircle color="#4ade80" size={22} className=" text-green-400" />
    ),
    className:
      "text-xs sm:text-sm leading-5 font-medium text-green-600 bg-green-50 lg:max-w-md 2xl:max-w-lg",
    duration: timeout,
  });
};

export const showError = (error: string, timeout = 4000) => {
  toast(error, {
    id: "error-toast",
    position: "top-center",
    icon: <RiCloseCircleFill size={22} className=" text-red-500" />,
    className:
      "text-xs sm:text-sm leading-5 font-medium text-red-600 bg-red-100 lg:max-w-md 2xl:max-w-lg",
    duration: timeout,
  });
};

export const showLoading = (message: string, timeout = 4000) => {
  toast(message, {
    id: "error-loading",
    position: "top-center",
    icon: <ClipLoader size={22} className="h-8 text-red-500" />,
    className:
      "text-xs sm:text-sm leading-5 font-medium text-red-600 bg-red-100 lg:max-w-md 2xl:max-w-lg",
    duration: timeout,
  });
};

export const showInfo = (message: string, timeout = 4000) => {
  toast(message, {
    style: { backgroundColor: "#5660ea" },
    className: "text-xs sm:text-sm leading-5 font-medium",
    duration: timeout,
  });
};
