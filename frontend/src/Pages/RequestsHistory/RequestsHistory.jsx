import React, { useEffect, useState } from "react";
import "./RequestsHistory.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RequestsHistory = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/Login");
    }
    fetchHistory();
  }, [navigate]);

  const fetchHistory = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://localhost:5001/RequestHistory/GetHistory",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const formattedRequests = response.data.map((req) => ({
        id: req.History_ID,
        SenderID: req.Sender_ID,
        VehicleID: req.Vehicle_ID,
        ManagerID: req.Manager_ID,
        Status: req.Status,
        DateofSendingRequest: req.RequestSentDate,
        DateOfRevision: req.TimeStamp,
      }));
      setRequests(formattedRequests);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  };

  const InfoModal = ({ data, onClose, title }) => {
    const renderVehicleInfo = () => (
      <>
        <p>
          <strong>نوع المركبة:</strong> {data.Vehicle_Type}
        </p>
        <p>
          <strong>رقم اللوحة:</strong> {data.Plate_Nb}
        </p>
        <p>
          <strong>لون المركبة:</strong> {data.Vehicle_Color}
        </p>
        <p>
          <strong>تاريخ انتهاء التأمين:</strong>{" "}
          {new Date(data.Insurance_Expiration_Date).toLocaleDateString("ar-EG")}
        </p>
      </>
    );

    const renderUserInfo = () => (
      <>
        <p>
          <strong>الإسم:</strong> {data.FirstName}
          {data.LastName}
        </p>
        <p>
          <strong>الوظيفة:</strong> {data.Role}
        </p>
        <p>
          <strong>البريد الإلكتروني:</strong> {data.Email}
        </p>

        <p>
          <strong> محل السكن:</strong> {data.Residence}
        </p>

        <p>
          <strong>إسم الكليّة:</strong> {data.FacultyName}
        </p>
      </>
    );

    const renderManagerInfo = () => (
      <>
        <p>
          <strong>الإسم:</strong> {data.FirstName}
          {data.LastName}
        </p>
        <p>
          <strong>الوظيفة:</strong> {data.Role}
        </p>
        <p>
          <strong>البريد الإلكتروني:</strong> {data.Email}
        </p>

        <p>
          <strong>إسم الكلّيّة:</strong> {data.FacultyName}
        </p>
      </>
    );

    const renderContent = () => {
      if ("Vehicle_Type" in data) return renderVehicleInfo();
      if ("UserID" in data) return renderUserInfo();
      if ("ManagerID") return renderManagerInfo();
      return <pre>{JSON.stringify(data, null, 2)}</pre>;
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>{title}</h2>
          <div className="modal-details">{renderContent()}</div>
          <button onClick={onClose}>إغلاق</button>
        </div>
      </div>
    );
  };

  const fetchUserInfo = async (UserID) => {
    try {
      const res = await axios.get("http://localhost:5001/RequestHistory/user", {
        params: { UserID: UserID },
      });
      setModalTitle("معلومات المستخدم");
      setModalData(res.data[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchManagerInfo = async (ManagerId) => {
    try {
      const res = await axios.get(
        "http://localhost:5001/RequestHistory/manager",
        {
          params: { ManagerId: ManagerId },
        }
      );
      setModalTitle("معلومات المدير");
      setModalData(res.data[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVehicleInfo = async (Vehicle_ID) => {
    try {
      console.log(Vehicle_ID, "vehiceid");
      const res = await axios.get(
        "http://localhost:5001/RequestHistory/vehicle",
        {
          params: { Vehicle_ID: Vehicle_ID },
        }
      );
      setModalTitle("معلومات المركبة");
      setModalData(res.data[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => {
    setModalData(null);
    setModalTitle("");
  };

  const [modalData, setModalData] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusClass = (status) => {
    switch (status) {
      case "approvedByManager":
        return "status-approved";
      case "approvedBySecurity":
        return "status-approved";
      case "declined":
        return "status-rejected";
      case "modification_requested":
        return "status-edit";
      default:
        return "";
    }
  };

  const getStatusName = (status) => {
    switch (status) {
      case "approvedByManager":
        return "مقبول من الإدارة";
      case "approvedBySecurity":
        return "مقبول من الأمن";
      case "declined":
        return "مرفوض";
      case "modification_requested":
        return "طلب تعديل";
      default:
        return "";
    }
  };

  const filteredData = requests.filter((item) => {
    const matchesSearch =
      item.DateOfRevision?.toString().includes(searchTerm) ||
      item.ManagerID?.toString().includes(searchTerm) ||
      item.VehicleID?.toString().includes(searchTerm) ||
      item.SenderID?.toString().includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || item.Status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container">
      <div className="header">
        <h1>سجل جميع الطلبات</h1>
      </div>

      <div className="table-container">
        <div className="search-filter">
          <input
            type="text"
            className="search-input"
            placeholder="بحث..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">جميع الحالات</option>
            <option value="approvedByManager">مقبول من الإدارة</option>
            <option value="approvedBySecurity">مقبول من الأمن</option>
            <option value="declined">مرفوض</option>
            <option value="modification_requested">طلب تعديل</option>
          </select>
        </div>

        <table className="requests-table">
          <thead>
            <tr>
              <th>رقم ملف صاحب الطلب</th>
              <th>رقم ملف مراقب الطلب</th>
              <th>رقم تعريف المركبة</th>
              <th>تاريخ ارسال الطلب</th>
              <th>تاريخ مراجعة الطلب</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>
                  <span
                    className="clickable"
                    onClick={() => fetchUserInfo(item.SenderID)}
                  >
                    {item.SenderID}
                  </span>
                </td>
                <td>
                  <span
                    className="clickable"
                    onClick={() => fetchManagerInfo(item.ManagerID)}
                  >
                    {item.ManagerID}
                  </span>
                </td>
                <td>
                  <span
                    className="clickable"
                    onClick={() => fetchVehicleInfo(item.VehicleID)}
                  >
                    {item.VehicleID}
                  </span>
                </td>

                <td>
                  {new Date(item.DateofSendingRequest).toLocaleDateString(
                    "en-GB"
                  )}
                </td>
                <td>
                  {new Date(item.DateOfRevision).toLocaleDateString("en-GB")}
                </td>

                <td>
                  <span
                    className={`status-badge ${getStatusClass(item.Status)}`}
                  >
                    {`${getStatusName(item.Status)}`}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button>السابق</button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>التالي</button>
        </div>
      </div>
      {modalData && (
        <InfoModal data={modalData} onClose={closeModal} title={modalTitle} />
      )}
    </div>
  );
};

export default RequestsHistory;
