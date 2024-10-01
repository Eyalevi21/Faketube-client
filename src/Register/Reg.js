import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import formConfig from '../data/regProp.json';
import './Reg.css';

function Reg() {
  const navigate = useNavigate();
  const initialState = formConfig.reduce((acc, field) => {
    acc[field.id] = field.initialValue;
    return acc;
  }, {});
  const [formState, setFormState] = useState(initialState);
  const [isFocused, setIsFocused] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);  // New state for file

  const [token, setToken] = useState(() => localStorage.getItem('jwt') || null);
  useEffect(() => {
    if (token) {
      // Token and userData exist, show custom notification and navigate to home
      alert('You are already signed in. Redirecting to home')  
      // Delay for 3 seconds before navigating
      navigate('/');
    }         
  }, [navigate]);
  // Generic handler for input focus
  const handleFocus = (id) => {
    if (!isFocused[id]) {
      setFormState({ ...formState, [id]: '' });
      setIsFocused({ ...isFocused, [id]: true });
    }
  };

  const handleChange = (id, value) => {
    setFormState({ ...formState, [id]: value });
  };

  const handleBlur = (id, initialValue) => {
    if (formState[id] === '') {
      setFormState({ ...formState, [id]: initialValue });
      setIsFocused({ ...isFocused, [id]: false });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (token) {
      // Token exists, alert and redirect to home page
      alert('You are already signed in!');
      navigate('/');
      return; // Stop further form submission processing
    }
    
    if (formState.password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return
    }
    if (formState.verifypass !== formState.password) {
      alert('Passwords do not match');
      return
    }

    // Validate fields before submitting
    if (!validateFields()) {
      alert('Please fill in all the required fields.');
      return;
    }


    const data = {
      username: formState.username,
      password: formState.password,
      nickname: formState.nickname,
    };
    try {
      const res = await fetch('http://localhost:880/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}), // Conditionally add Authorization header if JWT exists
        },
        body: JSON.stringify(data)
      });

      if (res.status === 409) {
        alert('Username already exists');
        return;
      } else if (!res.ok) {
        throw new Error('Error creating user, please try again later.');
      }

      // If a profile image is selected, upload it
      if (selectedFile) {
        const profileImageFormData = new FormData();
        profileImageFormData.append('profileImage', selectedFile);
        profileImageFormData.append('id', data.username);  // Send the user ID

        const profileRes = await fetch(`http://localhost:880/api/users/${data.username}/upload-profile`, {
          method: 'POST',
          body: profileImageFormData
        });

        if (!profileRes.ok) {
          throw new Error('Error uploading profile image');
        }

        alert('User registered successfully and profile image uploaded');
      } else {
        alert('User registered successfully');
      }
      navigate('/');  // Redirect after successful registration
    } catch (error) {
      alert(error.message);
    }
  };

  const validateFields = () => {
    let valid = true;
    let anyFieldEmpty = false;
  
    formConfig.forEach(field => {
      if (field.type !== 'file' && formState[field.id] === initialState[field.id]) {
        anyFieldEmpty = true;
      }
    });
  
    // Check if the file input field is required and not filled
    const fileField = formConfig.find(field => field.type === 'file');
    if (fileField && !selectedFile) {
      anyFieldEmpty = true;
    }
  
    valid = !anyFieldEmpty;
    return valid;
  };

  return (
    <div className="container d-flex justify-content-center align-items-center full-height-Reg">
      <div className="center-rectangle-Reg">
        <h2>Create a Faketube Account</h2>      
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* Map over form fields and render corresponding input elements */}
          {formConfig.map(field => (
            <div className={`col-md-${field.type === 'select' ? '3' : '4'}`} key={field.id}>
              <div className={field.prepend ? 'input-group' : ''}>
                {/* Render input element based on field type */}
                {field.type === 'file' ? (
                  <>
                    <input
                      type="file"
                      className="form-control"
                      id={field.id}
                      onChange={(e) => setSelectedFile(e.target.files[0])}  // Handle file
                      onFocus={() => handleFocus(field.id)}
                      onBlur={() => handleBlur(field.id, field.initialValue)}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      id="picturebutton"
                      className="btn btn-secondary"
                      onClick={() => document.getElementById(field.id).click()}
                    >
                      Upload Profile Picture
                    </button>
                  </>
                ) : (
                  <>
                    {field.prepend && <span className="input-group-text" id={`prepend-${field.id}`}>{field.prepend}</span>}
                    <input
                      type={field.type}
                      className="form-control"
                      id={field.id}
                      value={formState[field.id]}
                      onFocus={() => handleFocus(field.id)}
                      onBlur={() => handleBlur(field.id, field.initialValue)}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      aria-describedby={field.prepend ? `prepend-${field.id}` : undefined}
                    />
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Render the submit button */}
          <div className="col-12">
            <button className="btn btn-primary" id="registerbtn" type="submit">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Reg;