import React from "react";
import { siteSettings } from "@/lib/data";

export function GeoMedicalSchema() {
  const geoSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["EducationalOrganization", "MedicalOrganization", "LocalBusiness"],
        "@id": "https://indianmedicalcourse.com/#organization",
        "name": "Indian Medical Course",
        "alternateName": ["IMC", "Indian Medical Courses", "IMC India"],
        "url": "https://indianmedicalcourse.com",
        "logo": "https://indianmedicalcourse.com/images/imc-logo.png",
        "image": "https://indianmedicalcourse.com/images/imc-logo.png",
        "description": "Premier medical education platform offering CPD-accredited post-graduate clinical fellowships, PG diplomas, and hospital observer-ships for doctors across India and internationally.",
        "telephone": siteSettings.hotlinePhone,
        "email": siteSettings.admissionsEmail,
        "priceRange": "₹45,000 - ₹2,20,000",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Narayni Polly clinic dhimshri shamshabad near police chowk and DAV inter College",
          "addressLocality": "Agra",
          "addressRegion": "Uttar Pradesh",
          "postalCode": "283125",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 27.1767,
          "longitude": 78.0081
        },
        "areaServed": [
          {
            "@type": "Country",
            "name": "India"
          },
          {
            "@type": "Country",
            "name": "United Arab Emirates"
          },
          {
            "@type": "Country",
            "name": "Saudi Arabia"
          },
          {
            "@type": "Country",
            "name": "United Kingdom"
          },
          {
            "@type": "Country",
            "name": "Nepal"
          },
          {
            "@type": "Country",
            "name": "Bangladesh"
          },
          {
            "@type": "Country",
            "name": "Oman"
          },
          {
            "@type": "Country",
            "name": "Kuwait"
          },
          {
            "@type": "Country",
            "name": "Qatar"
          }
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Medical Fellowship & PG Diploma Catalog",
          "itemListElement": [
            {
              "@type": "Course",
              "name": "Fellowship in Clinical Cardiology",
              "description": "12-Month hybrid clinical cardiology training with ICU & Echo hands-on rotations.",
              "provider": { "@id": "https://indianmedicalcourse.com/#organization" }
            },
            {
              "@type": "Course",
              "name": "Fellowship in Critical Care Medicine",
              "description": "Comprehensive ventilator, ICU, and ECMO bedside management.",
              "provider": { "@id": "https://indianmedicalcourse.com/#organization" }
            },
            {
              "@type": "Course",
              "name": "Fellowship in Laparoscopic Surgery",
              "description": "Hands-on minimal access wet lab training with OT live cases.",
              "provider": { "@id": "https://indianmedicalcourse.com/#organization" }
            }
          ]
        },
        "medicalSpecialty": [
          "Cardiovascular",
          "Critical Care",
          "Emergency",
          "Dermatology",
          "Obstetrics and Gynecology",
          "Surgery"
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "2480",
          "bestRating": "5",
          "worstRating": "1"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(geoSchema) }}
    />
  );
}
