import { Button } from "@/components/ui/button";
import { useAuth } from "react-oidc-context";

import { Navigate, useNavigate } from "react-router";

const LoginPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  if (auth.isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-white" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black text-white relative">
      <Button
        variant="ghost"
        className="absolute top-4 left-4 text-gray-400 hover:text-white"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </Button>
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Log In</h1>
          <p className="mt-2 text-gray-400">
            Welcome to the Event Ticket Platform
          </p>
        </div>

        <div className="space-y-4">
          <Button
            className="w-full bg-white text-black hover:bg-gray-200 h-12 text-lg font-medium"
            onClick={() => auth.signinRedirect()}
          >
            Log In
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-gray-500">
                Or create an account
              </span>
            </div>
          </div>

          <Button
            className="w-full bg-transparent border border-gray-700 text-white hover:bg-gray-900 h-12 text-lg font-medium"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
