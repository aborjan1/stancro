
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if this is an email confirmation redirect
    const isEmailConfirmation = location.hash.includes('type=signup') || 
                               location.hash.includes('type=recovery') ||
                               location.hash.includes('access_token');

    if (isEmailConfirmation) {
      // Show success toast
      toast({
        title: "Email confirmed successfully",
        description: "Your email has been confirmed. Welcome to StanCro!",
      });
      
      // Redirect to home page
      navigate("/");
    } else {
      // Log regular 404 errors
      console.error(
        "404 Error: User attempted to access non-existent route:",
        location.pathname
      );
    }
  }, [location.pathname, location.hash, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
