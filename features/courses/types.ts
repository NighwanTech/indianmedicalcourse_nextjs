import { CourseType, DeliveryMode } from "@prisma/client";

export interface CourseFilterDTO {
  categoryId?: number;
  categorySlug?: string;
  courseType?: CourseType;
  deliveryMode?: DeliveryMode;
  search?: string;
  isFeatured?: boolean;
}
