import { useEffect, useState } from "react";
import "./RequestsTable.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RequestsTable() {
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [viewType, setViewType] = useState("pending");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const token = localStorage.getItem("token");
    const url =
      viewType === "pending"
        ? `${import.meta.env.VITE_API_URL}/RequestTable/PendingRequests`
        : `${import.meta.env.VITE_API_URL}/RequestTable/ModifiedRequests`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedRequests = response.data.map((req) => ({
        id: req.Req_ID,
        fileNumber: req.UserID,
        name: `${req.FirstName} ${req.LastName}`,
        requestDate: req.Request_Date,
        occupation: req.Role,
        residenceLocation: req.Residence,
        vehicleType: req.Vehicle_Type,
        vehicleImage: req.Vehicle_Image,
        insuranceDocument: req.Insurance_Image,
        insuranceExpiry: req.Insurance_Expiration_Date,
        drivingLicense: req.Driving_License,
        status: req.Status,
      }));

      setRequests(formattedRequests);
    } catch (error) {
      console.error(`Error fetching ${viewType} requests:`, error);
    }
  };

  const handleImageClick = (imageName) => {
    setSelectedImage(`${import.meta.env.VITE_API_URL}/uploads/${imageName}`);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/Login");
  }

  fetchRequests(); 
}, [navigate, viewType]);


  const handleApprove = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/RequestTable/AcceptRequest`,
        { Req_ID: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.msg);
      fetchRequests();
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  // Handle reject action
  const handleReject = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/RequestTable/DeclineRequest`,
        { Req_ID: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.msg);
      fetchRequests();

    
const email = await fetch(`${import.meta.env.VITE_API_URL}/register/send-email`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: response.data.email,
    subject: 'تم رفض طلبك',
    text: 'نحيطكم علمًا بأن طلبكم  قد تم رفضه. يمكنكم مراجعة تفاصيل الطلب من خلال حسابكم.'
  })
});


const result = await email.json();
console.log(result);
    } catch (error) {
      console.error("Error denying request:", error);
    }
  };

  const handleEditClick = (id) => {
    setEditingId(id);
  };

  const handleSaveComment = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/RequestTable/EditRequest`,
        { Req_ID: id, Comment: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.msg);
      fetchRequests();

const email = await fetch(`${import.meta.env.VITE_API_URL}/register/send-email`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: response.data.email,
    subject: 'تم طلب تعديل على طلبك',
    text: 'يرجى مراجعة حسابك للاطلاع على المعلومات المطلوبة لتعديل الطلب.'
  })
});


const result = await email.json();
console.log(result);
    } catch (error) {
      console.error("Error denying request:", error);
    }
    setEditingId(null);
    setCommentText("");
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-LB").format(date);
  };

  return (
    <div className="content-container">
      <h2 className="page-title">طلبات تصاريح الدخول</h2>

      <div
        className="toggle-buttons"
        style={{ marginBottom: "1rem", textAlign: "center" }}
      >
        <button
          className={`toggle-button ${viewType === "modified" ? "active" : ""}`}
          onClick={() => {
            setViewType("modified");
            fetchRequests();
          }}
        >
          الطّلبات المعدّلة
        </button>{" "}
        <button
          className={`toggle-button ${viewType === "pending" ? "active" : ""}`}
          onClick={() => {
            setViewType("pending");
            fetchRequests();
          }}
        >
          الطّلبات قيد المعالجة
        </button>
      </div>

      <div className="table-container">
        <div className="table-responsive">
          <table className="requests-table" dir="rtl">
            <thead>
              <tr>
                <th>رقم ملف صاحب الطّلب</th>
                <th>الإسم</th>
                <th>تاريخ الطّلب</th>
                <th>الوظيفة</th>
                <th>مكان السّكن</th>
                <th>نوع المركبة</th>
                <th>صورة المركبة</th>
                <th>وثيقة التأمين</th>
                <th>صلاحية التّأمين</th>
                <th>رخصة القيادة</th>
                <th className="actions-column">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="table-row">
                  <td>{request.fileNumber}</td>
                  <td>{request.name}</td>
                  <td>{formatDate(request.requestDate)}</td>
                  <td>{request.occupation}</td>
                  <td>{request.residenceLocation}</td>
                  <td>{request.vehicleType}</td>
                  <td>
                    <div className="image-container">
                      <img
                        src={`${import.meta.env.VITE_API_URL}/uploads/${request.vehicleImage}`}
                        alt="صورة المركبة"
                        className="thumbnail-image"
                        onClick={() => handleImageClick(request.vehicleImage)}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="image-container">
                      <img
                        src={`${import.meta.env.VITE_API_URL}/uploads/${request.insuranceDocument}`}
                        alt="وثيقة التأمين"
                        className="thumbnail-image"
                        onClick={() =>
                          handleImageClick(request.insuranceDocument)
                        }
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </td>
                  <td>{formatDate(request.insuranceExpiry)}</td>
                  <td>
                    <div className="image-container">
                      <img
                        src={`${import.meta.env.VITE_API_URL}/uploads/${request.drivingLicense}`}
                        alt="وثيقة التأمين"
                        className="thumbnail-image"
                        onClick={() => handleImageClick(request.drivingLicense)}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </td>

                  <td>
                    <div className="actions-container">
                      <div className="buttons-row">
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="approve-button"
                        >
                          قبول
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="reject-button"
                        >
                          رفض
                        </button>
                      </div>

                     
                        <>
                          <button
                            onClick={() => handleEditClick(request.id)}
                            className="edit-button"
                          >
                            تعديل
                          </button>
                          {editingId === request.id && (
                            <div className="comment-editor">
                              <textarea
                                className="comment-textarea"
                                placeholder="أدخل تعليقك هنا..."
                                rows="2"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                              ></textarea>
                              <div className="comment-actions">
                                <button
                                  onClick={() => handleSaveComment(request.id)}
                                  className="save-button"
                                >
                                  حفظ
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="cancel-button"
                                >
                                  إلغاء
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                     
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="عرض الصورة" className="modal-image" />
            <button className="modal-close-button" onClick={closeModal}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
