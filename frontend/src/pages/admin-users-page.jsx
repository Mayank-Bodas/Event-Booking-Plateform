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

const AdminUsersPage = () => {
    const { user } = useAuth();
    const { isAdmin, isLoading: isRolesLoading } = useRoles();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user?.access_token) return;

        fetch("http://localhost:8080/api/v1/admin/users", {
            headers: {
                Authorization: `Bearer ${user.access_token}`,
            },
        })
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error("Failed to fetch users");
            })
            .then((data) => setUsers(data.content || []))
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
                        <h1 className="text-3xl font-bold">Registered Users</h1>
                    </div>
                </div>

                <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-700">
                                <TableHead className="text-gray-400">ID</TableHead>
                                <TableHead className="text-gray-400">Name</TableHead>
                                <TableHead className="text-gray-400">Email</TableHead>
                                <TableHead className="text-gray-400">Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((u) => (
                                <TableRow key={u.id} className="border-gray-700">
                                    <TableCell className="font-mono text-xs">{u.id}</TableCell>
                                    <TableCell>{u.name}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>{new Date(u.createdAt).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                            {users.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">No users found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsersPage;
