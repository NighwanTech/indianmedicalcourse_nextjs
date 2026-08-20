import { prisma } from "@/lib/db";
import { SettingGroup } from "@prisma/client";

export class SettingsRepository {
  async getSettingsByGroup(group: SettingGroup) {
    try {
      const settings = await prisma.siteSetting.findMany({
        where: { settingGroup: group },
      });
      const map: Record<string, string> = {};
      settings.forEach((s) => {
        map[s.settingKey] = s.settingValue;
      });
      return map;
    } catch {
      return {};
    }
  }

  async getAllSettings() {
    try {
      const settings = await prisma.siteSetting.findMany();
      const map: Record<string, string> = {};
      settings.forEach((s) => {
        map[s.settingKey] = s.settingValue;
      });
      return map;
    } catch {
      return {};
    }
  }

  async updateSetting(key: string, value: string, group: SettingGroup, description?: string) {
    return await prisma.siteSetting.upsert({
      where: { settingKey: key },
      update: { settingValue: value },
      create: {
        settingKey: key,
        settingGroup: group,
        settingValue: value,
        description,
      },
    });
  }
}

export const settingsRepository = new SettingsRepository();
