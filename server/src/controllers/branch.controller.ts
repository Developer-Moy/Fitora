import { Request, Response } from "express";
import { Branch, IBranch } from "../models/Branch.model";
import { AuthRequest } from "../middlewares/auth.middleware";

// All 64 Districts of Bangladesh Grouped by 8 Divisions
export const BANGLADESH_64_DISTRICTS = [
  // Dhaka Division (13)
  {
    name: "Dhaka - Gulshan-2 Branch (Flagship)",
    division: "Dhaka",
    district: "Dhaka",
    address: "Fitora Tower, Road 45, Gulshan-2, Dhaka 1212",
  },
  {
    name: "Dhaka - Dhanmondi 27 Branch",
    division: "Dhaka",
    district: "Dhaka",
    address: "House 34, Road 27, Dhanmondi, Dhaka 1209",
  },
  {
    name: "Dhaka - Uttara Sector 7 Branch",
    division: "Dhaka",
    district: "Dhaka",
    address: "Plot 12, Sector 7, Jashimuddin Ave, Uttara, Dhaka 1230",
  },
  {
    name: "Gazipur - Joydebpur Chowrasta Branch",
    division: "Dhaka",
    district: "Gazipur",
    address: "Chowrasta Commercial Area, Joydebpur, Gazipur",
  },
  {
    name: "Narayanganj - Chashara Branch",
    division: "Dhaka",
    district: "Narayanganj",
    address: "BB Road, Chashara, Narayanganj 1400",
  },
  {
    name: "Tangail - Victoria Road Branch",
    division: "Dhaka",
    district: "Tangail",
    address: "Main Road, Victoria Chowk, Tangail 1900",
  },
  {
    name: "Faridpur - Mujib Sarak Branch",
    division: "Dhaka",
    district: "Faridpur",
    address: "Mujib Sarak, Goalchamot, Faridpur 7800",
  },
  {
    name: "Manikganj - Shahid Rafiq Sarak Branch",
    division: "Dhaka",
    district: "Manikganj",
    address: "Shahid Rafiq Sarak, Manikganj 1800",
  },
  {
    name: "Munshiganj - Sadar Branch",
    division: "Dhaka",
    district: "Munshiganj",
    address: "Jubilee Road, Munshiganj Sadar 1500",
  },
  {
    name: "Narsingdi - Station Road Branch",
    division: "Dhaka",
    district: "Narsingdi",
    address: "Station Road, Velanagar, Narsingdi 1600",
  },
  {
    name: "Gopalganj - Bangabandhu Sarak Branch",
    division: "Dhaka",
    district: "Gopalganj",
    address: "Court Road, Gopalganj 8100",
  },
  {
    name: "Madaripur - Main Town Branch",
    division: "Dhaka",
    district: "Madaripur",
    address: "Puran Bazar, Madaripur 7900",
  },
  {
    name: "Rajbari - Panbazar Branch",
    division: "Dhaka",
    district: "Rajbari",
    address: "Railway Station Road, Rajbari 7700",
  },
  {
    name: "Shariatpur - Sadar Point Branch",
    division: "Dhaka",
    district: "Shariatpur",
    address: "Court Road, Shariatpur 8000",
  },

  // Chittagong Division (11)
  {
    name: "Chittagong - GEC Circle Branch",
    division: "Chittagong",
    district: "Chittagong",
    address: "OR Nizam Road, GEC Circle, Chittagong 4000",
  },
  {
    name: "Chittagong - Agrabad Commercial Branch",
    division: "Chittagong",
    district: "Chittagong",
    address: "Agrabad Commercial Area, Chittagong 4100",
  },
  {
    name: "Cox's Bazar - Kolatoli Beach Branch",
    division: "Chittagong",
    district: "Cox's Bazar",
    address: "Hotel Motel Zone, Kolatoli Road, Cox's Bazar 4700",
  },
  {
    name: "Comilla - Kandirpar Branch",
    division: "Chittagong",
    district: "Comilla",
    address: "Kandirpar Main Road, Comilla 3500",
  },
  {
    name: "Feni - Trunk Road Branch",
    division: "Chittagong",
    district: "Feni",
    address: "Trunk Road, Feni Sadar 3900",
  },
  {
    name: "Brahmanbaria - Medda Branch",
    division: "Chittagong",
    district: "Brahmanbaria",
    address: "Court Road, Brahmanbaria 3400",
  },
  {
    name: "Chandpur - Shahid Muktijoddha Sarak Branch",
    division: "Chittagong",
    district: "Chandpur",
    address: "Mission Road, Chandpur 3600",
  },
  {
    name: "Noakhali - Maijdee Court Branch",
    division: "Chittagong",
    district: "Noakhali",
    address: "Main Road, Maijdee Court, Noakhali 3800",
  },
  {
    name: "Lakshmipur - Sadar Branch",
    division: "Chittagong",
    district: "Lakshmipur",
    address: "Hospital Road, Lakshmipur 3700",
  },
  {
    name: "Rangamati - Lake View Branch",
    division: "Chittagong",
    district: "Rangamati",
    address: "Reserve Bazar, Rangamati 4500",
  },
  {
    name: "Bandarban - Hill City Branch",
    division: "Chittagong",
    district: "Bandarban",
    address: "Ujanipara, Bandarban 4600",
  },
  {
    name: "Khagrachhari - Town Center Branch",
    division: "Chittagong",
    district: "Khagrachhari",
    address: "Court Road, Khagrachhari 4400",
  },

  // Sylhet Division (4)
  {
    name: "Sylhet - Zindabazar Branch",
    division: "Sylhet",
    district: "Sylhet",
    address: "Al-Hamra Shopping City, Zindabazar, Sylhet 3100",
  },
  {
    name: "Moulvibazar - Saifur Rahman Sarak Branch",
    division: "Sylhet",
    district: "Moulvibazar",
    address: "Chowmuhani, Moulvibazar 3200",
  },
  {
    name: "Habiganj - Cinema Hall Road Branch",
    division: "Sylhet",
    district: "Habiganj",
    address: "Main Road, Habiganj 3300",
  },
  {
    name: "Sunamganj - Hasan Nagar Branch",
    division: "Sylhet",
    district: "Sunamganj",
    address: "Sadar Road, Sunamganj 3000",
  },

  // Rajshahi Division (8)
  {
    name: "Rajshahi - Shaheb Bazar Branch",
    division: "Rajshahi",
    district: "Rajshahi",
    address: "Zero Point, Shaheb Bazar, Rajshahi 6000",
  },
  {
    name: "Bogra - Satmatha Commercial Branch",
    division: "Rajshahi",
    district: "Bogra",
    address: "Satmatha, Bogra Sadar 5800",
  },
  {
    name: "Pabna - Abdul Hamid Road Branch",
    division: "Rajshahi",
    district: "Pabna",
    address: "Abdul Hamid Road, Pabna 6600",
  },
  {
    name: "Sirajganj - SS Road Branch",
    division: "Rajshahi",
    district: "Sirajganj",
    address: "SS Road, Sirajganj 6700",
  },
  {
    name: "Naogaon - Main Bazar Branch",
    division: "Rajshahi",
    district: "Naogaon",
    address: "Doyaler More, Naogaon 6500",
  },
  {
    name: "Natore - Kanaikhali Branch",
    division: "Rajshahi",
    district: "Natore",
    address: "Station Road, Natore 6400",
  },
  {
    name: "Chapai Nawabganj - Shanti Mor Branch",
    division: "Rajshahi",
    district: "Chapai Nawabganj",
    address: "Shanti Mor, Chapai Nawabganj 6300",
  },
  {
    name: "Joypurhat - Sadar Branch",
    division: "Rajshahi",
    district: "Joypurhat",
    address: "Main Road, Joypurhat 5900",
  },

  // Khulna Division (10)
  {
    name: "Khulna - Shib Bari More Branch",
    division: "Khulna",
    district: "Khulna",
    address: "KDA Avenue, Shib Bari More, Khulna 9100",
  },
  {
    name: "Jessore - Garibshah Sarak Branch",
    division: "Khulna",
    district: "Jessore",
    address: "Garibshah Sarak, Jessore 7400",
  },
  {
    name: "Kushtia - NS Road Branch",
    division: "Khulna",
    district: "Kushtia",
    address: "NS Road, Majampur, Kushtia 7000",
  },
  {
    name: "Satkhira - Palashpol Branch",
    division: "Khulna",
    district: "Satkhira",
    address: "Sadar Hospital Road, Satkhira 9400",
  },
  {
    name: "Jhenaidah - Post Office Mor Branch",
    division: "Khulna",
    district: "Jhenaidah",
    address: "H.S.S Road, Jhenaidah 7300",
  },
  {
    name: "Chuadanga - Shahid Abul Kashem Sarak Branch",
    division: "Khulna",
    district: "Chuadanga",
    address: "Court Road, Chuadanga 7200",
  },
  {
    name: "Magura - Syed Ator Ali Road Branch",
    division: "Khulna",
    district: "Magura",
    address: "Chourangi, Magura 7600",
  },
  {
    name: "Meherpur - Main Town Branch",
    division: "Khulna",
    district: "Meherpur",
    address: "Court Road, Meherpur 7100",
  },
  {
    name: "Narail - Rupganj Bazar Branch",
    division: "Khulna",
    district: "Narail",
    address: "Rupganj, Narail 7500",
  },
  {
    name: "Bagerhat - Rail Station Road Branch",
    division: "Khulna",
    district: "Bagerhat",
    address: "Old Town, Bagerhat 9300",
  },

  // Barishal Division (6)
  {
    name: "Barishal - Sadar Road Flagship Branch",
    division: "Barishal",
    district: "Barishal",
    address: "Sadar Road, Barishal 8200",
  },
  {
    name: "Patuakhali - Launch Ghat Road Branch",
    division: "Barishal",
    district: "Patuakhali",
    address: "Launch Ghat Road, Patuakhali 8600",
  },
  {
    name: "Bhola - Sadar Road Branch",
    division: "Barishal",
    district: "Bhola",
    address: "Banglabazar, Bhola 8300",
  },
  {
    name: "Pirojpur - Town Club Mor Branch",
    division: "Barishal",
    district: "Pirojpur",
    address: "Main Road, Pirojpur 8500",
  },
  {
    name: "Barguna - College Road Branch",
    division: "Barishal",
    district: "Barguna",
    address: "College Road, Barguna 8700",
  },
  {
    name: "Jhalokati - Kalibari Road Branch",
    division: "Barishal",
    district: "Jhalokati",
    address: "Kalibari Road, Jhalokati 8400",
  },

  // Rangpur Division (8)
  {
    name: "Rangpur - Jahaj Company More Branch",
    division: "Rangpur",
    district: "Rangpur",
    address: "Station Road, Jahaj Company More, Rangpur 5400",
  },
  {
    name: "Dinajpur - Goneshtola Branch",
    division: "Rangpur",
    district: "Dinajpur",
    address: "Goneshtola Main Road, Dinajpur 5200",
  },
  {
    name: "Gaibandha - DB Road Branch",
    division: "Rangpur",
    district: "Gaibandha",
    address: "DB Road, Gaibandha 5700",
  },
  {
    name: "Kurigram - Ghoshpara Branch",
    division: "Rangpur",
    district: "Kurigram",
    address: "Sadar Road, Kurigram 5600",
  },
  {
    name: "Nilphamari - Chowrangi Branch",
    division: "Rangpur",
    district: "Nilphamari",
    address: "Chowrangi Mor, Nilphamari 5300",
  },
  {
    name: "Lalmonirhat - Mission Mor Branch",
    division: "Rangpur",
    district: "Lalmonirhat",
    address: "Mission Mor, Lalmonirhat 5500",
  },
  {
    name: "Panchagarh - Cinema Hall Mor Branch",
    division: "Rangpur",
    district: "Panchagarh",
    address: "Main Road, Panchagarh 5000",
  },
  {
    name: "Thakurgaon - Old Bus Stand Branch",
    division: "Rangpur",
    district: "Thakurgaon",
    address: "Old Bus Stand, Thakurgaon 5100",
  },

  // Mymensingh Division (4)
  {
    name: "Mymensingh - Ganginarpar Branch",
    division: "Mymensingh",
    district: "Mymensingh",
    address: "Station Road, Ganginarpar, Mymensingh 2200",
  },
  {
    name: "Jamalpur - Station Road Branch",
    division: "Mymensingh",
    district: "Jamalpur",
    address: "Bazar Mor, Jamalpur 2000",
  },
  {
    name: "Netrokona - Choto Bazar Branch",
    division: "Mymensingh",
    district: "Netrokona",
    address: "Choto Bazar, Netrokona 2400",
  },
  {
    name: "Sherpur - Raghunath Bazar Branch",
    division: "Mymensingh",
    district: "Sherpur",
    address: "Main Road, Sherpur 2100",
  },
];

/**
 * 1. Public: Get All 64 Branches (`GET /api/branches/public`)
 */
export const getPublicBranches = async (req: Request, res: Response) => {
  try {
    const { division, search } = req.query;

    let branches = await Branch.find({ status: "active" }).sort({
      division: 1,
      name: 1,
    });

    // Seed/Fallback if DB is fresh
    if (!branches || branches.length === 0) {
      branches = BANGLADESH_64_DISTRICTS.map((item, index) => ({
        _id: `BR-${(index + 1).toString().padStart(2, "0")}` as any,
        name: item.name,
        division: item.division as any,
        district: item.district,
        address: item.address,
        adminName: "Branch Manager",
        adminEmail: `${item.district.toLowerCase().replace(/\s+/g, "")}.admin@fitora.com.bd`,
        adminPhone: "+880 1700-000000",
        totalMembers: 200 + (index % 15) * 20,
        maxCapacity: 400,
        monthlyRevenueBDT: 300000 + (index % 10) * 25000,
        activeNow: 15 + (index % 20),
        equipmentCount: 50 + (index % 20),
        trainersCount: 6,
        status: "active" as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      })) as any;
    }

    let filtered = branches;

    if (division && division !== "All") {
      filtered = filtered.filter(
        (b) => b.division.toLowerCase() === String(division).toLowerCase(),
      );
    }

    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.district.toLowerCase().includes(q) ||
          b.division.toLowerCase().includes(q) ||
          b.address.toLowerCase().includes(q),
      );
    }

    return res.status(200).json({
      success: true,
      count: filtered.length,
      totalBranchesNationwide: 64,
      data: filtered,
    });
  } catch (error: any) {
    console.error("Error fetching public branches:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching branch directory.",
      error: error.message,
    });
  }
};

/**
 * 2. Admin: Get Comprehensive 64 Branches Overview (`GET /api/branches/admin-overview`)
 */
export const getAdminBranches = async (req: AuthRequest, res: Response) => {
  try {
    let branches = await Branch.find().sort({ division: 1, name: 1 });

    if (!branches || branches.length === 0) {
      branches = BANGLADESH_64_DISTRICTS.map((item, index) => ({
        _id: `BR-${(index + 1).toString().padStart(2, "0")}` as any,
        name: item.name,
        division: item.division as any,
        district: item.district,
        address: item.address,
        adminName: "Branch Manager",
        adminEmail: `${item.district.toLowerCase().replace(/\s+/g, "")}.admin@fitora.com.bd`,
        adminPhone: `+880 1711-000${(100 + index).toString()}`,
        totalMembers: 220 + (index % 12) * 15,
        maxCapacity: 450,
        monthlyRevenueBDT: 350000 + (index % 8) * 30000,
        activeNow: 20 + (index % 25),
        equipmentCount: 55 + (index % 15),
        trainersCount: 7,
        status: "active" as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      })) as any;
    }

    return res.status(200).json({
      success: true,
      count: branches.length,
      data: branches,
    });
  } catch (error: any) {
    console.error("Error in getAdminBranches:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching admin branch overview.",
      error: error.message,
    });
  }
};

export default {
  getPublicBranches,
  getAdminBranches,
  BANGLADESH_64_DISTRICTS,
};
