import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { jwtDecode } from "jwt-decode";

export const useRoles = () => {
  const { isLoading: isAuthLoading, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [isAttendee, setIsAttendee] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    if (isAuthLoading || !user?.access_token) {
      setRoles([]);
      setIsOrganizer(false);
      setIsAttendee(false);
      setIsStaff(false);
      setIsAdmin(false);
      setIsLoading(isAuthLoading);
      return;
    }

    try {
      const payload = jwtDecode(user?.access_token);
      console.log("useRoles: Token Payload", payload);
      const allRoles = payload.realm_access?.roles || [];
      console.log("useRoles: All Roles", allRoles);

      const filteredRoles = allRoles;
      console.log("useRoles: Filtered Roles", filteredRoles);
      setRoles(filteredRoles);
      setIsOrganizer(filteredRoles.includes("ROLE_ORGANIZER") || filteredRoles.includes("ORGANIZER"));
      setIsAttendee(filteredRoles.includes("ROLE_ATTENDEE") || filteredRoles.includes("ATTENDEE"));
      setIsStaff(filteredRoles.includes("ROLE_STAFF") || filteredRoles.includes("STAFF"));
      setIsAdmin(filteredRoles.includes("ROLE_ADMIN") || filteredRoles.includes("ADMIN"));
    } catch (error) {
      console.error("Error parsing JWT: " + error);
      setRoles([]);
      setIsOrganizer(false);
      setIsAttendee(false);
      setIsStaff(false);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthLoading, user?.access_token]);

  return {
    isLoading,
    roles,
    isOrganizer,
    isAttendee,
    isStaff,
    isAdmin,
  };
};
