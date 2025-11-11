import React, { useEffect, useState } from "react";
import "./VisitorRequestForm.css";
import { useNavigate } from "react-router-dom";

const VisitorRequestForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/Login");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    GuestName: "",
    GuestPhone: "",
    vehicleType: "",
    vehicleColor: "",
    Plate_Nb: "",
    Purpose: "",
    EntryDate: "",
    ExitDate: "",
    EntryTime: "",
    Insurance_Expiration_Date: ""
  });

  const [VehicleImage, setVehicleImage] = useState(null);
  const [InsuranceDoc, setInsuranceDoc] = useState(null);
  const [DrivingLiscence, setDrivingLiscence] = useState(null);

  const [VehicleImageName, setVehicleImageName] = useState("");
  const [InsuranceDocName, setInsuranceDocName] = useState("");
  const [DrivingLiscenceName, setDrivingLiscenceName] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, setFile, setFileName) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    } else {
      setFile(null);
      setFileName("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const data = new FormData();

    for (const key in formData) {
      data.append(key, formData[key]);
    }

    if (VehicleImage) data.append("VehicleImage", VehicleImage);
    if (InsuranceDoc) data.append("InsuranceDoc", InsuranceDoc);
    if (DrivingLiscence) data.append("DrivingLiscence", DrivingLiscence);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/VistorRequest/SendVisitorRequest`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        alert("تم تقديم الطلب بنجاح!");
        console.log(result);
      } else {
        alert("حدث خطأ أثناء تقديم الطلب.");
        console.error(result);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("فشل في إرسال الطلب. الرجاء المحاولة لاحقًا.");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>تقديم طلب لزوّار الجامعة</h1>
      </div>

      <div className="form-container">
        <form id="visitorForm" onSubmit={handleSubmit} encType="multipart/form-data">
      
          <div className="form-section">
            <h3 className="section-title">معلومات الزائر</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="GuestName">اسم الزائر</label>
                <input
                  type="text"
                  id="GuestName"
                  name="GuestName"
                  value={formData.GuestName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="GuestPhone">رقم الهاتف</label>
                <input
                  type="tel"
                  id="GuestPhone"
                  name="GuestPhone"
                  value={formData.GuestPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

         
          <div className="form-section">
            <h3 className="section-title">معلومات المركبة</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="vehicleType">نوع المركبة</label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="">اختر نوع المركبة</option>
                  <option value="car">سيارة</option>
                  <option value="motorcycle">دراجة نارية</option>
                  
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="vehicleColor">لون المركبة</label>
                <input
                  type="text"
                  id="vehicleColor"
                  name="vehicleColor"
                  value={formData.vehicleColor}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="Plate_Nb">رقم اللوحة</label>
                <input
                  type="text"
                  id="Plate_Nb"
                  name="Plate_Nb"
                  value={formData.Plate_Nb}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="file-input-label" htmlFor="VehicleImage">
                  صورة المركبة
                  <input
                    type="file"
                    id="VehicleImage"
                    name="VehicleImage"
                    className="file-input"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setVehicleImage, setVehicleImageName)}
                  />
                </label>
                {VehicleImageName && <div className="selected-file">{VehicleImageName}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="file-input-label" htmlFor="InsuranceDoc">
                  صورة وثيقة التأمين
                  <input
                    type="file"
                    id="InsuranceDoc"
                    name="InsuranceDoc"
                    className="file-input"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setInsuranceDoc, setInsuranceDocName)}
                  />
                </label>
                {InsuranceDocName && <div className="selected-file">{InsuranceDocName}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="Insurance_Expiration_Date">صلاحية التّأمين</label>
                <input
                  type="date"
                  id="Insurance_Expiration_Date"
                  name="Insurance_Expiration_Date"
                  value={formData.Insurance_Expiration_Date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="file-input-label" htmlFor="DrivingLiscence">
                  صورة رخصة القيادة
                  <input
                    type="file"
                    id="DrivingLiscence"
                    name="DrivingLiscence"
                    className="file-input"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileChange(e, setDrivingLiscence, setDrivingLiscenceName)}
                  />
                </label>
                {DrivingLiscence && <div className="selected-file">{DrivingLiscenceName}</div>}
              </div>
            </div>
          </div>

        
          <div className="form-section">
            <h3 className="section-title">معلومات الزيارة</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="Purpose">سبب الدخول</label>
                <textarea
                  id="Purpose"
                  name="Purpose"
                  value={formData.Purpose}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="EntryDate">تاريخ بدء الزيارة</label>
                <input
                  type="date"
                  id="EntryDate"
                  name="EntryDate"
                  value={formData.EntryDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="ExitDate">تاريخ انتهاء الزيارة</label>
                <input
                  type="date"
                  id="ExitDate"
                  name="ExitDate"
                  value={formData.ExitDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="EntryTime">وقت الدخول</label>
                <input
                  type="time"
                  id="EntryTime"
                  name="EntryTime"
                  value={formData.EntryTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            تقديم الطلب
          </button>
        </form>
      </div>
    </div>
  );
};

export default VisitorRequestForm;
