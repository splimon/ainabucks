/*
 * constants/index.ts
 * This file contains constant values used across the application,
 * including field names, types, placeholders, and sample event data.
 */

export const FIELD_NAMES = {
  fullName: "Full Name",
  email: "Email",
  password: "Password",
  confirmPassword: "Confirm Password",
};

export const FIELD_TYPES = {
  fullName: "text",
  email: "email",
  password: "password",
  confirmPassword: "password",
};

export const FIELD_PLACEHOLDERS = {
  fullName: "John Doe",
  email: "your@email.com",
  password: "••••••••",
  confirmPassword: "••••••••",
};

export const sampleEvents = [
  {
    id: 1,
    title: "Community Clean-Up",
    date: "2024-07-15",
    time: "09:00 AM",
    location: "Kapiolani Park",
    description:
      "Join us for a day of cleaning and beautifying our local park.",
    ainaBucks: 50,
    hours: 5,
    photo:
      "https://www.wildhawaii.org/wp-content/uploads/2020/08/marine-debris-removal-clean-up-hawaii-wildlife-fund.jpg",
  },
  {
    id: 2,
    title: "Beach Restoration Project",
    date: "2024-07-22",
    time: "08:00 AM",
    location: "Waikiki Beach",
    description:
      "Help restore native plants and remove invasive species along our beautiful coastline.",
    ainaBucks: 75,
    hours: 6,
    photo:
      "https://s7d2.scene7.com/is/image/TWCNews/Hawaii_KailuaBchrestoration1_HonDPR_12102024",
  },
  {
    id: 3,
    title: "Food Bank Volunteer Day",
    date: "2024-07-18",
    time: "10:00 AM",
    location: "Hawaii Foodbank",
    description:
      "Sort and pack food donations to help feed families in need across the island.",
    ainaBucks: 40,
    hours: 4,
    photo:
      "https://s7d2.scene7.com/is/image/TWCNews/hawaii_fooddrivehawaiifoodbank_08262022",
  },
  {
    id: 4,
    title: "Tree Planting",
    date: "2024-07-25",
    time: "08:00 AM",
    location: "Manoa Valley",
    description:
      "Plant native Hawaiian trees to restore the watershed and support local ecosystems.",
    ainaBucks: 60,
    hours: 5,
    photo:
      "https://holdenfg.org/wp-content/uploads/2022/04/CMHA_tree_planting_523-1-scaled.jpg",
  },
];
