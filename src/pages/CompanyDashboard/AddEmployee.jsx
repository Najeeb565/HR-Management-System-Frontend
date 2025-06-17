// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const AddEmployee = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     role: 'Employee',
//     department: '',
//     salary: '',
//     status: 'Active',
//     joiningDate: new Date().toISOString().split('T')[0],
//     address: {
//       street: '',
//       city: '',
//       state: '',
//       zipCode: '',
//       country: ''
//     }
//   });
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);

//   const roles = ['Employee', 'Manager', 'Admin', 'HR'];
//   const statuses = ['Active', 'Inactive'];
//   const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations', 'Admin'];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
    
//     if (name.startsWith('address.')) {
//       const addressField = name.split('.')[1];
//       setFormData(prev => ({
//         ...prev,
//         address: {
//           ...prev.address,
//           [addressField]: value
//         }
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfilePicture(file);
      
//       // Create preview
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const submitData = new FormData();
      
//       // Append all form fields
//       Object.keys(formData).forEach(key => {
//         if (key === 'address') {
//           Object.keys(formData.address).forEach(addressKey => {
//             submitData.append(`address.${addressKey}`, formData.address[addressKey]);
//           });
//         } else {
//           submitData.append(key, formData[key]);
//         }
//       });

//       // Append profile picture if selected
     
//       //  submitData.append('companyId', "<your_company_id>");

//      await axios.post('http://localhost:5000/api/employees', submitData, {
      
//       });

//       navigate('/employees');
//     } catch (error) {
//       console.error('Error creating employee:', error);
//       alert('Error creating employee. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h1 className="h3 mb-0">Add New Employee</h1>
//         <button
//           type="button"
//           className="btn btn-outline-secondary"
//           onClick={() => navigate('/employees')}
//         >
//           <i className="bi bi-arrow-left me-2"></i>
//           Back to List
//         </button>
//       </div>

//       <div className="row">
//         <div className="col-lg-8">
//           <div className="card dashboard-card">
//             <div className="card-header bg-white">
//               <h5 className="card-title mb-0">
//                 <i className="bi bi-person-plus me-2"></i>
//                 Employee Information
//               </h5>
//             </div>
//             <div className="card-body">
//               <form onSubmit={handleSubmit}>
//                 <div className="row">
//                   {/* Basic Information */}
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">First Name *</label>
//                     <input
//                       type="text"
//                       className="form-control form-control-custom"
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Last Name *</label>
//                     <input
//                       type="text"
//                       className="form-control form-control-custom"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Email *</label>
//                     <input
//                       type="email"
//                       className="form-control form-control-custom"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Phone *</label>
//                     <input
//                       type="tel"
//                       className="form-control form-control-custom"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>

//                   {/* Job Information */}
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Role *</label>
//                     <select
//                       className="form-select form-control-custom"
//                       name="role"
//                       value={formData.role}
//                       onChange={handleInputChange}
//                       required
//                     >
//                       {roles.map(role => (
//                         <option key={role} value={role}>{role}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Department *</label>
//                     <select
//                       className="form-select form-control-custom"
//                       name="department"
//                       value={formData.department}
//                       onChange={handleInputChange}
//                       required
//                     >
//                       <option value="">Select Department</option>
//                       {departments.map(dept => (
//                         <option key={dept} value={dept}>{dept}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Salary *</label>
//                     <input
//                       type="number"
//                       className="form-control form-control-custom"
//                       name="salary"
//                       value={formData.salary}
//                       onChange={handleInputChange}
//                       min="0"
//                       step="100"
//                       required
//                     />
//                   </div>
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Status *</label>
//                     <select
//                       className="form-select form-control-custom"
//                       name="status"
//                       value={formData.status}
//                       onChange={handleInputChange}
//                       required
//                     >
//                       {statuses.map(status => (
//                         <option key={status} value={status}>{status}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Joining Date *</label>
//                     <input
//                       type="date"
//                       className="form-control form-control-custom"
//                       name="joiningDate"
//                       value={formData.joiningDate}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>

                  
//                 </div>

//                 <div className="d-flex gap-2 mt-4">
//                   <button
//                     type="submit"
//                     className="btn btn-primary btn-custom"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                         Creating...
//                       </>
//                     ) : (
//                       <>
//                         <i className="bi bi-check-circle me-2"></i>
//                         Create Employee
//                       </>
//                     )}
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-outline-secondary btn-custom"
//                     onClick={() => navigate('/employees')}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>

       
//       </div>
//     </div>
//   );
// };

// export default AddEmployee;






import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Employee',
    department: '',
    salary: '',
    status: 'Active',
    joiningDate: new Date().toISOString().split('T')[0],
  });

  const roles = ['Employee', 'Manager', 'Admin', 'HR'];
  const statuses = ['Active', 'Inactive'];
  const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations', 'Admin'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/employees', formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      navigate('/employees');
    } catch (error) {
      console.error('Error creating employee:', error);
      alert('Error creating employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Add New Employee</h1>
        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/employees')}>
          <i className="bi bi-arrow-left me-2"></i> Back to List
        </button>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card dashboard-card">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0"><i className="bi bi-person-plus me-2"></i>Employee Information</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">First Name *</label>
                    <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name *</label>
                    <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email *</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone *</label>
                    <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Role *</label>
                    <select className="form-select" name="role" value={formData.role} onChange={handleInputChange} required>
                      {roles.map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Department *</label>
                    <select className="form-select" name="department" value={formData.department} onChange={handleInputChange} required>
                      <option value="">Select Department</option>
                      {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Salary *</label>
                    <input type="number" className="form-control" name="salary" value={formData.salary} onChange={handleInputChange} min="0" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Status *</label>
                    <select className="form-select" name="status" value={formData.status} onChange={handleInputChange} required>
                      {statuses.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Joining Date *</label>
                    <input type="date" className="form-control" name="joiningDate" value={formData.joiningDate} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="d-flex gap-2 mt-4">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Employee'}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/employees')}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
