import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug") || "admin_sidebar";

    const menu = await prisma.menu.findUnique({
      where: { slug },
      include: {
        items: {
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    if (!menu) {
      return NextResponse.json({ success: true, items: [] }, { status: 200 });
    }

    return NextResponse.json({ success: true, menu, items: menu.items }, { status: 200 });
  } catch (error: any) {
    console.error("[Menus API GET] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load menu items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { menuSlug = "admin_sidebar", label, url, icon, permission, badgeText, badgeColor, isVisible, displayOrder } = body;

    if (!label || !url) {
      return NextResponse.json(
        { error: "Label and URL are required" },
        { status: 400 }
      );
    }

    let menu = await prisma.menu.findUnique({ where: { slug: menuSlug } });
    if (!menu) {
      menu = await prisma.menu.create({
        data: {
          slug: menuSlug,
          name: menuSlug.replace("_", " ").toUpperCase(),
          isActive: true,
        },
      });
    }

    const newItem = await prisma.menuItem.create({
      data: {
        menuId: menu.id,
        label,
        url,
        icon: icon || "Folder",
        permission: permission || "ALL",
        badgeText: badgeText || null,
        badgeColor: badgeColor || null,
        isVisible: isVisible ?? true,
        isActive: true,
        displayOrder: displayOrder ?? 99,
      },
    });

    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (error: any) {
    console.error("[Menus API POST] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create menu item" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { menuSlug = "admin_sidebar", items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Items must be an array" },
        { status: 400 }
      );
    }

    let menu = await prisma.menu.findUnique({ where: { slug: menuSlug } });
    if (!menu) {
      menu = await prisma.menu.create({
        data: {
          slug: menuSlug,
          name: menuSlug.replace("_", " ").toUpperCase(),
          isActive: true,
        },
      });
    }

    // Upsert each item in the menu
    for (let index = 0; index < items.length; index++) {
      const it = items[index];
      const displayOrder = index + 1;

      if (it.id && typeof it.id === "number" && it.id < 1000000000) {
        // Update existing item
        await prisma.menuItem.updateMany({
          where: { id: it.id, menuId: menu.id },
          data: {
            label: it.label,
            url: it.url,
            icon: it.icon,
            permission: it.permission,
            badgeText: it.badgeText || null,
            badgeColor: it.badgeColor || null,
            isVisible: it.isVisible ?? true,
            displayOrder,
          },
        });
      } else {
        // Create newly added item
        await prisma.menuItem.create({
          data: {
            menuId: menu.id,
            label: it.label,
            url: it.url,
            icon: it.icon || "Folder",
            permission: it.permission || "ALL",
            badgeText: it.badgeText || null,
            badgeColor: it.badgeColor || null,
            isVisible: it.isVisible ?? true,
            isActive: true,
            displayOrder,
          },
        });
      }
    }

    const updatedMenu = await prisma.menu.findUnique({
      where: { slug: menuSlug },
      include: {
        items: {
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Menu configuration saved successfully to MySQL database!",
      items: updatedMenu?.items || [],
    });
  } catch (error: any) {
    console.error("[Menus API PUT] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update menu configuration" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }

    await prisma.menuItem.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: "Menu item deleted successfully" });
  } catch (error: any) {
    console.error("[Menus API DELETE] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete menu item" },
      { status: 500 }
    );
  }
}
