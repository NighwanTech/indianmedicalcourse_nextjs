import { prisma } from "@/lib/db";

export interface CreatePartnerInput {
  name: string;
  logoUrl?: string;
  partnerType?: string; // e.g. "HOSPITAL" | "UNIVERSITY" | "ACCREDITATION" | "RESEARCH" or custom label
  location?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdatePartnerInput extends Partial<CreatePartnerInput> {
  id: number;
}

export class PartnerRepository {
  async getAllPartners(category?: string) {
    try {
      const where: any = {};
      if (category && category !== "ALL") {
        where.partnerType = { contains: category };
      }

      return await prisma.partner.findMany({
        where,
        orderBy: { displayOrder: "asc" },
      });
    } catch (error) {
      console.error("[PartnerRepository] getAllPartners error:", error);
      return [];
    }
  }

  async getActivePartners(category?: string) {
    try {
      const where: any = { isActive: true };
      if (category && category !== "ALL") {
        where.partnerType = { contains: category };
      }

      return await prisma.partner.findMany({
        where,
        orderBy: { displayOrder: "asc" },
      });
    } catch (error) {
      console.error("[PartnerRepository] getActivePartners error:", error);
      return [];
    }
  }

  async getPartnerById(id: number) {
    try {
      return await prisma.partner.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error("[PartnerRepository] getPartnerById error:", error);
      return null;
    }
  }

  async createPartner(data: CreatePartnerInput) {
    return await prisma.partner.create({
      data: {
        name: data.name,
        logoUrl: data.logoUrl || null,
        partnerType: data.partnerType || "HOSPITAL",
        location: data.location || "Pan-India",
        displayOrder: data.displayOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });
  }

  async updatePartner(data: UpdatePartnerInput) {
    const { id, ...updateData } = data;
    return await prisma.partner.update({
      where: { id },
      data: updateData,
    });
  }

  async deletePartner(id: number) {
    return await prisma.partner.delete({
      where: { id },
    });
  }

  async seedDefaultPartners() {
    const defaultPartners = [
      {
        name: "Apollo Hospitals",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Apollo_Hospitals_Logo.svg/1200px-Apollo_Hospitals_Logo.svg.png",
        location: "Pan-India Network",
        partnerType: "HOSPITAL",
        displayOrder: 1,
        isActive: true,
      },
      {
        name: "Fortis Healthcare",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Fortis_Healthcare_Logo.svg/1200px-Fortis_Healthcare_Logo.svg.png",
        location: "Delhi-NCR, Bengaluru, Mumbai",
        partnerType: "HOSPITAL",
        displayOrder: 2,
        isActive: true,
      },
      {
        name: "Max Healthcare",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Max_Healthcare_Logo.svg/1200px-Max_Healthcare_Logo.svg.png",
        location: "North India Network",
        partnerType: "HOSPITAL",
        displayOrder: 3,
        isActive: true,
      },
      {
        name: "Medanta - The Medicity",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Medanta_The_Medicity_Logo.svg/1200px-Medanta_The_Medicity_Logo.svg.png",
        location: "Gurugram, Lucknow",
        partnerType: "HOSPITAL",
        displayOrder: 4,
        isActive: true,
      },
      {
        name: "Manipal Hospitals",
        logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6f/Manipal_Hospitals_logo.svg/1200px-Manipal_Hospitals_logo.svg.png",
        location: "Bengaluru, Mangalore, Jaipur",
        partnerType: "HOSPITAL",
        displayOrder: 5,
        isActive: true,
      },
      {
        name: "Narayana Health",
        logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Narayana_Health_logo.svg/1200px-Narayana_Health_logo.svg.png",
        location: "Bengaluru, Kolkata, Delhi",
        partnerType: "HOSPITAL",
        displayOrder: 6,
        isActive: true,
      },
      {
        name: "CPD Standards Office (UK)",
        logoUrl: "https://www.cpdstandards.com/wp-content/uploads/2019/04/CPD-Provider-Logo-transparent-white-bg-300x150.png",
        location: "United Kingdom",
        partnerType: "ACCREDITATION",
        displayOrder: 7,
        isActive: true,
      },
      {
        name: "Royal College Affiliated Academy",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Royal_College_of_Surgeons_of_England_logo.svg/1200px-Royal_College_of_Surgeons_of_England_logo.svg.png",
        location: "London, UK & International",
        partnerType: "UNIVERSITY",
        displayOrder: 8,
        isActive: true,
      },
    ];

    for (const partner of defaultPartners) {
      const existing = await prisma.partner.findFirst({
        where: { name: partner.name },
      });
      if (!existing) {
        await prisma.partner.create({ data: partner });
      }
    }

    return await this.getAllPartners();
  }
}

export const partnerRepository = new PartnerRepository();
