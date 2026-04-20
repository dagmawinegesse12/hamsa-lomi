export type Role = "SUPER_ADMIN" | "ADMIN" | "TREASURER" | "SECRETARY" | "MEMBER";

export type ApiErrorBody = {
  code: string;
  message: string;
};

export type ApiEnvelope<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: ApiErrorBody;
    };

export type PaymentStatus = "PAID" | "OVERDUE" | "PENDING" | "NOT_DUE";
