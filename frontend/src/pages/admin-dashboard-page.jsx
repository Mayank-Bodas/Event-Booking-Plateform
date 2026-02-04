import NavBar from "@/components/nav-bar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, Calendar, FileText, File } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router";
import { useRoles } from "@/hooks/use-roles";

const AdminDashboardPage = () => {
    const { user } = useAuth();
    const { isAdmin, isLoading: isRolesLoading } = useRoles();
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user?.access_token) return;

        fetch("http://localhost:8080/api/v1/admin/stats", {
            headers: {
                Authorization: `Bearer ${user.access_token}`,
            },
        })
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error("Failed to fetch admin stats");
            })
            .then((data) => setStats(data))
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false));
    }, [user?.access_token]);

    if (isRolesLoading) return null;
    if (!isAdmin) return <Navigate to="/" replace />;

    if (isLoading) {
        return (
            <div className="bg-black min-h-screen text-white">
                <NavBar />
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen text-white">
            <NavBar />

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-gray-400 mt-1">System Overview</p>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/admin/users">
                            <Button variant="outline" className="border-gray-700 text-black hover:bg-gray-800 hover:text-white">
                                Manage Users
                            </Button>
                        </Link>
                        <Link to="/admin/events">
                            <Button variant="outline" className="border-gray-700 text-black hover:bg-gray-800 hover:text-white">
                                Manage Events
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gray-900 border-gray-700 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <h3 className="text-sm font-medium text-white">Total Users</h3>
                            <Users className="h-5 w-5 text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">
                                {stats?.totalUsers || 0}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-900 border-gray-700 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <h3 className="text-sm font-medium text-white">Total Events</h3>
                            <Calendar className="h-5 w-5 text-green-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">
                                {stats?.totalEvents || 0}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-900 border-gray-700 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <h3 className="text-sm font-medium text-white">Published</h3>
                            <FileText className="h-5 w-5 text-purple-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">
                                {stats?.totalPublishedEvents || 0}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-900 border-gray-700 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <h3 className="text-sm font-medium text-white">Drafts</h3>
                            <File className="h-5 w-5 text-yellow-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">
                                {stats?.totalDraftEvents || 0}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
