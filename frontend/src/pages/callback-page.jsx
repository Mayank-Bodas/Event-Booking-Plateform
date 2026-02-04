import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
import { useRoles } from "@/hooks/use-roles";

const CallbackPage = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { isLoading: isRolesLoading, isOrganizer, isStaff, isAdmin } = useRoles();

  useEffect(() => {
    if (isLoading || isRolesLoading) {
      return;
    }

    if (isAuthenticated) {
      const redirectPath = localStorage.getItem("redirectPath");
      if (redirectPath) {
        localStorage.removeItem("redirectPath");
        navigate(redirectPath);
      } else if (isAdmin) {
        navigate("/admin/dashboard");
      } else if (isOrganizer) {
        navigate("/organizers");
      } else if (isStaff) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [isLoading, isRolesLoading, isAuthenticated, isOrganizer, isStaff, isAdmin, navigate]);

  if (isLoading) {
    return <p>Processing login...</p>;
  }

  return <p>Completing login...</p>;
};

export default CallbackPage;
