'use client'

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Phone, Mail, FileText, Printer, MessageCircle } from "lucide-react";

export default function CompanyInfoPage() {
  const [info, setInfo] = useState(null);
  const [editField, setEditField] = useState(null);
  const [tempData, setTempData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contactRes, addressRes, hoursRes] = await Promise.all([
          axios.get("https://localhost:3000/api/company/getContactInfo"),
          axios.get("https://localhost:3000/api/company/getAddress"),
          axios.get("https://localhost:3000/api/company/getBusinessHours"),
        ]);

        setInfo({
          address: addressRes.data.data[0].address,
          documentAddress: addressRes.data.data[0].documentAddress,
          whatsapp: addressRes.data.data[0].whatsapp,
          phoneNumbers: contactRes.data.data[0].phoneNumbers,
          faxNumbers: contactRes.data.data[0].faxNumbers,
          email: contactRes.data.data[0].email,
          businessHours: hoursRes.data.data,
        });
      } catch (error) {
        console.error("Error fetching company data", error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (field) => {
    setEditField(field);
    setTempData(info[field]);
  };

  const handleSave = async (field) => {
    try {
      let updatedData = { [field]: tempData };
      let endpoint = "";
      if (field === "businessHours") endpoint = "updateBusinessHours";
      else if (field === "phoneNumbers" || field === "email" || field === "faxNumbers") endpoint = "updateContactInfo";
      else if (field === "address" || field === "documentAddress" || field === "whatsapp") endpoint = "updateAddress";

      await axios.post(`https://localhost:3000/api/company/${endpoint}`, updatedData);
      setInfo({ ...info, [field]: tempData });
    } catch (error) {
      console.error("Error updating data", error);
    }

    setEditField(null);
  };

  const handleInputChange = (e) => {
    setTempData(e.target.value);
  };

  if (!info) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Company Information</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(info).map(([key, value]) => {
          if (key === "businessHours") return null;
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
      </div>
    </div>
  );
}
