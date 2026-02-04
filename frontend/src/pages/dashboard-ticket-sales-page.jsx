import { useAuth } from "react-oidc-context";
import { useEffect, useState } from "react";
import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

const DashboardTicketSales = () => {
    const { user } = useAuth();
    const [sales, setSales] = useState([]);
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
                throw new Error("Failed to fetch ticket sales");
            })
            .then((data) => setSales(data))
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
                            <h1 className="text-3xl font-bold">Ticket Sales</h1>
                            <p className="text-gray-400 mt-1">
                                View all ticket sales across your events
                            </p>
                        </div>
                    </div>

                    {/* Table Card */}
                    {sales.length === 0 ? (
                        <Card className="bg-gray-900 border-gray-700">
                            <CardContent className="p-12 text-center">
                                <p className="text-white text-lg">No ticket sales data available yet</p>
                                <p className="text-sm text-gray-300 mt-2">
                                    Sales data will appear here once tickets are sold
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="bg-gray-900 border-gray-700 overflow-hidden">
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-white">Sales Breakdown</h3>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-800 border-b border-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                    Event
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                    Ticket Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                    Sold
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                    Available
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                    Revenue
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {sales.map((sale) => (
                                                <tr key={`${sale.eventId}-${sale.ticketTypeId}`} className="hover:bg-gray-800/50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                                        {sale.eventName}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                        {sale.ticketTypeName}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                        {sale.sold}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                        {sale.available}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-400">
                                                        ${sale.revenue.toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
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

export default DashboardTicketSales;
