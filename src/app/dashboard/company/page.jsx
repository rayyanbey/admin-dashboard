'use client'

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Phone, Mail, FileText, Printer, MessageCircle } from "lucide-react";

const companyInfo = {
  address: "123 Main St, Anytown, USA 12345",
  documentAddress: "456 Document Rd, Anytown, USA 67890",
  whatsapp: "+1 (555) 987-6543",
  phoneNumbers: ["+1 (555) 123-4567", "+1 (555) 765-4321"],
  faxNumbers: ["+1 (555) 222-3333"],
  email: "contact@example.com",
  businessHours: {
    monday: { open: true, openingTime: "9:00 AM", closingTime: "5:00 PM" },
    tuesday: { open: true, openingTime: "9:00 AM", closingTime: "5:00 PM" },
    wednesday: { open: true, openingTime: "9:00 AM", closingTime: "5:00 PM" },
    thursday: { open: true, openingTime: "9:00 AM", closingTime: "5:00 PM" },
    friday: { open: true, openingTime: "9:00 AM", closingTime: "5:00 PM" },
    saturday: { open: false, openingTime: null, closingTime: null },
    sunday: { open: false, openingTime: null, closingTime: null },
  },
};

export default function CompanyInfoPage() {
  const [info, setInfo] = useState(companyInfo);
  const [editField, setEditField] = useState(null);
  const [tempData, setTempData] = useState("");

  const handleEdit = (field) => {
    setEditField(field);
    setTempData(info[field]);
  };

  const handleSave = (field) => {
    setInfo({ ...info, [field]: tempData });
    setEditField(null);
  };

  const handleInputChange = (e) => {
    setTempData(e.target.value);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Company Information</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(info).map(([key, value]) => {
          if (key === "businessHours") return null; // Skip rendering business hours here
          return (
            <Card key={key}>
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  {key === "address" && <MapPin className="mr-2 h-4 w-4" />}
                  {key === "documentAddress" && <FileText className="mr-2 h-4 w-4" />}
                  {key === "whatsapp" && <MessageCircle className="mr-2 h-4 w-4" />}
                  {key === "phoneNumbers" && <Phone className="mr-2 h-4 w-4" />}
                  {key === "faxNumbers" && <Printer className="mr-2 h-4 w-4" />}
                  {key === "email" && <Mail className="mr-2 h-4 w-4" />}
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                </CardTitle>
                <button
                  className="text-sm text-blue-500"
                  onClick={() => handleEdit(key)}
                >
                  Edit
                </button>
              </CardHeader>
              <CardContent>
                {editField === key ? (
                  <>
                    <input
                      type="text"
                      value={tempData}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                    <button
                      className="mt-2 text-sm text-green-500"
                      onClick={() => handleSave(key)}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  Array.isArray(value) ? (
                    value.map((item, index) => <div key={index}>{item}</div>)
                  ) : (
                    value
                  )
                )}
              </CardContent>
            </Card>
          );
        })}
        <Card className="md:col-span-2">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-4 w-4" /> Business Hours
            </CardTitle>
            <button
              className="text-sm text-blue-500"
              onClick={() => handleEdit("businessHours")}
            >
              Edit
            </button>
          </CardHeader>
          <CardContent>
            {editField === "businessHours" ? (
              <>
                {Object.entries(info.businessHours).map(([day, details]) => (
                  <div key={day} className="mb-4">
                    <h4 className="capitalize font-bold">{day}:</h4>
                    <label className="block">
                      <input
                        type="checkbox"
                        checked={details.open}
                        onChange={(e) => {
                          const updatedHours = {
                            ...info.businessHours,
                            [day]: { ...details, open: e.target.checked },
                          };
                          setInfo({ ...info, businessHours: updatedHours });
                        }}
                      />{" "}
                      Open
                    </label>
                    {details.open && (
                      <>
                        <input
                          type="text"
                          placeholder="Opening Time"
                          value={details.openingTime || ""}
                          onChange={(e) => {
                            const updatedHours = {
                              ...info.businessHours,
                              [day]: { ...details, openingTime: e.target.value },
                            };
                            setInfo({ ...info, businessHours: updatedHours });
                          }}
                          className="mt-2 p-2 border rounded"
                        />
                        <input
                          type="text"
                          placeholder="Closing Time"
                          value={details.closingTime || ""}
                          onChange={(e) => {
                            const updatedHours = {
                              ...info.businessHours,
                              [day]: { ...details, closingTime: e.target.value },
                            };
                            setInfo({ ...info, businessHours: updatedHours });
                          }}
                          className="mt-2 p-2 border rounded"
                        />
                      </>
                    )}
                  </div>
                ))}
                <button
                  className="mt-4 text-sm text-green-500"
                  onClick={() => setEditField(null)}
                >
                  Save Business Hours
                </button>
              </>
            ) : (
              <div className="space-y-2">
                {Object.entries(info.businessHours).map(([day, details]) => (
                  <div key={day} className="flex justify-between">
                    <span className="capitalize">{day}:</span>
                    {details.open ? (
                      <span>
                        {details.openingTime} - {details.closingTime}
                      </span>
                    ) : (
                      <span>Closed</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
