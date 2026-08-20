import { menuRepository } from "./menuRepository";
import { Role } from "@prisma/client";

export class MenuService {
  async getSidebarMenu(userRole: Role = "SUPER_ADMIN") {
    return await menuRepository.getMenuBySlug("admin_sidebar", userRole);
  }

  async getHeaderMenu() {
    return await menuRepository.getMenuBySlug("header_nav");
  }

  async getFooterMenu(slug: string) {
    return await menuRepository.getMenuBySlug(slug);
  }

  async listAllMenus() {
    return await menuRepository.getAllMenus();
  }
}

export const menuService = new MenuService();
