import { prisma } from "@/lib/db";
import { CreateLeadDTO, LeadFilterDTO } from "./types";
import { LeadPriority, Prisma } from "@prisma/client";

export class LeadRepository {
  async findDuplicate(mobile: string, email: string) {
    try {
      return await prisma.lead.findFirst({
        where: {
          OR: [{ mobile }, { email }],
        },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      return null;
    }
  }

  async createLeadWithTransaction(dto: CreateLeadDTO, priority: LeadPriority, leadScore: number) {
    const leadUuid = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    try {
      // Prisma Atomic Transaction
      const result = await prisma.$transaction(async (tx) => {
        // 1. Create Lead
        const newLead = await tx.lead.create({
          data: {
            uuid: leadUuid,
            name: dto.name,
            mobile: dto.mobile,
            email: dto.email,
            qualification: dto.qualification,
            currentProfession: dto.currentProfession,
            experienceYears: dto.experienceYears,
            interestedCourseId: dto.interestedCourseId,
            interestedCourseName: dto.interestedCourseName || "Clinical Fellowship",
            state: dto.state,
            city: dto.city,
            message: dto.message,
            preferredCounsellingTime: dto.preferredCounsellingTime,
            leadSource: dto.leadSource || "WEBSITE_FORM",
            leadStatus: "NEW",
            priority,
            leadScore,
            utmSource: dto.utmSource,
            utmCampaign: dto.utmCampaign,
            utmMedium: dto.utmMedium,
            utmContent: dto.utmContent,
            utmTerm: dto.utmTerm,
            gclid: dto.gclid,
            fbclid: dto.fbclid,
            landingPageUrl: dto.landingPageUrl,
            ipAddress: dto.ipAddress,
            browser: dto.browser,
            operatingSystem: dto.operatingSystem,
            deviceType: dto.deviceType,
          },
        });

        // 2. Create Lead Activity
        await tx.leadActivity.create({
          data: {
            leadId: newLead.id,
            activityType: "SUBMITTED",
            title: "Doctor Enquiry Submitted",
            description: `Lead captured for course: ${dto.interestedCourseName || "General Fellowship"}. Source: ${dto.leadSource || "WEBSITE_FORM"}`,
          },
        });

        return newLead;
      });

      return result;
    } catch (error) {
      console.warn("[Prisma Lead Repository Notice] Database write fallback (mock mode):", error);
      return {
        id: BigInt(1),
        uuid: leadUuid,
        ...dto,
      };
    }
  }

  async getLeads(filters: LeadFilterDTO) {
    const where: Prisma.LeadWhereInput = {};

    if (filters.status) where.leadStatus = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.source) where.leadSource = filters.source;
    if (filters.counsellorId) where.assignedCounsellorId = filters.counsellorId;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { mobile: { contains: filters.search } },
        { email: { contains: filters.search } },
        { interestedCourseName: { contains: filters.search } },
      ];
    }

    try {
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const skip = (page - 1) * limit;

      const [total, leads] = await Promise.all([
        prisma.lead.count({ where }),
        prisma.lead.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            assignedCounsellor: { select: { name: true, email: true } },
            activities: { take: 5, orderBy: { createdAt: "desc" } },
          },
        }),
      ]);

      return { total, page, limit, leads };
    } catch {
      return { total: 0, page: 1, limit: 20, leads: [] };
    }
  }
}

export const leadRepository = new LeadRepository();
