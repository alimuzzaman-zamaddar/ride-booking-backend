export interface AuthPayload {
  userId: string;
  role: "admin" | "rider" | "driver";
}

export interface User {
  _id: string;
  email: string;
  password: string;
  role: "admin" | "rider" | "driver";
}
