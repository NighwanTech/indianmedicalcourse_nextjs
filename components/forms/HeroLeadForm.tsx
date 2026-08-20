"use client";

import React from "react";
import { UniversalAdmissionForm } from "./UniversalAdmissionForm";
import { LeadSubmissionPayload } from "@/types";

interface HeroLeadFormProps {
  initialCourseId?: number;
  source?: LeadSubmissionPayload["leadSource"];
  onSuccess?: () => void;
}

export function HeroLeadForm({ initialCourseId, source = "HERO_FORM", onSuccess }: HeroLeadFormProps) {
  return (
    <UniversalAdmissionForm
      source={source}
      title="Fast-Track Your Medical Career"
      subtitle="Advance your clinical expertise with complimentary Certification, Fellowship, and PG Diploma courses. Explore curated CPD-accredited programs."
      onSuccess={onSuccess}
    />
  );
}
