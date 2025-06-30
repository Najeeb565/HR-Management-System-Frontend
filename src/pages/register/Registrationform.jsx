
import "./CompanyRegistration.css";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from "../../axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import RequestSent from "../register/requestsentpage/requestsentpage";



function CompanyRegisterForm() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      ownerName: '',
      companyName: '',
      companyEmail: '',
      phone: '',
      industry: '',
      street: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
    validationSchema: Yup.object({
      ownerName: Yup.string().required('Required'),
      companyName: Yup.string().required('Required'),
      companyEmail: Yup.string().email('Invalid email').required('Required'),
      phone: Yup.string().required('Required'),
      industry: Yup.string().required('Required'),
      street: Yup.string().required('Required'),
      street2: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      state: Yup.string().required('Required'),
      zip: Yup.string().required('Required'),
      country: Yup.string().required('Required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post("http://localhost:5000/api/companies", values);
        console.log("Server Response:", response.data);
        const companyId = response.data.companyId;
        toast.success("🎉 Registration Request Sent");
        resetForm();
        navigate(`/RequestSent/${companyId}`);


      } catch (error) {

        console.error("Submission error:", error);
        toast.error("🚫 Error submitting the form.");
      }
    }
  });

  return (
    <div className="CompanyFormContainer">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="company">Company Register</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="CompanyForm">

          <div className="LeftSide form-flex">
            {/* Left column: All labels */}
            <div className="form-labels">
              <label>Owner Name:</label>
              <label>Company Name:</label>
              <label>Company Email:</label>
              <label>Phone:</label>
              <label>Industry:</label>
            </div>

            {/* Right column: All input fields + errors */}
            <div className="form-inputs">
              <div className="form-field">
                <input
                  type="text"
                  name="ownerName"
                  placeholder="Enter owner name"
                  className="form-input"
                  value={formik.values.ownerName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.ownerName && formik.errors.ownerName && (
                  <div className="error">{formik.errors.ownerName}</div>
                )}
              </div>

              <div className="form-field">
                <input
                  type="text"
                  name="companyName"
                  placeholder="Enter company name"
                  className="form-input"
                  value={formik.values.companyName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.companyName && formik.errors.companyName && (
                  <div className="error">{formik.errors.companyName}</div>
                )}
              </div>

              <div className="form-field">
                <input
                  type="email"
                  name="companyEmail"
                  placeholder="Enter company email"
                  className="form-input"
                  value={formik.values.companyEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.companyEmail && formik.errors.companyEmail && (
                  <div className="error">{formik.errors.companyEmail}</div>
                )}
              </div>

              <div className="form-field">
                <input
                  type="number"
                  name="phone"
                  placeholder="Enter your phone number"
                  className="form-input"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className="error">{formik.errors.phone}</div>
                )}
              </div>

              <div className="form-field">
                <select
                  name="industry"
                  className="industry-select"
                  value={formik.values.industry}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select Industry</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Construction">Construction</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Media & Entertainment">Media & Entertainment</option>
                  <option value="Telecommunications">Telecommunications</option>
                  <option value="Energy">Energy</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Other">Other</option>
                </select>
                {formik.touched.industry && formik.errors.industry && (
                  <div className="error">{formik.errors.industry}</div>
                )}
              </div>
            </div>
          </div>


          <div className="address-container">
            <input
              type="text"
              name="street"
              placeholder="Street Address"
              className="form-input"
              value={formik.values.street}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ marginBottom: '15px' }}
            />
            {formik.touched.street && formik.errors.street && (
              <div className="error">{formik.errors.street}</div>
            )}

            <input
              type="text"
              name="street2"
              placeholder="Street Address Line 2"
              className="form-input"
              value={formik.values.street2}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ marginBottom: '15px' }}
            />
            {formik.touched.street2 && formik.errors.street2 && (
              <div className="error">{formik.errors.street2}</div>
            )}

            <div className="form-row">
              <input
                type="text"
                name="city"
                placeholder="City"
                className="form-input"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.state && formik.errors.state && (
                <div className="error">{formik.errors.state}</div>
              )}
              <input
                type="text"
                name="state"
                placeholder="State / Province"
                className="form-input"
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.city && formik.errors.city && (
              <div className="error">{formik.errors.city}</div>
            )}


            <div className="form-row">
              <input
                type="number"
                name="zip"
                placeholder="Postal / Zip Code"
                className="form-input"
                value={formik.values.zip}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.country && formik.errors.country && (
                <div className="error">{formik.errors.country}</div>
              )}
              <select
                name="country"
                className="form-input"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Please Select</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="PK">Pakistan</option>
                <option value="IN">India</option>
              </select>
            </div>
            {formik.touched.zip && formik.errors.zip && (
              <div className="error">{formik.errors.zip}</div>
            )}
          </div>


        </div>
        <div className="d-flex justify-content-center">
          <button type="submit" className="submitbtn">Submit</button>

        </div>
      </form>
    </div>
  );
}

export default CompanyRegisterForm;
