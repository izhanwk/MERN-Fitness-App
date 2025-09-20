import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const Alert = ({ 
  isOpen, 
  onClose, 
  type = "info", 
  title, 
  message, 
  duration = 5000,
  showCloseButton = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [isOpen, duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  const getAlertConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          bgColor: "bg-gradient-to-r from-green-500 to-emerald-600",
          borderColor: "border-green-400",
          textColor: "text-white",
          iconColor: "text-green-100"
        };
      case "error":
        return {
          icon: <AlertCircle className="w-6 h-6" />,
          bgColor: "bg-gradient-to-r from-red-500 to-red-600",
          borderColor: "border-red-400",
          textColor: "text-white",
          iconColor: "text-red-100"
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-6 h-6" />,
          bgColor: "bg-gradient-to-r from-yellow-500 to-orange-500",
          borderColor: "border-yellow-400",
          textColor: "text-white",
          iconColor: "text-yellow-100"
        };
      case "info":
      default:
        return {
          icon: <Info className="w-6 h-6" />,
          bgColor: "bg-gradient-to-r from-blue-500 to-purple-600",
          borderColor: "border-blue-400",
          textColor: "text-white",
          iconColor: "text-blue-100"
        };
    }
  };

  const config = getAlertConfig();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={showCloseButton ? handleClose : undefined}
      />
      
      {/* Alert Modal */}
      <div 
        className={`relative w-full max-w-md transform transition-all duration-300 ${
          isVisible 
            ? "scale-100 opacity-100 translate-y-0" 
            : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        <div className={`${config.bgColor} rounded-2xl shadow-2xl border-2 ${config.borderColor} overflow-hidden`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className={config.iconColor}>
                {config.icon}
              </div>
              <h3 className={`${config.textColor} font-bold text-lg`}>
                {title || (type === "success" ? "Success" : type === "error" ? "Error" : type === "warning" ? "Warning" : "Information")}
              </h3>
            </div>
            {showCloseButton && (
              <button
                onClick={handleClose}
                className={`${config.iconColor} hover:bg-white/20 rounded-full p-1 transition-colors duration-200`}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Content */}
          <div className="p-4">
            <p className={`${config.textColor} text-sm leading-relaxed`}>
              {message}
            </p>
          </div>
          
          {/* Footer */}
          <div className="px-4 pb-4">
            <button
              onClick={handleClose}
              className={`w-full ${config.textColor} bg-white/20 hover:bg-white/30 py-2 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02]`}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook for easy usage
export const useAlert = () => {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    duration: 5000
  });

  const showAlert = (message, type = "info", title = "", duration = 5000) => {
    setAlertState({
      isOpen: true,
      type,
      title,
      message,
      duration
    });
  };

  const hideAlert = () => {
    setAlertState(prev => ({ ...prev, isOpen: false }));
  };

  return {
    showAlert,
    hideAlert,
    Alert: () => (
      <Alert
        isOpen={alertState.isOpen}
        onClose={hideAlert}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        duration={alertState.duration}
      />
    )
  };
};

export default Alert;
