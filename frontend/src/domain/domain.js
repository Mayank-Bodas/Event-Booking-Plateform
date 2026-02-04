export const isErrorResponse = (obj) => {
  return (
    obj &&
    typeof obj === "object" &&
    "error" in obj &&
    typeof obj.error === "string"
  );
};

export const EventStatusEnum = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
};

export const TicketStatus = {
  PURCHASED: "PURCHASED",
  CANCELLED: "CANCELLED",
};

export const TicketValidationMethod = {
  QR_SCAN: "QR_SCAN",
  MANUAL: "MANUAL",
};

export const TicketValidationStatus = {
  VALID: "VALID",
  INVALID: "INVALID",
  EXPIRED: "EXPIRED",
};
