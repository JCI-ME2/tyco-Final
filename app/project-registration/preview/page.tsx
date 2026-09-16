"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, Send, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearCart } from "@/lib/cart";

type CartItem = {
  quantity: number;
  modelNumber: string;
  description: string;
};

type RegistrationData = {
  name: string;
  email: string;
  projectName: string;
  company: string;
  phoneNumber: string;
  jciSalesEmail: string;
  country: string;
  estimatedOrderDate: string;
  endUserCompanyName: string;
  endUserContactPerson: string;
  endUserPhoneNumber: string;
  endUserEmail: string;
  endUserCity: string;
  contractorCompanyName: string;
  contractorContactPerson: string;
  contractorPhoneNumber: string;
  contractorEmail: string;
  contractorCity: string;
  hasProjectSpecification: string;
  brands: string[];
  projectDescription: string;
  cartItems: CartItem[];
};

export default function EmailPreviewPage() {
  const router = useRouter();
  const [data, setData] = useState<RegistrationData | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("registrationData");
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      router.push("/project-registration");
    }
  }, [router]);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  const generateWordBlob = (): { blob: Blob; filename: string } => {
    const filename = `Project_Registration_${data!.projectName.replace(/\s+/g, "_")}.doc`;
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Project Registration - ${data!.projectName}</title>
        <style>
          body { font-family: Arial, sans-serif; font-size: 12pt; }
          h1 { font-size: 18pt; color: #1e3a5f; }
          h2 { font-size: 14pt; color: #1e3a5f; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 20px; }
          table { border-collapse: collapse; width: 100%; margin: 10px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .section { margin-bottom: 20px; }
          .label { font-weight: bold; color: #555; }
        </style>
      </head>
      <body>
        <h1>Project Registration</h1>
        <div class="section">
          <h2>General Information</h2>
          <p><span class="label">Name:</span> ${data!.name}</p>
          <p><span class="label">E-mail:</span> ${data!.email}</p>
          <p><span class="label">Project Name:</span> ${data!.projectName}</p>
        </div>
        <div class="section">
          <h2>Partner Information</h2>
          <p><span class="label">Company:</span> ${data!.company}</p>
          <p><span class="label">Phone Number:</span> ${data!.phoneNumber}</p>
          <p><span class="label">JCI Sales Contact Email:</span> ${data!.jciSalesEmail}</p>
          <p><span class="label">Country:</span> ${data!.country}</p>
        </div>
        <div class="section">
          <h2>Estimated Order Date</h2>
          <p>${data!.estimatedOrderDate}</p>
        </div>
        <div class="section">
          <h2>Customer Information</h2>
          <table>
            <tr><th></th><th>End User</th><th>Contractor/Distributor</th></tr>
            <tr><td class="label">Company Name</td><td>${data!.endUserCompanyName}</td><td>${data!.contractorCompanyName || "N/A"}</td></tr>
            <tr><td class="label">Contact Person</td><td>${data!.endUserContactPerson}</td><td>${data!.contractorContactPerson || "N/A"}</td></tr>
            <tr><td class="label">Phone Number</td><td>${data!.endUserPhoneNumber}</td><td>${data!.contractorPhoneNumber || "N/A"}</td></tr>
            <tr><td class="label">E-mail</td><td>${data!.endUserEmail}</td><td>${data!.contractorEmail || "N/A"}</td></tr>
            <tr><td class="label">City</td><td>${data!.endUserCity}</td><td>${data!.contractorCity || "N/A"}</td></tr>
          </table>
        </div>
        <div class="section">
          <h2>Project Specification</h2>
          <p>${data!.hasProjectSpecification === "yes" ? "Yes" : "No"}</p>
        </div>
        <div class="section">
          <h2>Brands</h2>
          <p>${data!.brands.join(", ") || "None selected"}</p>
        </div>
        <div class="section">
          <h2>Project Description</h2>
          <p>${data!.projectDescription || "N/A"}</p>
        </div>
        <div class="section">
          <h2>Model Numbers and Quantities</h2>
          <table>
            <tr><th>Quantity</th><th>Model Number</th><th>Description</th></tr>
            ${data!.cartItems.map((item) => `<tr><td>${item.quantity}</td><td>${item.modelNumber}</td><td>${item.description || "N/A"}</td></tr>`).join("")}
          </table>
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: "application/msword" });
    return { blob, filename };
  };

  const downloadWordFile = () => {
    const { blob, filename } = generateWordBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendEmail = () => {
    setSending(true);

    // Download the Word file automatically so the user can manually attach it
    downloadWordFile();

    const subject = encodeURIComponent(`Project Registration: ${data!.projectName}`);
    const wordFilename = `Project_Registration_${data!.projectName.replace(/\s+/g, "_")}.doc`;
    const body = encodeURIComponent(
      `NOTE:\n\nA Word document copy (${wordFilename}) has been downloaded to your device.\n\nPlease attach it to this email before sending.`
    );
    const to = encodeURIComponent(data!.jciSalesEmail);
    const cc = encodeURIComponent(data!.email);

    setTimeout(() => {
      window.location.href = `mailto:${to}?cc=${cc}&subject=${subject}&body=${body}`;
      setSending(false);
      setSent(true);
      clearCart();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-[1200px]">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/jci-logo-pages.png`}
            alt="Johnson Controls"
            width={140}
            height={40}
            className="h-10 w-auto"
          />
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 py-8">
        <Link
          href="/project-registration"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Form
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800">Email Preview</h1>
          <p className="mt-2 text-sm text-slate-600">
            Review the registration details below before sending
          </p>
        </div>

        {sent && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-center">
            <p className="text-green-800 font-medium">
              Email client opened and Word document downloaded! Please attach the downloaded .doc file to your email before sending.
            </p>
            <Link href="/" className="text-green-600 underline text-sm mt-2 inline-block">
              Return to Home
            </Link>
          </div>
        )}

        {/* Email Preview Card */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Email Header */}
          <div className="border-b border-slate-200 p-6">
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold text-slate-700">To:</span>{" "}
                <span className="text-slate-600">{data.jciSalesEmail}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-700">CC:</span>{" "}
                <span className="text-slate-600">{data.email}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-700">Subject:</span>{" "}
                <span className="text-slate-600">Project Registration: {data.projectName}</span>
              </p>
            </div>
          </div>

          {/* Email Body */}
          <div className="p-6 space-y-6">
            {/* General Information */}
            <section>
              <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-3">
                General Information
              </h3>
              <div className="grid gap-2 text-sm">
                <p><span className="font-medium text-slate-700">Name:</span> {data.name}</p>
                <p><span className="font-medium text-slate-700">E-mail:</span> {data.email}</p>
                <p><span className="font-medium text-slate-700">Project Name:</span> {data.projectName}</p>
              </div>
            </section>

            {/* Partner Information */}
            <section>
              <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-3">
                Partner Information
              </h3>
              <div className="grid gap-2 text-sm">
                <p><span className="font-medium text-slate-700">Company:</span> {data.company}</p>
                <p><span className="font-medium text-slate-700">Phone Number:</span> {data.phoneNumber}</p>
                <p><span className="font-medium text-slate-700">JCI Sales Contact Email:</span> {data.jciSalesEmail}</p>
                <p><span className="font-medium text-slate-700">Country:</span> {data.country}</p>
              </div>
            </section>

            {/* Estimated Order Date */}
            <section>
              <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-3">
                Estimated Order Date
              </h3>
              <p className="text-sm text-slate-600">{data.estimatedOrderDate}</p>
            </section>

            {/* Customer Information */}
            <section>
              <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-3">
                Customer Information
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-4 py-2 text-left font-medium text-slate-700"></th>
                      <th className="px-4 py-2 text-left font-medium text-slate-700">End User</th>
                      <th className="px-4 py-2 text-left font-medium text-slate-700">Contractor/Distributor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-4 py-2 font-medium text-slate-700">Company Name</td>
                      <td className="px-4 py-2 text-slate-600">{data.endUserCompanyName}</td>
                      <td className="px-4 py-2 text-slate-600">{data.contractorCompanyName || "N/A"}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium text-slate-700">Contact Person</td>
                      <td className="px-4 py-2 text-slate-600">{data.endUserContactPerson}</td>
                      <td className="px-4 py-2 text-slate-600">{data.contractorContactPerson || "N/A"}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium text-slate-700">Phone Number</td>
                      <td className="px-4 py-2 text-slate-600">{data.endUserPhoneNumber}</td>
                      <td className="px-4 py-2 text-slate-600">{data.contractorPhoneNumber || "N/A"}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium text-slate-700">E-mail</td>
                      <td className="px-4 py-2 text-slate-600">{data.endUserEmail}</td>
                      <td className="px-4 py-2 text-slate-600">{data.contractorEmail || "N/A"}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium text-slate-700">City</td>
                      <td className="px-4 py-2 text-slate-600">{data.endUserCity}</td>
                      <td className="px-4 py-2 text-slate-600">{data.contractorCity || "N/A"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Project Specification */}
            <section>
              <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-3">
                Project Specification
              </h3>
              <p className="text-sm text-slate-600">{data.hasProjectSpecification === "yes" ? "Yes" : "No"}</p>
            </section>

            {/* Brands */}
            <section>
              <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-3">
                Brands
              </h3>
              <p className="text-sm text-slate-600">{data.brands.join(", ") || "None selected"}</p>
            </section>

            {/* Project Description */}
            <section>
              <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-3">
                Project Description
              </h3>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{data.projectDescription || "N/A"}</p>
            </section>

            {/* Model Numbers and Quantities */}
            <section>
              <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-3">
                Model Numbers and Quantities
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-4 py-2 text-left font-medium text-slate-700">Quantity</th>
                      <th className="px-4 py-2 text-left font-medium text-slate-700">Model Number</th>
                      <th className="px-4 py-2 text-left font-medium text-slate-700">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.cartItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-slate-600">{item.quantity}</td>
                        <td className="px-4 py-2 font-mono text-brand">{item.modelNumber}</td>
                        <td className="px-4 py-2 text-slate-600">{item.description || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>

        {/* Instruction note */}
        <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 px-6 py-4 text-sm text-amber-900">
          <p className="font-semibold mb-2">Once you click Send email:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Your email client software will open a draft email</li>
            <li>The browser will download a word file with all registration data</li>
          </ul>
          <p className="mt-2 font-semibold">Please attach this file to the email.</p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <Button
            onClick={downloadWordFile}
            variant="outline"
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Export to Word
          </Button>
          <Button
            onClick={handleSendEmail}
            disabled={sending || sent}
            className="gap-2 bg-brand hover:bg-brand/90"
          >
            <Send className="h-4 w-4" />
            {sending ? "Opening Email Client..." : sent ? "Email Client Opened" : "Send Email"}
          </Button>
        </div>
      </main>
    </div>
  );
}
