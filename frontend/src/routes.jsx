import { createBrowserRouter } from "react-router";
import AttendeeLandingPage from "./pages/attendee-landing-page";
import CallbackPage from "./pages/callback-page";
import LoginPage from "./pages/login-page";
import SignupPage from "./pages/signup-page";
import PublishedEventsPage from "./pages/published-events-page";
import PurchaseTicketPage from "./pages/purchase-ticket-page";
import OrganizersLandingPage from "./pages/organizers-landing-page";
import DashboardPage from "./pages/dashboard-page";
import DashboardListEventsPage from "./pages/dashboard-list-events-page";
import DashboardListTickets from "./pages/dashboard-list-tickets";
import DashboardViewTicketPage from "./pages/dashboard-view-ticket-page";
import DashboardValidateQrPage from "./pages/dashboard-validate-qr-page";
import DashboardTicketSales from "./pages/dashboard-ticket-sales-page";
import DashboardTicketTypes from "./pages/dashboard-ticket-types-page";
import DashboardReports from "./pages/dashboard-reports-page";
import DashboardManageEventPage from "./pages/dashboard-manage-event-page";
import AdminDashboardPage from "./pages/admin-dashboard-page";
import AdminUsersPage from "./pages/admin-users-page";
import AdminEventsPage from "./pages/admin-events-page";
import ProtectedRoute from "./components/protected-route";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: AttendeeLandingPage,
    },
    {
        path: "/callback",
        Component: CallbackPage,
    },
    {
        path: "/login",
        Component: LoginPage,
    },
    {
        path: "/signup",
        Component: SignupPage,
    },
    {
        path: "/events/:id",
        Component: PublishedEventsPage,
    },
    {
        path: "/events/:eventId/purchase/:ticketTypeId",
        element: (
            <ProtectedRoute>
                <PurchaseTicketPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/organizers",
        Component: OrganizersLandingPage,
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <DashboardPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/events",
        element: (
            <ProtectedRoute>
                <DashboardListEventsPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/tickets",
        element: (
            <ProtectedRoute>
                <DashboardListTickets />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/tickets/:id",
        element: (
            <ProtectedRoute>
                <DashboardViewTicketPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/validate-qr",
        element: (
            <ProtectedRoute>
                <DashboardValidateQrPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/ticket-sales",
        element: (
            <ProtectedRoute>
                <DashboardTicketSales />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/ticket-types",
        element: (
            <ProtectedRoute>
                <DashboardTicketTypes />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/reports",
        element: (
            <ProtectedRoute>
                <DashboardReports />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/events/create",
        element: (
            <ProtectedRoute>
                <DashboardManageEventPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/events/update/:id",
        element: (
            <ProtectedRoute>
                <DashboardManageEventPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/admin/dashboard",
        element: (
            <ProtectedRoute>
                <AdminDashboardPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/admin/users",
        element: (
            <ProtectedRoute>
                <AdminUsersPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/admin/events",
        element: (
            <ProtectedRoute>
                <AdminEventsPage />
            </ProtectedRoute>
        ),
    },
]);
