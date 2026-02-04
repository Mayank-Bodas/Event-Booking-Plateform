import { useAuth } from "react-oidc-context";
import { useEffect, useState } from "react";
import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

const DashboardTicketTypes = () => {
    const { user } = useAuth();
    const [ticketTypes, setTicketTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user?.access_token) return;

        setIsLoading(true);
        fetch("http://localhost:8080/api/v1/organizers/ticket-sales", {
            headers: {
                Authorization: `Bearer ${user.access_token}`,
            },
        })
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error("Failed to fetch ticket types");
            })
            .then((data) => setTicketTypes(data))
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false));
    }, [user?.access_token]);

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

            <div className="max-w-6xl mx-auto px-4">
                <div className="py-8 px-4">
                    {/* Header with Back Button */}
                    <div className="flex items-center gap-4 mb-6">
                        <Link to="/dashboard">
                            <Button className="bg-gray-700 hover:bg-gray-600">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Ticket Types</h1>
                            <p className="text-gray-400 mt-1">
                                Manage all ticket types across your events
                            </p>
                        </div>
                    </div>

                    {/* Table Card */}
                    {ticketTypes.length === 0 ? (
                        <Card className="bg-gray-900 border-gray-700">
                            <CardContent className="p-12 text-center">
                                <p className="text-white text-lg">No ticket types configured yet</p>
                                <p className="text-sm text-gray-300 mt-2">
                                    Create an event and add ticket types to see them here
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="bg-gray-900 border-gray-700 overflow-hidden">
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-white">All Ticket Types</h3>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-800 border-b border-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Event
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Ticket Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                    Price
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                    Available
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                    Sold
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                    % Sold
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {ticketTypes.map((ticket) => {
                                                const percentSold = ticket.totalAvailable > 0
                                                    ? ((ticket.sold / ticket.totalAvailable) * 100).toFixed(1)
                                                    : "0.0";
                                                return (
                                                    <tr key={`${ticket.eventId}-${ticket.ticketTypeId}`} className="hover:bg-gray-800/50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                                            {ticket.eventName}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                            {ticket.ticketTypeName}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-semibold">
                                                            ${ticket.price.toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                            {ticket.available}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                            {ticket.sold}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${parseFloat(percentSold) >= 80 ? 'bg-red-900/50 text-red-300' :
                                                                parseFloat(percentSold) >= 50 ? 'bg-yellow-900/50 text-yellow-300' :
                                                                    'bg-green-900/50 text-green-300'
                                                                }`}>
                                                                {percentSold}%
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardTicketTypes;
