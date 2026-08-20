import { prisma } from "@/lib/db";
import { CourseFilterDTO } from "./types";
import { Prisma } from "@prisma/client";
import { courses as fallbackCourses } from "@/lib/data";

export class CourseRepository {
  async getCourses(filters: CourseFilterDTO) {
    try {
      const where: Prisma.CourseWhereInput = { isActive: true };

      if (filters.categoryId) where.categoryId = filters.categoryId;
      if (filters.categorySlug) where.category = { slug: filters.categorySlug };
      if (filters.courseType) where.courseType = filters.courseType;
      if (filters.deliveryMode) where.deliveryMode = filters.deliveryMode;
      if (filters.isFeatured) where.isFeatured = filters.isFeatured;
      if (filters.search) {
        where.OR = [
          { title: { contains: filters.search } },
          { tagline: { contains: filters.search } },
        ];
      }

      const list = await prisma.course.findMany({
        where,
        include: {
          category: true,
          facultyMembers: { include: { faculty: true } },
          downloads: true,
          faqs: true,
        },
        orderBy: { totalEnrolled: "desc" },
      });

      if (list && list.length > 0) return list;
      return fallbackCourses;
    } catch {
      return fallbackCourses;
    }
  }

  async getCourseBySlug(slug: string) {
    try {
      const course = await prisma.course.findUnique({
        where: { slug },
        include: {
          category: true,
          facultyMembers: { include: { faculty: true } },
          downloads: true,
          faqs: true,
          galleryImages: { include: { media: true } },
        },
      });
      if (course) return course;
      return fallbackCourses.find((c) => c.slug === slug) || null;
    } catch {
      return fallbackCourses.find((c) => c.slug === slug) || null;
    }
  }
}

export const courseRepository = new CourseRepository();
