import { prisma } from "@/lib/db";

export interface HomepageSectionDTO {
  sectionKey: string;
  name: string;
  isEnabled: boolean;
  displayOrder: number;
  contentJson?: any;
  styleJson?: any;
}

export class HomepageRepository {
  async getSections() {
    try {
      const sections = await prisma.homepageSection.findMany({
        where: { isEnabled: true },
        orderBy: { displayOrder: "asc" },
      });
      return sections;
    } catch {
      return [];
    }
  }

  async getAllSectionsAdmin() {
    try {
      return await prisma.homepageSection.findMany({
        orderBy: { displayOrder: "asc" },
      });
    } catch {
      return [];
    }
  }

  async updateSection(sectionKey: string, data: Partial<HomepageSectionDTO>) {
    return await prisma.homepageSection.upsert({
      where: { sectionKey },
      update: data,
      create: {
        sectionKey,
        name: data.name || sectionKey,
        isEnabled: data.isEnabled ?? true,
        displayOrder: data.displayOrder ?? 0,
        contentJson: data.contentJson,
        styleJson: data.styleJson,
      },
    });
  }
}

export const homepageRepository = new HomepageRepository();
