import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import formConfig from '../data/regProp.json';
import './Reg.css'
import processImage from '../picturetourl';

function Reg() {
  const navigate = useNavigate();
  // Create state for each form field based on the JSON configuration
  const initialState = formConfig.reduce((acc, field) => {
    acc[field.id] = field.initialValue;
    return acc;
  }, {});
  const [formState, setFormState] = useState(initialState);
  const [isFocused, setIsFocused] = useState({});
  // Generic handler for input focus
  const handleFocus = (id) => {
    if (!isFocused[id]) {
      setFormState({ ...formState, [id]: '' });
      setIsFocused({ ...isFocused, [id]: true });
    }
  };

  // Generic handler for input change
  const handleChange = (id, value) => {
    setFormState({ ...formState, [id]: value });
  };

  // Generic handler for input blur
  const handleBlur = (id, initialValue) => {
    if (formState[id] === '') {
      setFormState({ ...formState, [id]: initialValue });
      setIsFocused({ ...isFocused, [id]: false });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate fields before submitting
    if (!validateFields()) {
      alert('Please fill in all the required fields.');
      return;
    }

    const processedimage = await processImage(formState.profile)  
    const data = {
        username: formState.username,
        password: formState.password,
        nickname: formState.nickname,
        profile: processedimage
    };
    const res = await fetch('http://localhost:880/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        navigate('/')
    } else if(res.status == 409){
      alert('Username already taken');
    } else{
      alert("something went wrong")
    }
  }

  
  const validateFields = () => {
    let valid = true;
    let anyFieldEmpty = false;

    formConfig.forEach(field => {
      if (formState[field.id] === initialState[field.id]) {
        anyFieldEmpty = true;
        valid = false;
      }
    });
    if (anyFieldEmpty) {
      return valid
    }
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
                      onChange={(e) => handleChange(field.id, e.target.files[0])}
                      onFocus={() => handleFocus(field.id)}
                      onBlur={() => handleBlur(field.id, field.initialValue)}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      id='picturebutton'
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