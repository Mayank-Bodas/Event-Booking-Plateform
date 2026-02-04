import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, DollarSign, ShoppingCart, Ticket, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link, Navigate } from "react-router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useRoles } from "@/hooks/use-roles";

const DashboardPage = () => {
  const { user } = useAuth();
  const { isOrganizer, isStaff, isLoading: isRolesLoading } = useRoles();
  const [stats, setStats] = useState(null);
  const [staffHistory, setStaffHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isRolesLoading || !user?.access_token) return;

    if (isOrganizer) {
      setIsLoading(true);
      fetch("http://localhost:8080/api/v1/organizers/stats", {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Failed to fetch stats");
        })
        .then((data) => setStats(data))
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    } else if (isStaff) {
      setIsLoading(true);
      fetch("http://localhost:8080/api/v1/ticket-validations/history", {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Failed to fetch history");
        })
        .then((data) => setStaffHistory(data))
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [user?.access_token, isRolesLoading, isOrganizer, isStaff]);

  if (isRolesLoading) {
    return (
      <div className="bg-black min-h-screen text-white">
        <NavBar />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
        </div>
      </div>
    );
  }

  if (!isOrganizer && !isStaff) {
    return <Navigate to="/dashboard/tickets" replace />;
  }

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

  if (isStaff && !isOrganizer) {
    return (
      <div className="bg-black min-h-screen text-white">
        <NavBar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Staff Dashboard</h1>
              <p className="text-gray-400 mt-1">Scan tickets and view history</p>
            </div>
            <Link to="/dashboard/validate-qr">
              <Button className="bg-purple-600 hover:bg-purple-700 text-lg py-6 px-8">
                <QrCode className="mr-2 h-6 w-6" />
                Scan QR
              </Button>
            </Link>
          </div>

          <Card className="bg-gray-900 border-gray-700 text-white">
            <CardHeader>
              <h3 className="text-xl font-bold text-white">Scan History</h3>
            </CardHeader>
            <CardContent>
              {staffHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-400">Timestamp</TableHead>
                      <TableHead className="text-gray-400">Method</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffHistory.map((validation) => (
                      <TableRow key={validation.ticketId} className="border-gray-700">
                        <TableCell>
                          {new Date(validation.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {validation.validationMethod}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-sm ${validation.status === 'VALID'
                            ? 'bg-green-900 text-green-300'
                            : 'bg-red-900 text-red-300'
                            }`}>
                            {validation.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No tickets scanned yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  /*
  *  Organizer View
  */
  return (
    <div className="bg-black min-h-screen text-white">
      <NavBar />

      <div className="max-w-6xl mx-auto px-4">
        {/* Header with Back Button */}
        <div className="py-8 px-4">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/dashboard/events">
              <Button className="bg-gray-700 hover:bg-gray-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Dashboard Overview</h1>
              <p className="text-gray-400 mt-1">
                Monitor your event performance
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gray-900 border-gray-700 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-sm font-medium text-white">
                  Total Revenue
                </h3>
                <DollarSign className="h-5 w-5 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  ${stats?.totalRevenue.toLocaleString() || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-sm font-medium text-white">
                  Tickets Sold
                </h3>
                <ShoppingCart className="h-5 w-5 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {stats?.totalTicketsSold || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-sm font-medium text-white">
                  Tickets Available
                </h3>
                <Ticket className="h-5 w-5 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {stats?.totalTicketsAvailable || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <Card className="bg-gray-900 border-gray-700 text-white">
            <CardHeader>
              <h3 className="text-xl font-bold text-white">Monthly Sales</h3>
              <p className="text-gray-300 text-sm">
                Ticket sales over the last 12 months
              </p>
            </CardHeader>
            <CardContent>
              {stats?.monthlySales && stats.monthlySales.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.monthlySales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#D1D5DB" />
                    <YAxis yAxisId="left" stroke="#D1D5DB" />
                    <YAxis yAxisId="right" orientation="right" stroke="#D1D5DB" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="ticketsSold"
                      name="Tickets Sold"
                      fill="#8B5CF6"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="revenue"
                      name="Revenue ($)"
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-300 py-12">
                  No sales data available yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
