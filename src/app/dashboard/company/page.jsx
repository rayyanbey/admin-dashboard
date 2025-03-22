"use client";

import { useState, useEffect } from "react";
import { formatTime12Hour, formatTime24Hour } from "@/lib/time";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
  Printer,
  MessageCircle,
  Plus,
  X,
  Check,
  ChevronDown,
  Loader2,
} from "lucide-react";

const Section = ({ title, icon, children }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 mb-4">
      <div className="p-2 rounded-full bg-primary/10">{icon}</div>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    <div className="grid gap-4 md:grid-cols-2">{children}</div>
  </div>
);

export default function CompanyInfoPage() {
  const [info, setInfo] = useState(null);
  const [editField, setEditField] = useState(null);
  const [tempData, setTempData] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSaving, setIsSaving] = useState(false);


     //https://dar-el-mecca.vercel.app/pages/apis/company/getCompanyInformation
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companyInfoRes, businessHoursRes] = await Promise.all([
          axios.get(`https://dar-el-mecca.vercel.app/pages/apis/company/getCompanyInformation`),
          axios.get(`https://dar-el-mecca.vercel.app/pages/apis/company/getBusinessHoursAdmin`),
        ]);

        const { address, contactInformation } = companyInfoRes.data.data;
        const businessHours = businessHoursRes.data.data;

        setInfo({
          address: address.address,
          documentAddress: address.documentAddress,
          phoneNumbers: contactInformation.phoneNumbers,
          faxNumbers: contactInformation.faxNumbers,
          email: contactInformation.email,
          whatsapp: contactInformation.whatsapp,
          businessHours,
        });
      } catch (error) {
        toast.error("Failed to load company data");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setEditField(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Array field handlers
  const handleArrayChange = (index, value) => {
    const newArray = [...tempData];
    newArray[index] = value;
    setTempData(newArray);
  };

  const addArrayItem = () => setTempData([...tempData, ""]);
  const removeArrayItem = (index) =>
    setTempData(tempData.filter((_, i) => i !== index));

  // Validation functions
  const validateEmails = (emails) =>
    emails.every((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
  const validatePhones = (phones) =>
    phones.every((p) => /^\+?[0-9\-\s()]+$/.test(p));

  const handleSave = async (field) => {
    try {
      setIsSaving(true);
      // Validation
      if (field === "email" && !validateEmails(tempData)) {
        setValidationError("Invalid email format");
        return;
      }
      if (
        (field === "phoneNumbers" ||
          field === "faxNumbers" ||
          field === "whatsapp") &&
        !validatePhones(tempData)
      ) {
        setValidationError("Invalid phone number format");
        return;
      }

      if (!window.confirm("Are you sure you want to save these changes?"))
        return;

      let payload;
      const endpoint = {
        businessHours: "updateBusinessHours",
        phoneNumbers: "updateContactInfo",
        email: "updateContactInfo",
        faxNumbers: "updateContactInfo",
        whatsapp: "updateContactInfo",
        address: "updateAddress",
        documentAddress: "updateAddress",
      }[field];

      if (endpoint === "updateContactInfo") {
        payload = {
          phoneNumbers: info.phoneNumbers,
          email: info.email,
          faxNumbers: info.faxNumbers,
          whatsapp: info.whatsapp,
          [field]: tempData,
        };
      } else if (endpoint === "updateAddress") {
        payload = {
          address: info.address,
          documentAddress: info.documentAddress,
          [field]: tempData,
        };
      } else if (endpoint === "updateBusinessHours") {
        payload = {
          days: {
            ...info.businessHours,
            ...tempData,
          },
        };
      }

      await axios.put(`https://dar-el-mecca.vercel.app/pages/apis/company/${endpoint}`, payload);
      setInfo((prev) => ({
        ...prev,
        ...(endpoint === "updateContactInfo" ? payload : {}),
        ...(endpoint === "updateAddress" ? payload : {}),
        ...(endpoint === "updateBusinessHours"
          ? { businessHours: payload.days }
          : {}),
      }));

      toast.success("Changes saved successfully");
    } catch (error) {
      toast.error("Failed to save changes");
      console.error("Update error:", error);
    } finally {
      setIsSaving(false);
      setEditField(null);
    }
  };

  // Business hours presets
  const applyHourPreset = (preset) => {
    const presetHours = {
      standard: {
        monday: {
          open: true,
          openingTime: "09:00 AM",
          closingTime: "05:00 PM",
        },
        tuesday: {
          open: true,
          openingTime: "09:00 AM",
          closingTime: "05:00 PM",
        },
        wednesday: {
          open: true,
          openingTime: "09:00 AM",
          closingTime: "05:00 PM",
        },
        thursday: {
          open: true,
          openingTime: "09:00 AM",
          closingTime: "05:00 PM",
        },
        friday: {
          open: true,
          openingTime: "09:00 AM",
          closingTime: "05:00 PM",
        },
        saturday: { open: false, openingTime: null, closingTime: null },
        sunday: { open: false, openingTime: null, closingTime: null },
      },
      "24/7": {
        monday: {
          open: true,
          openingTime: "12:00 AM",
          closingTime: "11:59 PM",
        },
        tuesday: {
          open: true,
          openingTime: "12:00 AM",
          closingTime: "11:59 PM",
        },
        wednesday: {
          open: true,
          openingTime: "12:00 AM",
          closingTime: "11:59 PM",
        },
        thursday: {
          open: true,
          openingTime: "12:00 AM",
          closingTime: "11:59 PM",
        },
        friday: {
          open: true,
          openingTime: "12:00 AM",
          closingTime: "11:59 PM",
        },
        saturday: {
          open: true,
          openingTime: "12:00 AM",
          closingTime: "11:59 PM",
        },
        sunday: {
          open: true,
          openingTime: "12:00 AM",
          closingTime: "11:59 PM",
        },
      },
      "weekends-closed": {
        ...info.businessHours,
        saturday: { open: false, openingTime: null, closingTime: null },
        sunday: { open: false, openingTime: null, closingTime: null },
      },
    };
    setTempData({ ...info.businessHours, ...presetHours[preset] });
  };

  if (!info)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold">Company Information</h1>

      <Section title="Contact Details" icon={<Phone size={20} />}>
        {["phoneNumbers", "email", "faxNumbers", "whatsapp"].map((field) => (
          <Card key={field}>
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                {
                  {
                    phoneNumbers: <Phone size={18} />,
                    email: <Mail size={18} />,
                    faxNumbers: <Printer size={18} />,
                    whatsapp: <MessageCircle size={18} />,
                  }[field]
                }
                {field.replace(/([A-Z])/g, " $1")}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditField(field);
                  setTempData(info[field]);
                }}
              >
                Edit
              </Button>
            </CardHeader>

            <CardContent>
              {editField === field ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="space-y-2">
                    {tempData.map((item, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          value={item}
                          onChange={(e) => handleArrayChange(i, e.target.value)}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeArrayItem(i)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addArrayItem}>
                      <Plus size={16} className="mr-2" /> Add New
                    </Button>
                    {validationError && (
                      <p className="text-red-500 text-sm">{validationError}</p>
                    )}
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => handleSave(field)}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Check size={16} className="mr-2" />
                        )}
                        {isSaving ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditField(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-1.5">
                  {info[field].map((item, i) => (
                    <div key={i} className="text-sm">
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </Section>

      <Section title="Address Information" icon={<MapPin size={20} />}>
        {["address", "documentAddress"].map((field) => (
          <Card key={field}>
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                {
                  {
                    address: <MapPin size={18} />,
                    documentAddress: <FileText size={18} />,
                  }[field]
                }
                {field.replace(/([A-Z])/g, " $1")}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditField(field);
                  setTempData(info[field]);
                }}
              >
                Edit
              </Button>
            </CardHeader>

            <CardContent>
              {editField === field ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Input
                    value={tempData}
                    onChange={(e) => setTempData(e.target.value)}
                  />
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => handleSave(field)}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Check size={16} className="mr-2" />
                      )}
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditField(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="text-sm">{info[field]}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </Section>

      <Section title="Business Hours" icon={<Clock size={20} />}>
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Clock size={18} />
              Operating Hours
            </CardTitle>
            <div className="flex gap-2">
              <Select onValueChange={applyHourPreset}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Presets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Hours</SelectItem>
                  <SelectItem value="24/7">24/7</SelectItem>
                  <SelectItem value="weekends-closed">
                    Weekends Closed
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditField("businessHours");
                  setTempData(info.businessHours);
                }}
              >
                Edit
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {editField === "businessHours" ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="overflow-x-auto">
                  {/* Edit Mode Table */}
                  <table className="min-w-[600px]">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Status</th>
                        <th>Opening Time</th>
                        <th>Closing Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                        "saturday",
                        "sunday",
                      ].map((day) => (
                        <tr key={day}>
                          <td className="py-3 capitalize">{day}</td>
                          <td>
                            <Label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={tempData[day]?.open || false}
                                onChange={(e) =>
                                  setTempData((prev) => ({
                                    ...prev,
                                    [day]: {
                                      ...prev[day],
                                      open: e.target.checked,
                                    },
                                  }))
                                }
                              />
                              {tempData[day]?.open ? "Open" : "Closed"}
                            </Label>
                          </td>
                          <td>
                            <Input
                              type="time"
                              value={
                                tempData[day]?.openingTime
                                  ? formatTime24Hour(tempData[day].openingTime)
                                  : ""
                              }
                              onChange={(e) =>
                                setTempData((prev) => ({
                                  ...prev,
                                  [day]: {
                                    ...prev[day],
                                    openingTime: formatTime12Hour(
                                      e.target.value
                                    ),
                                  },
                                }))
                              }
                              disabled={!tempData[day]?.open}
                            />
                          </td>
                          <td>
                            <Input
                              type="time"
                              value={
                                tempData[day]?.closingTime
                                  ? formatTime24Hour(tempData[day].closingTime)
                                  : ""
                              }
                              onChange={(e) =>
                                setTempData((prev) => ({
                                  ...prev,
                                  [day]: {
                                    ...prev[day],
                                    closingTime: formatTime12Hour(
                                      e.target.value
                                    ),
                                  },
                                }))
                              }
                              disabled={!tempData[day]?.open}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Display Mode Table */}
                  <table className="min-w-[600px]">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Status</th>
                        <th>Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                        "saturday",
                        "sunday",
                      ].map((day) => (
                        <tr key={day} className="border-t">
                          <td className="py-3 capitalize">{day}</td>
                          <td>
                            <span
                              className={`px-2 py-1 rounded-full text-sm ${
                                info.businessHours[day]?.open
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {info.businessHours[day]?.open
                                ? "Open"
                                : "Closed"}
                            </span>
                          </td>
                          <td>
                            {info.businessHours[day]?.open
                              ? `${info.businessHours[day].openingTime} - ${info.businessHours[day].closingTime}`
                              : "Closed"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSave("businessHours")}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check size={16} className="mr-2" />
                    )}
                    {isSaving ? "Saving..." : "Save All"}
                  </Button>
                  <Button variant="outline" onClick={() => setEditField(null)}>
                    Cancel
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-[600px]">
                  <thead>
                    <tr>
                      <th className="text-left pb-2">Day</th>
                      <th className="text-left pb-2">Status</th>
                      <th className="text-left pb-2">Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(info.businessHours).map(
                      ([day, details]) => {
                        if (
                          [
                            "id",
                            "createdAt",
                            "updatedAt",
                            "companyId",
                          ].includes(day)
                        )
                          return null;

                        return (
                          <tr key={day} className="border-t">
                            <td className="py-3 capitalize">{day}</td>
                            <td>
                              <span
                                className={`px-2 py-1 rounded-full text-sm ${
                                  details.open
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {details.open ? "Open" : "Closed"}
                              </span>
                            </td>
                            <td>
                              {details.open
                                ? `${details.openingTime} - ${details.closingTime}`
                                : "Closed"}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </Section>
    </div>
  );
}
