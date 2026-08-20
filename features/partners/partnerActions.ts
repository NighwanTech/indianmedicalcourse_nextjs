export async function createPartnerAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const name = formData.get("name") as string;
  if (!name || !name.trim()) {
    return { success: false, error: "Partner name is required." };
  }
  return { success: true };
}

export async function updatePartnerAction(idOrFormData?: any, formData?: any): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}

export async function deletePartnerAction(id: number): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}

export async function seedDefaultPartnersAction(): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}
