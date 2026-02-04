import { Button } from "@/components/ui/button";
import MockPaymentModal from "@/components/mock-payment-modal";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate, useParams } from "react-router";

const PurchaseTicketPage = () => {
  const { eventId, ticketTypeId } = useParams();
  const { isLoading, user } = useAuth();
  const navigate = useNavigate();

  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketType, setTicketType] = useState(null);

  useEffect(() => {
    if (!ticketTypeId) return;

    // We can fetch the event details to find the ticket type, or if there's a direct endpoint.
    // Based on previous code, we likely need to fetch the event and find the ticket type within it, 
    // OR use a specific ticket type endpoint if it exists.
    // Let's assume we can fetch the public event details which contains ticket types.

    fetch(`http://localhost:8080/api/v1/published-events/${eventId}`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch event");
      })
      .then(data => {
        const found = data.ticketTypes?.find(tt => tt.id === ticketTypeId);
        if (found) setTicketType(found);
      })
      .catch(err => console.error(err));
  }, [eventId, ticketTypeId]);

  const handlePurchaseClick = () => {
    if (!user || isLoading) return;
    setIsModalOpen(true);
  };

  if (isLoading || !ticketType) return <div className="text-white text-center pt-20">Loading...</div>;

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="max-w-md mx-auto py-20 px-4">
        <div className="bg-white border-gray-300 shadow-sm border rounded-lg p-6 text-black text-center space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Checkout</h2>
            <p className="text-gray-500">Secure Payment Gateway</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-sm text-gray-500">Total to Pay</p>
            <p className="text-3xl font-bold">₹{ticketType.price}</p>
          </div>

          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg"
            onClick={handlePurchaseClick}
          >
            Pay Securely with MockPay
          </Button>

          <p className="text-xs text-gray-400">
            By continuing, you verify that you are authorized to use this payment method.
          </p>
        </div>
      </div>

      <MockPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ticketTypeId={ticketTypeId}
        amount={ticketType.price}
        eventId={eventId}
      />
    </div>
  );
};

export default PurchaseTicketPage;
