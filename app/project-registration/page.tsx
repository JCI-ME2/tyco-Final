"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

export default function ProjectRegistrationPage() {
  const router = useRouter();
  const cartItems = useCart();

  const [formData, setFormData] = useState({
    // General Information
    name: "",
    email: "",
    projectName: "",
    // Partner Information
    company: "",
    phoneNumber: "",
    jciSalesEmail: "",
    country: "",
    // Estimated Order Date
    estimatedOrderDate: "",
    // Customer Information - End User
    endUserCompanyName: "",
    endUserContactPerson: "",
    endUserPhoneNumber: "",
    endUserEmail: "",
    endUserCity: "",
    // Customer Information - Contractor/Distributor
    contractorCompanyName: "",
    contractorContactPerson: "",
    contractorPhoneNumber: "",
    contractorEmail: "",
    contractorCity: "",
    // Project Specification
    hasProjectSpecification: "",
    // Brands
    brands: [] as string[],
    // Project Details
    projectDescription: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoneInput = (field: string, value: string) => {
    // Strip any non-numeric characters (allow + at start for international)
    const cleaned = value.replace(/[^\d+\-\s()]/g, "");
    setFormData((prev) => ({ ...prev, [field]: cleaned }));
  };

  const blockNonNumericKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End", "Enter", "+", "-", " ", "(", ")"];
    if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleBrandToggle = (brand: string) => {
    setFormData((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store form data in sessionStorage for the preview page
    const registrationData = {
      ...formData,
      cartItems: cartItems.map((item) => ({
        quantity: item.quantity,
        modelNumber: item.partNumber,
        description: item.description || "",
      })),
    };
    
    sessionStorage.setItem("registrationData", JSON.stringify(registrationData));
    router.push("/project-registration/preview");
  };

  const brands = [
    "Illustra",
    "Exacq",
    "American Dynamics",
    "Kantech",
    "Software House",
    "CEM Systems",
    "Accessories",
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-[1200px]">
          <Image
            src="/images/jci-logo-pages.png"
            alt="Johnson Controls"
            width={140}
            height={40}
            className="h-10 w-auto"
          />
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 py-8">
        <Link
          href="/video-solutions/cart"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Cart
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800">Project Registration Form</h1>
          <p className="mt-2 text-sm text-blue-600">Complete the form below to register your project</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* General Information & Partner Information */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* General Information */}
            <section>
              <h2 className="mb-4 border-b border-slate-300 pb-2 text-lg font-semibold text-slate-800">
                General Information
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm text-slate-600">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Required"
                    required
                    className="mt-1 bg-slate-100 border-slate-200"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm text-slate-600">
                    E-mail <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Required"
                    required
                    className="mt-1 bg-slate-100 border-slate-200"
                  />
                </div>
                <div>
                  <Label htmlFor="projectName" className="text-sm text-slate-600">
                    Project Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="projectName"
                    value={formData.projectName}
                    onChange={(e) => handleInputChange("projectName", e.target.value)}
                    placeholder="Required"
                    required
                    className="mt-1 bg-slate-100 border-slate-200"
                  />
                </div>
              </div>
            </section>

            {/* Partner Information */}
            <section>
              <h2 className="mb-4 border-b border-slate-300 pb-2 text-lg font-semibold text-slate-800">
                Partner Information
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="company" className="text-sm text-slate-600">
                    Company <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="Required"
                    required
                    className="mt-1 bg-slate-100 border-slate-200"
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber" className="text-sm text-slate-600">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    inputMode="numeric"
                    value={formData.phoneNumber}
                    onChange={(e) => handlePhoneInput("phoneNumber", e.target.value)}
                    onKeyDown={blockNonNumericKeys}
                    placeholder="Required"
                    required
                    className="mt-1 bg-slate-100 border-slate-200"
                  />
                </div>
                <div>
                  <Label htmlFor="jciSalesEmail" className="text-sm text-slate-600">
                    JCI Sales contact email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="jciSalesEmail"
                    type="email"
                    value={formData.jciSalesEmail}
                    onChange={(e) => handleInputChange("jciSalesEmail", e.target.value)}
                    placeholder="Required"
                    required
                    className="mt-1 bg-slate-100 border-slate-200"
                  />
                </div>
                <div>
                  <Label htmlFor="country" className="text-sm text-slate-600">
                    Country <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    placeholder="Required"
                    required
                    className="mt-1 bg-slate-100 border-slate-200"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Estimated Order Date */}
          <section>
            <h2 className="mb-4 border-b border-slate-300 pb-2 text-lg font-semibold text-slate-800">
              Estimated Order Date <span className="text-red-500">*</span>
            </h2>
            <RadioGroup
              value={formData.estimatedOrderDate}
              onValueChange={(value) => handleInputChange("estimatedOrderDate", value)}
              className="flex flex-wrap gap-4"
              required
            >
              {["1-3 Months", "3-6 Months", "6-12 Months", "More than one year"].map((option) => (
                <div
                  key={option}
                  className="flex items-center gap-2 rounded-md bg-slate-100 px-4 py-3 min-w-[140px]"
                >
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="cursor-pointer text-sm text-slate-700">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </section>

          {/* Customer Information */}
          <section>
            <h2 className="mb-4 border-b border-slate-300 pb-2 text-lg font-semibold text-slate-800">
              Customer Information
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="pb-3 text-left text-sm font-normal text-slate-500"></th>
                    <th className="pb-3 text-center text-sm font-semibold text-slate-700">End User</th>
                    <th className="pb-3 text-center text-sm font-semibold text-slate-700">Contractor/Distributor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-3 text-sm text-slate-600">Company Name</td>
                    <td className="py-3 px-2">
                      <Input
                        value={formData.endUserCompanyName}
                        onChange={(e) => handleInputChange("endUserCompanyName", e.target.value)}
                        placeholder="Required"
                        className="bg-slate-100 border-slate-200"
                        required
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        value={formData.contractorCompanyName}
                        onChange={(e) => handleInputChange("contractorCompanyName", e.target.value)}
                        className="bg-blue-50 border-blue-100"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 text-sm text-slate-600">Contact Person</td>
                    <td className="py-3 px-2">
                      <Input
                        value={formData.endUserContactPerson}
                        onChange={(e) => handleInputChange("endUserContactPerson", e.target.value)}
                        placeholder="Required"
                        className="bg-slate-100 border-slate-200"
                        required
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        value={formData.contractorContactPerson}
                        onChange={(e) => handleInputChange("contractorContactPerson", e.target.value)}
                        className="bg-blue-50 border-blue-100"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 text-sm text-slate-600">Phone Number</td>
                    <td className="py-3 px-2">
                      <Input
                        type="tel"
                        inputMode="numeric"
                        value={formData.endUserPhoneNumber}
                        onChange={(e) => handlePhoneInput("endUserPhoneNumber", e.target.value)}
                        onKeyDown={blockNonNumericKeys}
                        placeholder="Required"
                        className="bg-slate-100 border-slate-200"
                        required
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        type="tel"
                        inputMode="numeric"
                        value={formData.contractorPhoneNumber}
                        onChange={(e) => handlePhoneInput("contractorPhoneNumber", e.target.value)}
                        onKeyDown={blockNonNumericKeys}
                        className="bg-blue-50 border-blue-100"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 text-sm text-slate-600">E-mail</td>
                    <td className="py-3 px-2">
                      <Input
                        type="email"
                        value={formData.endUserEmail}
                        onChange={(e) => handleInputChange("endUserEmail", e.target.value)}
                        placeholder="Required"
                        className="bg-slate-100 border-slate-200"
                        required
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        type="email"
                        value={formData.contractorEmail}
                        onChange={(e) => handleInputChange("contractorEmail", e.target.value)}
                        className="bg-blue-50 border-blue-100"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 text-sm text-slate-600">City</td>
                    <td className="py-3 px-2">
                      <Input
                        value={formData.endUserCity}
                        onChange={(e) => handleInputChange("endUserCity", e.target.value)}
                        placeholder="Required"
                        className="bg-slate-100 border-slate-200"
                        required
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        value={formData.contractorCity}
                        onChange={(e) => handleInputChange("contractorCity", e.target.value)}
                        className="bg-blue-50 border-blue-100"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Project Specification */}
          <section>
            <h2 className="mb-4 border-b border-slate-300 pb-2 text-lg font-semibold text-slate-800">
              Do You Have Project Specification <span className="text-red-500">*</span>
            </h2>
            <RadioGroup
              value={formData.hasProjectSpecification}
              onValueChange={(value) => handleInputChange("hasProjectSpecification", value)}
              className="flex gap-4"
              required
            >
              <div className="flex items-center gap-2 rounded-md bg-slate-100 px-6 py-3 flex-1 max-w-[200px]">
                <RadioGroupItem value="yes" id="spec-yes" />
                <Label htmlFor="spec-yes" className="cursor-pointer text-sm text-slate-700">
                  Yes
                </Label>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-blue-50 px-6 py-3 flex-1 max-w-[200px]">
                <RadioGroupItem value="no" id="spec-no" />
                <Label htmlFor="spec-no" className="cursor-pointer text-sm text-slate-700">
                  No
                </Label>
              </div>
            </RadioGroup>
          </section>

          {/* Brands */}
          <section>
            <h2 className="mb-4 border-b border-slate-300 pb-2 text-lg font-semibold text-slate-800">
              Brands <span className="text-red-500">*</span>
            </h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {brands.map((brand) => (
                <div
                  key={brand}
                  className="flex items-center gap-2 rounded-md bg-slate-100 px-4 py-3"
                >
                  <Checkbox
                    id={brand}
                    checked={formData.brands.includes(brand)}
                    onCheckedChange={() => handleBrandToggle(brand)}
                  />
                  <Label htmlFor={brand} className="cursor-pointer text-sm text-slate-700">
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </section>

          {/* Project Details */}
          <section>
            <h2 className="mb-4 border-b border-slate-300 pb-2 text-lg font-semibold text-slate-800">
              Project Details
            </h2>
            <div>
              <Label htmlFor="projectDescription" className="text-sm font-semibold text-slate-700">
                Project Description
              </Label>
              <Textarea
                id="projectDescription"
                value={formData.projectDescription}
                onChange={(e) => handleInputChange("projectDescription", e.target.value)}
                placeholder="Enter project description..."
                className="mt-2 min-h-[150px] bg-slate-100 border-slate-200"
              />
            </div>
          </section>

          {/* Model Numbers and Quantities from Cart */}
          <section>
            <h2 className="mb-4 border-b border-slate-300 pb-2 text-lg font-semibold text-slate-800">
              Model Numbers and Quantities
            </h2>
            {cartItems.length === 0 ? (
              <p className="text-sm text-slate-500">No items in cart. Please add items to your cart first.</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Quantity</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Model Number</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {cartItems.map((item) => (
                      <tr key={item.partNumber}>
                        <td className="px-4 py-3 text-sm text-slate-600">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm font-mono font-medium text-brand">{item.partNumber}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{item.description || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              className="bg-brand hover:bg-brand/90 text-white px-12 py-3 text-lg"
              disabled={cartItems.length === 0}
            >
              Submit Registration
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
