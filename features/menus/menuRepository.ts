import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";

export class MenuRepository {
  async getMenuBySlug(slug: string, userRole?: Role) {
    try {
      const menu = await prisma.menu.findUnique({
        where: { slug, isActive: true },
        include: {
          items: {
            where: {
              isActive: true,
              isVisible: true,
            },
            orderBy: { displayOrder: "asc" },
            include: {
              children: {
                where: { isActive: true, isVisible: true },
                orderBy: { displayOrder: "asc" },
              },
            },
          },
        },
      });

      if (!menu) return null;

      // Filter by role permission if specified
      if (userRole) {
        menu.items = menu.items.filter((item) => {
          const perm = item.permission || "ALL";
          if (perm === "ALL") return true;
          
          // Super Admin can access everything
          if (userRole === "SUPER_ADMIN") return true;
          
          // For non-Super Admin users:
          if (perm === "SUPER_ADMIN") return false;
          if (perm === "ADMIN") return userRole === "ADMIN";
          if (perm === "COUNSELLOR") return userRole === "ADMIN" || userRole === "COUNSELLOR";
          if (perm === "EDITOR") return userRole === "ADMIN" || userRole === "EDITOR";
          
          return true;
        });
      }

      return menu;
    } catch (error) {
      console.warn(`[MenuRepository] Failed to fetch menu '${slug}' from database:`, error);
      return null;
    }
  }

  async getAllMenus() {
    try {
      return await prisma.menu.findMany({
        include: {
          items: {
            orderBy: { displayOrder: "asc" },
            include: { children: { orderBy: { displayOrder: "asc" } } },
          },
        },
      });
    } catch {
      return [];
    }
  }

  async upsertMenuItem(data: {
    id?: number;
    menuId: number;
    parentId?: number | null;
    label: string;
    url: string;
    icon?: string;
    permission?: string;
    badgeText?: string;
    badgeColor?: string;
    displayOrder: number;
    isVisible?: boolean;
    isActive?: boolean;
    openInNewTab?: boolean;
  }) {
    if (data.id) {
      return await prisma.menuItem.update({
        where: { id: data.id },
        data,
      });
    }
    return await prisma.menuItem.create({
      data: {
        menuId: data.menuId,
        parentId: data.parentId,
        label: data.label,
        url: data.url,
        icon: data.icon,
        permission: data.permission,
        badgeText: data.badgeText,
        badgeColor: data.badgeColor,
        displayOrder: data.displayOrder,
        isVisible: data.isVisible ?? true,
        isActive: data.isActive ?? true,
        openInNewTab: data.openInNewTab ?? false,
      },
    });
  }

  async deleteMenuItem(id: number) {
    return await prisma.menuItem.delete({ where: { id } });
  }
}

export const menuRepository = new MenuRepository();
