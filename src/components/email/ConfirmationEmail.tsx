import * as React from "react";
import { publicConfig } from "@/lib/config";

interface ConfirmationEmailProps {
  firstName: string;
  service: string;
}

export const ConfirmationEmail: React.FC<Readonly<ConfirmationEmailProps>> = ({
  firstName,
  service,
}) => (
  <div style={{
    fontFamily: "'Inter', sans-serif",
    color: publicConfig.brandTextDark,
    backgroundColor: "#FDFDFD",
    padding: "40px 20px",
    maxWidth: "600px",
    margin: "0 auto",
    borderRadius: "16px",
    border: "1px solid #EFEFEF"
  }}>
    <div style={{ textAlign: "center", marginBottom: "30px" }}>
      <img 
        src={`${publicConfig.siteUrl}${publicConfig.logo}`} 
        alt={`${publicConfig.businessName} Logo`} 
        style={{ width: "60px", height: "60px", marginBottom: "15px" }}
      />
      <h1 style={{
        fontSize: "24px",
        fontWeight: "bold",
        letterSpacing: "-0.02em",
        color: publicConfig.brandPrimary,
        margin: "0 0 10px 0"
      }}>
        {publicConfig.businessName}
      </h1>
      <div style={{ height: "4px", width: "40px", backgroundColor: publicConfig.brandPrimary, margin: "0 auto", borderRadius: "10px" }} />
    </div>

    <div style={{
      backgroundColor: "#FFFFFF",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
    }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>
        Hi {firstName},
      </h2>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#4A4A4A", marginBottom: "20px" }}>
        Thank you for reaching out to us about your <strong>{service}</strong> project. We&apos;ve received your request and are excited to help you transform your outdoor space.
      </p>

      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#4A4A4A", marginBottom: "20px" }}>
        {publicConfig.founder.name} or a member of our design team will review your details and get back to you within <strong>24-48 hours</strong> to discuss the next steps.
      </p>

      <div style={{
        padding: "20px",
        backgroundColor: "#F9FAF9",
        borderRadius: "8px",
        borderLeft: `4px solid ${publicConfig.brandPrimary}`,
        marginBottom: "25px"
      }}>
        <p style={{ fontSize: "14px", margin: "0", color: "#2D3E2D", fontWeight: "600" }}>
          Service Requested: {service}
        </p>
      </div>

      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#4A4A4A", marginBottom: "20px" }}>
        In the meantime, if you have any questions, feel free to reach out to us at <a href={`mailto:${publicConfig.businessEmail}`} style={{ color: publicConfig.brandPrimary, textDecoration: "underline" }}>{publicConfig.businessEmail}</a> or give us a call at <a href={`tel:${publicConfig.businessPhone.replace(/\D/g, '')}`} style={{ color: publicConfig.brandPrimary, textDecoration: "underline" }}>{publicConfig.businessPhone}</a>.
      </p>
    </div>

    <div style={{ textAlign: "center", marginTop: "30px", fontSize: "12px", color: "#A0A0A0" }}>
      <p>© {new Date().getFullYear()} {publicConfig.businessName}. All rights reserved.</p>
      <p>{publicConfig.businessLocation} | {publicConfig.businessPhone}</p>
    </div>
  </div>
);
