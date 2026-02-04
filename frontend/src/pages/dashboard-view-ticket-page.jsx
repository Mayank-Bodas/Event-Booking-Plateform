import { TicketStatus } from "@/domain/domain";
import { getTicket, getTicketQr, cancelTicket } from "@/lib/api";
import { format } from "date-fns";
import { Calendar, DollarSign, MapPin, Tag, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useParams, Link } from "react-router";

const DashboardViewTicketPage = () => {
  const [ticket, setTicket] = useState();
  const [qrCodeUrl, setQrCodeUrl] = useState();
  const [isQrLoading, setIsQrCodeLoading] = useState(true);
  const [error, setError] = useState();

  const { id } = useParams();
  const { isLoading, user } = useAuth();

  const fetchTicket = async () => {
    if (isLoading || !user?.access_token || !id) {
      return;
    }

    try {
      setIsQrCodeLoading(true);
      setError(undefined);

      const ticketData = await getTicket(user.access_token, id);
      setTicket(ticketData);

      // Only fetch QR if purchased
      if (ticketData.status === TicketStatus.PURCHASED) {
        setQrCodeUrl(URL.createObjectURL(await getTicketQr(user.access_token, id)));
      } else {
        setQrCodeUrl(undefined);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("An unknown error has occurred");
      }
    } finally {
      setIsQrCodeLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
    return () => {
      if (qrCodeUrl) {
        URL.revokeObjectURL(qrCodeUrl);
      }
    };
  }, [user?.access_token, isLoading, id]);

  const handleCancelTicket = async () => {
    if (!window.confirm("Are you sure you want to cancel this ticket? This action cannot be undone.")) {
      return;
    }

    try {
      await cancelTicket(user.access_token, ticket.id);
      alert("Ticket cancelled successfully.");
      // Refresh data
      fetchTicket();
    } catch (e) {
      alert("Failed to cancel ticket: " + e.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case TicketStatus.PURCHASED:
        return "text-green-400";
      case TicketStatus.CANCELLED:
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  if (!ticket) {
    return <p>Loading..</p>;
  }

  return (
    <div className="bg-black min-h-screen text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-3xl p-8 shadow-2xl">
          <Link
            to="/dashboard/tickets"
            className="absolute top-6 left-6 text-purple-200 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          {/* Status */}
          <div className="bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full mb-8 text-center">
            <span
              className={`text-sm font-medium ${getStatusColor(ticket.status)}`}
            >
              {ticket?.status}
            </span>
          </div>

          <div className="mb-2">
            <h1 className="text-2xl font-bold mb-2">{ticket.eventName}</h1>
            <div className="flex items-center gap-2 text-purple-200">
              <MapPin className="w-4" />
              <span>{ticket.eventVenue}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-purple-300 mb-8">
            <Calendar className="w-4 text-purple-200" />
            <div>
              {format(new Date(ticket.eventStart), "Pp")} -{" "}
              {format(new Date(ticket.eventEnd), "Pp")}
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <div className="bg-white p-4 rounded-2xl shadow-lg">
              <div className="w-32 h-32 flex items-center justify-center">
                {/* Loading */}
                {isQrLoading && ticket.status === TicketStatus.PURCHASED && (
                  <div className="text-xs text-center p2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 mb-2 mx-auto"></div>
                    <div className="text-gray-800">Loading QR...</div>
                  </div>
                )}
                {/* error */}
                {error && (
                  <div className="text-red-400 text-sm text-center p-2">
                    <div className="mb-1">⚠️</div>
                    {error}
                  </div>
                )}
                {/* Cancelled State */}
                {ticket.status === TicketStatus.CANCELLED && (
                  <div className="text-red-500 font-bold text-center">CANCELLED</div>
                )}
                {/* Display QR */}
                {qrCodeUrl && !isQrLoading && !error && ticket.status === TicketStatus.PURCHASED && (
                  <img
                    src={qrCodeUrl}
                    alt="QR Code for event"
                    className="w-full h-full object-contain rounded-large"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-purple-200 text-sm">
              {ticket.status === TicketStatus.PURCHASED
                ? "Present this QR code at the venue for entry"
                : "This ticket is no longer valid"}
            </p>
          </div>

          <div className="space-y-2 mb-8">
            <div className="flex items-center gap-2">
              <Tag className="w-5 text-purple-200" />
              <span className="font-semibold">{ticket.description}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 text-purple-200" />
              <span className="font-semibold">{ticket.price}</span>
            </div>
          </div>

          <div className="text-center mb-2">
            <h4 className="text-sm font-semibold font-mono">Ticket ID</h4>
            <p className="text-purple-200 text-sm font-mono">{ticket.id}</p>
          </div>

          {ticket.status === TicketStatus.PURCHASED && (
            <button
              onClick={handleCancelTicket}
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Cancel Ticket
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default DashboardViewTicketPage;
