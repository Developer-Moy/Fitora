export interface PlatformStats {
  totalRevenueBDT: number;
  mrrBDT: number;
  totalMembers: number;
  activeMembersToday: number;
  totalBranches: number;
  conversionRatePercent: number;
  revenueGrowthPercent: number;
  membersGrowthPercent: number;
}

export interface BranchInfo {
  id: string;
  name: string;
  division: string;
  district: string;
  address: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  totalMembers: number;
  maxCapacity: number;
  monthlyRevenueBDT: number;
  activeNow: number;
  equipmentCount: number;
  trainersCount: number;
  status: "active" | "maintenance" | "upcoming";
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "master_admin" | "branch_admin" | "premium_user" | "free_user";
  assignedBranch: string;
  plan: "Free Pass" | "Basic Pass" | "Pro Athlete" | "VIP Ultimate";
  status: "active" | "suspended" | "pending";
  joinDate: string;
  expiryDate: string;
  totalPaidBDT: number;
  paymentMethod: "bKash" | "Nagad" | "Card" | "None";
  attendanceStreakDays: number;
  lastCheckIn: string;
  qrCodeId: string;
}

export interface CheckInRecord {
  id: string;
  userName: string;
  userRole: "premium_user" | "free_user" | "branch_admin";
  branchName: string;
  time: string;
  status: "Verified Entry" | "Denied (Expired)" | "Day Pass Logged";
  method: "QR Scan" | "Manual Entry" | "Biometric NFC";
}

export const INITIAL_PLATFORM_STATS: PlatformStats = {
  totalRevenueBDT: 8450000,
  mrrBDT: 1420000,
  totalMembers: 4850,
  activeMembersToday: 1280,
  totalBranches: 64,
  conversionRatePercent: 24.8,
  revenueGrowthPercent: 18.5,
  membersGrowthPercent: 12.3,
};

export const REVENUE_MONTHLY_CHART = [
  {
    month: "Mar",
    revenue: 980000,
    expenses: 420000,
    netProfit: 560000,
    signups: 410,
  },
  {
    month: "Apr",
    revenue: 1120000,
    expenses: 450000,
    netProfit: 670000,
    signups: 530,
  },
  {
    month: "May",
    revenue: 1250000,
    expenses: 480000,
    netProfit: 770000,
    signups: 620,
  },
  {
    month: "Jun",
    revenue: 1310000,
    expenses: 510000,
    netProfit: 800000,
    signups: 710,
  },
  {
    month: "Jul",
    revenue: 1390000,
    expenses: 530000,
    netProfit: 860000,
    signups: 790,
  },
  {
    month: "Aug",
    revenue: 1420000,
    expenses: 540000,
    netProfit: 880000,
    signups: 840,
  },
];

export const PAYMENT_GATEWAY_BREAKDOWN = [
  {
    name: "bKash Direct",
    percentage: 62,
    amountBDT: 5239000,
    color: "#E2136E",
  },
  {
    name: "Nagad Gateway",
    percentage: 26,
    amountBDT: 2197000,
    color: "#F7941D",
  },
  {
    name: "Visa / Mastercard",
    percentage: 12,
    amountBDT: 1014000,
    color: "#00579F",
  },
];

export const PACKAGE_SALES_BREAKDOWN = [
  { name: "Free Tier (Trial)", members: 3200, priceBDT: 0, share: "66%" },
  { name: "Basic Pass", members: 680, priceBDT: 2500, share: "14%" },
  {
    name: "Pro Athlete (AI Suite)",
    members: 820,
    priceBDT: 4900,
    share: "17%",
  },
  {
    name: "VIP Ultimate (All-Branch)",
    members: 150,
    priceBDT: 9900,
    share: "3%",
  },
];

export const BANGLADESH_DIVISIONS = [
  "Dhaka Division",
  "Chittagong Division",
  "Sylhet Division",
  "Rajshahi Division",
  "Khulna Division",
  "Barishal Division",
  "Rangpur Division",
  "Mymensingh Division",
];

export const INITIAL_BRANCHES: BranchInfo[] = [
  {
    id: "BR-01",
    name: "Dhaka - Gulshan-2 Branch (Flagship)",
    division: "Dhaka Division",
    district: "Dhaka",
    address: "Fitora Tower, Road 113, Gulshan-2, Dhaka 1212",
    adminName: "Rahim Ahmed",
    adminEmail: "gulshan.admin@fitora.com.bd",
    adminPhone: "+880 1711-000101",
    totalMembers: 480,
    maxCapacity: 600,
    monthlyRevenueBDT: 680000,
    activeNow: 42,
    equipmentCount: 85,
    trainersCount: 12,
    status: "active",
  },
  {
    id: "BR-02",
    name: "Dhaka - Dhanmondi Branch",
    division: "Dhaka Division",
    district: "Dhaka",
    address: "House 45, Road 27, Dhanmondi, Dhaka 1209",
    adminName: "Kamrul Islam",
    adminEmail: "dhanmondi.admin@fitora.com.bd",
    adminPhone: "+880 1711-000102",
    totalMembers: 390,
    maxCapacity: 500,
    monthlyRevenueBDT: 540000,
    activeNow: 35,
    equipmentCount: 70,
    trainersCount: 9,
    status: "active",
  },
  {
    id: "BR-03",
    name: "Dhaka - Uttara Sector 7 Branch",
    division: "Dhaka Division",
    district: "Dhaka",
    address: "Plot 12, Sector 7, Jashimuddin Ave, Uttara, Dhaka 1230",
    adminName: "Tariqul Bashar",
    adminEmail: "uttara.admin@fitora.com.bd",
    adminPhone: "+880 1711-000103",
    totalMembers: 360,
    maxCapacity: 450,
    monthlyRevenueBDT: 490000,
    activeNow: 28,
    equipmentCount: 65,
    trainersCount: 8,
    status: "active",
  },
  {
    id: "BR-04",
    name: "Chittagong - GEC Circle Branch",
    division: "Chittagong Division",
    district: "Chittagong",
    address: "OR Nizam Road, GEC Circle, Chittagong 4000",
    adminName: "Zubair Mahmud",
    adminEmail: "ctg.gec.admin@fitora.com.bd",
    adminPhone: "+880 1811-000104",
    totalMembers: 340,
    maxCapacity: 450,
    monthlyRevenueBDT: 460000,
    activeNow: 31,
    equipmentCount: 60,
    trainersCount: 7,
    status: "active",
  },
  {
    id: "BR-05",
    name: "Sylhet - Zindabazar Branch",
    division: "Sylhet Division",
    district: "Sylhet",
    address: "Al-Hamra Shopping City, Level 5, Zindabazar, Sylhet 3100",
    adminName: "Mustafa Choudhury",
    adminEmail: "sylhet.admin@fitora.com.bd",
    adminPhone: "+880 1711-000105",
    totalMembers: 280,
    maxCapacity: 350,
    monthlyRevenueBDT: 390000,
    activeNow: 22,
    equipmentCount: 50,
    trainersCount: 6,
    status: "active",
  },
  {
    id: "BR-06",
    name: "Rajshahi - Shaheb Bazar Branch",
    division: "Rajshahi Division",
    district: "Rajshahi",
    address: "Zero Point, Shaheb Bazar, Rajshahi 6000",
    adminName: "Anisur Rahman",
    adminEmail: "rajshahi.admin@fitora.com.bd",
    adminPhone: "+880 1711-000106",
    totalMembers: 220,
    maxCapacity: 300,
    monthlyRevenueBDT: 280000,
    activeNow: 18,
    equipmentCount: 45,
    trainersCount: 5,
    status: "active",
  },
  {
    id: "BR-07",
    name: "Khulna - Shib Bari More Branch",
    division: "Khulna Division",
    district: "Khulna",
    address: "KDA Avenue, Shib Bari More, Khulna 9100",
    adminName: "Farhan Kabir",
    adminEmail: "khulna.admin@fitora.com.bd",
    adminPhone: "+880 1711-000107",
    totalMembers: 210,
    maxCapacity: 300,
    monthlyRevenueBDT: 260000,
    activeNow: 16,
    equipmentCount: 42,
    trainersCount: 5,
    status: "active",
  },
  {
    id: "BR-08",
    name: "Cox's Bazar - Kolatoli Beach Branch",
    division: "Chittagong Division",
    district: "Cox's Bazar",
    address: "Hotel Motel Zone, Kolatoli Road, Cox's Bazar 4700",
    adminName: "Sajidul Islam",
    adminEmail: "coxsbazar.admin@fitora.com.bd",
    adminPhone: "+880 1811-000108",
    totalMembers: 190,
    maxCapacity: 250,
    monthlyRevenueBDT: 240000,
    activeNow: 25,
    equipmentCount: 40,
    trainersCount: 4,
    status: "active",
  },
];

export const INITIAL_USERS: UserRecord[] = [
  {
    id: "USR-1001",
    name: "Master",
    email: "master@fitora.com",
    phone: "+880 1700-000000",
    role: "master_admin",
    assignedBranch: "Dhaka - Gulshan-2 Branch (Flagship)",
    plan: "VIP Ultimate",
    status: "active",
    joinDate: "2025-01-01",
    expiryDate: "2030-12-31",
    totalPaidBDT: 99900,
    paymentMethod: "Card",
    attendanceStreakDays: 45,
    lastCheckIn: "Today, 08:15 AM",
    qrCodeId: "FIT-QR-MASTER-001",
  },
  {
    id: "USR-1002",
    name: "Rahim Ahmed",
    email: "gulshan.admin@fitora.com.bd",
    phone: "+880 1711-000101",
    role: "branch_admin",
    assignedBranch: "Dhaka - Gulshan-2 Branch (Flagship)",
    plan: "VIP Ultimate",
    status: "active",
    joinDate: "2025-02-15",
    expiryDate: "2028-12-31",
    totalPaidBDT: 45000,
    paymentMethod: "Card",
    attendanceStreakDays: 32,
    lastCheckIn: "Today, 07:45 AM",
    qrCodeId: "FIT-QR-ADM-0101",
  },
  {
    id: "USR-1003",
    name: "Tanvir Hasan",
    email: "tanvir.athlete@gmail.com",
    phone: "+880 1712-334455",
    role: "premium_user",
    assignedBranch: "Dhaka - Gulshan-2 Branch (Flagship)",
    plan: "Pro Athlete",
    status: "active",
    joinDate: "2025-06-10",
    expiryDate: "2026-06-10",
    totalPaidBDT: 4900,
    paymentMethod: "bKash",
    attendanceStreakDays: 14,
    lastCheckIn: "Today, 06:30 AM",
    qrCodeId: "FIT-QR-ATH-5521",
  },
  {
    id: "USR-1004",
    name: "Ayesha Siddiqua",
    email: "ayesha.fit@outlook.com",
    phone: "+880 1819-223344",
    role: "premium_user",
    assignedBranch: "Dhaka - Dhanmondi Branch",
    plan: "VIP Ultimate",
    status: "active",
    joinDate: "2025-04-01",
    expiryDate: "2026-04-01",
    totalPaidBDT: 9900,
    paymentMethod: "Nagad",
    attendanceStreakDays: 22,
    lastCheckIn: "Yesterday, 07:15 PM",
    qrCodeId: "FIT-QR-VIP-9912",
  },
  {
    id: "USR-1005",
    name: "Sabbir Hossain",
    email: "sabbir.member@gmail.com",
    phone: "+880 1913-445566",
    role: "free_user",
    assignedBranch: "Dhaka - Uttara Sector 7 Branch",
    plan: "Free Pass",
    status: "active",
    joinDate: "2025-08-01",
    expiryDate: "2025-09-01",
    totalPaidBDT: 0,
    paymentMethod: "None",
    attendanceStreakDays: 3,
    lastCheckIn: "3 days ago",
    qrCodeId: "FIT-QR-FREE-1102",
  },
  {
    id: "USR-1006",
    name: "Zubair Mahmud",
    email: "ctg.gec.admin@fitora.com.bd",
    phone: "+880 1811-000104",
    role: "branch_admin",
    assignedBranch: "Chittagong - GEC Circle Branch",
    plan: "VIP Ultimate",
    status: "active",
    joinDate: "2025-03-01",
    expiryDate: "2028-12-31",
    totalPaidBDT: 40000,
    paymentMethod: "bKash",
    attendanceStreakDays: 18,
    lastCheckIn: "Today, 08:00 AM",
    qrCodeId: "FIT-QR-ADM-0104",
  },
  {
    id: "USR-1007",
    name: "Mehedi Hasan Niloy",
    email: "niloy.mehedi@yahoo.com",
    phone: "+880 1612-998877",
    role: "premium_user",
    assignedBranch: "Sylhet - Zindabazar Branch",
    plan: "Basic Pass",
    status: "active",
    joinDate: "2025-07-15",
    expiryDate: "2025-10-15",
    totalPaidBDT: 2500,
    paymentMethod: "bKash",
    attendanceStreakDays: 8,
    lastCheckIn: "Today, 09:30 AM",
    qrCodeId: "FIT-QR-BAS-4410",
  },
  {
    id: "USR-1008",
    name: "Nusrat Jahan",
    email: "nusrat.gym@gmail.com",
    phone: "+880 1714-556677",
    role: "free_user",
    assignedBranch: "Dhaka - Gulshan-2 Branch (Flagship)",
    plan: "Free Pass",
    status: "suspended",
    joinDate: "2025-05-12",
    expiryDate: "2025-06-12",
    totalPaidBDT: 0,
    paymentMethod: "None",
    attendanceStreakDays: 0,
    lastCheckIn: "2 months ago",
    qrCodeId: "FIT-QR-FREE-9011",
  },
  {
    id: "USR-1009",
    name: "Mahfuzur Rahman",
    email: "mahfuz.fitness@gmail.com",
    phone: "+880 1715-889900",
    role: "premium_user",
    assignedBranch: "Rajshahi - Shaheb Bazar Branch",
    plan: "Pro Athlete",
    status: "active",
    joinDate: "2025-08-10",
    expiryDate: "2026-08-10",
    totalPaidBDT: 4900,
    paymentMethod: "Nagad",
    attendanceStreakDays: 11,
    lastCheckIn: "Today, 07:10 AM",
    qrCodeId: "FIT-QR-ATH-7789",
  },
  {
    id: "USR-1010",
    name: "Sadia Afrin",
    email: "sadia.afrin@gmail.com",
    phone: "+880 1818-112233",
    role: "free_user",
    assignedBranch: "Khulna - Shib Bari More Branch",
    plan: "Free Pass",
    status: "active",
    joinDate: "2025-08-20",
    expiryDate: "2025-09-20",
    totalPaidBDT: 0,
    paymentMethod: "None",
    attendanceStreakDays: 2,
    lastCheckIn: "Yesterday, 05:00 PM",
    qrCodeId: "FIT-QR-FREE-3312",
  },
];

export const INITIAL_CHECKINS: CheckInRecord[] = [
  {
    id: "CHK-901",
    userName: "Tanvir Hasan",
    userRole: "premium_user",
    branchName: "Dhaka - Gulshan-2 Branch (Flagship)",
    time: "2 mins ago",
    status: "Verified Entry",
    method: "QR Scan",
  },
  {
    id: "CHK-902",
    userName: "Master (Master Admin)",
    userRole: "branch_admin",
    branchName: "Dhaka - Gulshan-2 Branch (Flagship)",
    time: "15 mins ago",
    status: "Verified Entry",
    method: "Biometric NFC",
  },
  {
    id: "CHK-903",
    userName: "Mehedi Hasan Niloy",
    userRole: "premium_user",
    branchName: "Sylhet - Zindabazar Branch",
    time: "42 mins ago",
    status: "Verified Entry",
    method: "QR Scan",
  },
  {
    id: "CHK-904",
    userName: "Sabbir Hossain",
    userRole: "free_user",
    branchName: "Dhaka - Uttara Sector 7 Branch",
    time: "1 hour ago",
    status: "Day Pass Logged",
    method: "Manual Entry",
  },
  {
    id: "CHK-905",
    userName: "Nusrat Jahan",
    userRole: "free_user",
    branchName: "Dhaka - Gulshan-2 Branch (Flagship)",
    time: "2 hours ago",
    status: "Denied (Expired)",
    method: "QR Scan",
  },
];
