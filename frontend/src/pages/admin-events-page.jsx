import NavBar from "@/components/nav-bar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useRoles } from "@/hooks/use-roles";

const AdminEventsPage = () => {
    const { user } = useAuth();
    const { isAdmin, isLoading: isRolesLoading } = useRoles();
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user?.access_token) return;

        fetch("http://localhost:8080/api/v1/admin/events", {
            headers: {
                Authorization: `Bearer ${user.access_token}`,
            },
        })
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error("Failed to fetch events");
            })
            .then((data) => setEvents(data.content || []))
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
                <div className="flex items-center gap-4 mb-6">
                    <Link to="/admin/dashboard">
                        <Button className="bg-gray-700 hover:bg-gray-600">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">All Events</h1>
                    </div>
                </div>

                <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-700">
                                <TableHead className="text-gray-400">Name</TableHead>
                                <TableHead className="text-gray-400">Venue</TableHead>
                                <TableHead className="text-gray-400">Date</TableHead>
                                <TableHead className="text-gray-400">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.map((e) => (
                                <TableRow key={e.id} className="border-gray-700">
                                    <TableCell className="font-medium">{e.name}</TableCell>
                                    <TableCell>{e.venue}</TableCell>
                                    <TableCell>{new Date(e.start).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded text-xs ${e.status === 'PUBLISHED' ? 'bg-green-900 text-green-300' :
                                            e.status === 'DRAFT' ? 'bg-yellow-900 text-yellow-300' : 'bg-gray-800 text-gray-400'
                                            }`}>
                                            {e.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {events.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">No events found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default AdminEventsPage;
