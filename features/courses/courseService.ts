import { courseRepository } from "./courseRepository";
import { CourseFilterDTO } from "./types";
import { NotFoundError } from "@/lib/errors/AppError";

export class CourseService {
  async listCourses(filters: CourseFilterDTO = {}) {
    return await courseRepository.getCourses(filters);
  }

  async getCourseDetails(slug: string) {
    const course = await courseRepository.getCourseBySlug(slug);
    if (!course) {
      throw new NotFoundError("Course", slug);
    }
    return course;
  }
}

export const courseService = new CourseService();
