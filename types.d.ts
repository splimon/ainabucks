interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Event-related types
interface CreateEventParams {
  title: string;
  category: string;
  description: string;
  imageUrl?: string;
  date: string;
  startTime: string;
  endTime: string;
  locationName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  volunteersNeeded: number;
  duration: number;
  ainaBucks: number;
  bucksPerHour: number;
  whatToBring?: string[];
  requirements?: string[];
  coordinatorName: string;
  coordinatorEmail: string;
  coordinatorPhone: string;
}

// Standard server action response
interface ServerActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}