import { useAuth } from "react-oidc-context";
import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";

const DashboardReports = () => {
    const { user } = useAuth();
    const [downloading, setDownloading] = useState(null);

    const handleDownload = async (reportType) => {
        if (!user?.access_token) return;

        setDownloading(reportType);

        try {
            const response = await fetch(
                `http://localhost:8080/api/v1/organizers/ticket-sales`,
                {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                    },
                }
            );

            if (!response.ok) throw new Error("Failed to fetch data");

            const data = await response.json();

            // Generate CSV content
            let csvContent = "";

            if (reportType === "sales") {
                csvContent = "Event,Ticket Type,Price,Sold,Available,Revenue\n";
                data.forEach((item) => {
                    csvContent += `"${item.eventName}","${item.ticketTypeName}",${item.price},${item.sold},${item.available},${item.revenue}\n`;
                });
            } else if (reportType === "summary") {
                const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
                const totalSold = data.reduce((sum, item) => sum + item.sold, 0);
                const totalAvailable = data.reduce((sum, item) => sum + item.available, 0);

                csvContent = "Metric,Value\n";
                csvContent += `"Total Revenue",${totalRevenue}\n`;
                csvContent += `"Total Tickets Sold",${totalSold}\n`;
                csvContent += `"Total Tickets Available",${totalAvailable}\n`;
            } else if (reportType === "events") {
                csvContent = "Event,Total Sold,Total Revenue\n";
                const eventMap = new Map();

                data.forEach((item) => {
                    const current = eventMap.get(item.eventName) || { sold: 0, revenue: 0 };
                    eventMap.set(item.eventName, {
                        sold: current.sold + item.sold,
                        revenue: current.revenue + item.revenue
                    });
                });

                eventMap.forEach((value, key) => {
                    csvContent += `"${key}",${value.sold},${value.revenue}\n`;
                });
            }

            // Create download link
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed:", err);
            alert("Failed to download report. Please try again.");
        } finally {
            setDownloading(null);
        }
    };

    const reports = [
        {
            id: "sales",
            title: "Sales Report",
            description: "Detailed breakdown of all ticket sales by event and type",
            icon: FileText,
        },
        {
            id: "summary",
            title: "Summary Report",
            description: "Overall statistics including total revenue and tickets sold",
            icon: FileText,
        },
        {
            id: "events",
            title: "Events Report",
            description: "Performance metrics grouped by event",
            icon: FileText,
        },
    ];

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
                            <h1 className="text-3xl font-bold">Reports</h1>
                            <p className="text-gray-300 mt-1">
                                Download detailed reports about your events
                            </p>
                        </div>
                    </div>

                    {/* Report Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {reports.map((report) => (
                            <Card key={report.id} className="bg-gray-900 border-gray-700">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-900/30 rounded-lg">
                                            <report.icon className="h-6 w-6 text-purple-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">{report.title}</h3>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-gray-300">{report.description}</p>
                                    <Button
                                        onClick={() => handleDownload(report.id)}
                                        disabled={downloading === report.id}
                                        className="w-full bg-purple-700 hover:bg-purple-600"
                                    >
                                        {downloading === report.id ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                                Downloading...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="h-4 w-4 mr-2" />
                                                Download CSV
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Info Card */}
                    <Card className="bg-gray-900 border-gray-700 mt-6">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-3">
                                <FileText className="h-5 w-5 text-blue-400 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold mb-1 text-white">About Reports</h4>
                                    <p className="text-sm text-gray-300">
                                        All reports are generated in CSV format and include the most up-to-date data from your events.
                                        You can open these files in spreadsheet applications like Excel, Google Sheets, or Numbers.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardReports;
