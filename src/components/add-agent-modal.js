import { useEffect, useRef, useState } from "react";
import styles from '../styles/add-agent-modal.scss';
import { FileUploader } from "react-drag-drop-files";
import { checkIfFileLargerThanMegabyte, isAnyInputEmpty, validateFileExtension, isValidPhoneNumber, saveFileToLocalStorage, base64ToFile } from '../util/helper';
import axios from "axios";


const AddAgentModal = ({ isOpen, handleModalClose }) => {
  const [state, setState] = useState(() => {
    const cachedState = localStorage.getItem('cachedAddAgentState');
    return cachedState ? JSON.parse(cachedState) : {
      name: null,
      surname: null,
      email: null,
      phone: null,
      image: null,
    };
  });

  const [errorState, setErrorState] = useState(() => {
    const cachedErrorState = localStorage.getItem('cachedAgentErrorState');
    return cachedErrorState ? JSON.parse(cachedErrorState) : {
      nameStyle: 'error-holder',
      nameInputStyle: 'form-input',
      nameText: 'მინიმუმ ორი სიმბოლო',
      surnameStyle: 'error-holder',
      surnameInputStyle: 'form-input',
      surnameText: 'მხოლოდ რიცხვები',
      emailStyle: 'error-holder',
      emailInputStyle: 'form-input',
      emailText: 'მხოლოდ რიცხვები',
      phoneStyle: 'error-holder',
      phoneInputStyle: 'form-input',
      phoneText: 'მხოლოდ რიცხვები',
      imageStyle: 'error-holder',
      imageInputStyle: 'form-input',
      imageText: 'მაქსიმუმ 1mb',
    };
  });

  const [imagePreview, setImagePreview] = useState(() => {
    const cachedImagePreview = localStorage.getItem('cachedAgentImagePreview');
    return cachedImagePreview ? cachedImagePreview : null;
  });

  const addAgentModalRef = useRef(null);
  const nameErrorRef = useRef(null);
  const surnameErrorRef = useRef(null);
  const emailErrorRef = useRef(null);
  const phoneErrorRef = useRef(null);
  const imageErrorRef = useRef(null);
  const imagePreviewRef = useRef(null);
  const imagePreviewHolderRef = useRef(null);
  const deleteImageRef = useRef(null);

  const handleClickOutsideAddAgentModal = (event) => {
    if (addAgentModalRef.current && !addAgentModalRef.current.contains(event.target)) {
      handleModalClose();
    }
  }

  const handleNameChange = (event) => {
    const eventValue = event.target.value;
    if (eventValue.length >= 2) {
      setErrorState(prevState => ({
        ...prevState,
        nameStyle: "error-holder correct",
        nameInputStyle: 'form-input',
        nameText: "მინიმუმ 2 სიმბოლო"
      }));
    }
    else {
      setErrorState(prevState => ({
        ...prevState,
        nameStyle: "error-holder validation-error",
        nameInputStyle: 'form-input error-input',
        nameText: "ჩაწერეთ ვალიდური მონაცემები"
      }));
    }
    setState(prevState => ({
      ...prevState,
      name: eventValue,
    }));
  }

  const handleSurnameChange = (event) => {
    const eventValue = event.target.value;
    if (eventValue.length >= 2) {
      setErrorState(prevState => ({
        ...prevState,
        surnameStyle: "error-holder correct",
        surnameInputStyle: 'form-input',
        surnameText: "მინიმუმ 2 სიმბოლო"
      }));
    }
    else {
      setErrorState(prevState => ({
        ...prevState,
        surnameStyle: "error-holder validation-error",
        surnameInputStyle: 'form-input error-input',
        surnameText: "ჩაწერეთ ვალიდური მონაცემები"
      }));
    }
    setState(prevState => ({
      ...prevState,
      surname: eventValue,
    }));
  }

  const handleEmailChange = (event) => {
    const eventValue = event.target.value;
    if (eventValue.endsWith('@redberry.ge')) {
      setErrorState(prevState => ({
        ...prevState,
        emailStyle: "error-holder correct",
        emailInputStyle: 'form-input',
        emailText: "მინიმუმ 2 სიმბოლო"
      }));
    }
    else {
      setErrorState(prevState => ({
        ...prevState,
        emailStyle: "error-holder validation-error",
        emailInputStyle: 'form-input error-input',
        emailText: "გამოიყენეთ @redberry.ge ფოსტა"
      }));
    }
    setState(prevState => ({
      ...prevState,
      email: eventValue,
    }));
  }

  const handlePhoneChange = (event) => {
    const eventValue = event.target.value;
    if (isValidPhoneNumber(eventValue)) {
      setErrorState(prevState => ({
        ...prevState,
        phoneStyle: "error-holder correct",
        phoneInputStyle: 'form-input',
        phoneText: "მხოლოდ რიცხვები"
      }));
    }
    else {
      setErrorState(prevState => ({
        ...prevState,
        phoneStyle: "error-holder validation-error",
        phoneInputStyle: 'form-input error-input',
        phoneText: "ჩაწერეთ ვალიდური მონაცემები"
      }));
    }
    setState(prevState => ({
      ...prevState,
      phone: eventValue,
    }));
  }

  const handleImageChange = (file) => {
    const isLargerThanOneMb = checkIfFileLargerThanMegabyte(file);
    const isValidFile = validateFileExtension(file);
    if (!isLargerThanOneMb && isValidFile) {
      saveFileToLocalStorage(file, "cachedBase64AgentImage", "cachedAddAgentImageName", file.name);
      setState(prevState => ({
        ...prevState,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
      setErrorState(prevState => ({
        ...prevState,
        imageStyle: "error-holder correct",
        imageInputStyle: 'form-input',
        imageText: "მაქსიმუმ 1mb"
      }));
      imagePreviewRef.current.style.display = "block";
      deleteImageRef.current.style.display = "block";
      imagePreviewHolderRef.current.style.zIndex = "3";
    }
    else {
      setState(prevState => ({
        ...prevState,
        image: null,
      }));
      setImagePreview(null);
      if (isLargerThanOneMb && isValidFile) {
        setErrorState(prevState => ({
          ...prevState,
          imageStyle: "error-holder validation-error",
          imageInputStyle: 'form-input error-input',
          imageText: "ზომა აღემატება 1mb-ს"
        }));
        imagePreviewRef.current.style.display = "none";
      }
      if (!isLargerThanOneMb && !isValidFile) {
        setErrorState(prevState => ({
          ...prevState,
          imageStyle: "error-holder validation-error",
          imageInputStyle: 'form-input error-input',
          imageText: "დაშვებულია მხოლოდ PNG, JPG და JPEG ფორმატები"
        }));
        imagePreviewRef.current.style.display = "none";
      }
      deleteImageRef.current.style.display = "none";
      imagePreviewHolderRef.current.style.zIndex = "0";
    }
  }

  const handleDeleteThumbnail = () => {
    setState(prevState => ({
      ...prevState,
      image: null,
    }));
    setImagePreview(null);
    localStorage.removeItem('cachedBase64AgentImage');
    localStorage.removeItem('cachedAddAgentImageName');
    imagePreviewRef.current.style.display = "none";
    deleteImageRef.current.style.display = "none";
    imagePreviewHolderRef.current.style.zIndex = "0";
  }

  const handleCancel = () => {
    localStorage.removeItem('cachedAddAgentState');
    setState({
      name: null,
      surname: null,
      email: null,
      phone: null,
      image: null,
    })

    localStorage.removeItem('cachedAgentImagePreview');
    setImagePreview(null);

    localStorage.removeItem('cachedAgentErrorState');
    setErrorState({
      nameStyle: 'error-holder',
      nameInputStyle: 'form-input',
      nameText: 'მინიმუმ ორი სიმბოლო',
      surnameStyle: 'error-holder',
      surnameInputStyle: 'form-input',
      surnameText: 'მხოლოდ რიცხვები',
      emailStyle: 'error-holder',
      emailInputStyle: 'form-input',
      emailText: 'მხოლოდ რიცხვები',
      phoneStyle: 'error-holder',
      phoneInputStyle: 'form-input',
      phoneText: 'მხოლოდ რიცხვები',
      imageStyle: 'error-holder',
      imageInputStyle: 'form-input',
      imageText: 'მაქსიმუმ 1mb',
    })
    handleModalClose();
  }

  const handleSubmit = () => {
    console.log(state)
    const form = document.querySelector('#agent-info-form');
    if (isAnyInputEmpty(form)) {
      alert("ჩაწერეთ ვალიდური მონაცემები");
      return;
    }
    if (state.image === null) {
      alert("ატვირთეთ სურათი");
      return;
    }
    if (Object.values(errorState).some(value => value.includes('validation-error'))) {
      alert("ჩაწერეთ ვალიდური მონაცემები");
      return;
    }

    else {
      const postData = async () => {
        try {
          const response = await axios.post('https://api.real-estate-manager.redberryinternship.ge/api/agents', {
            name: state.name,
            surname: state.surname,
            email: state.email,
            phone: state.phone,
            avatar: state.image,
          },
            {
              headers: {
                'Authorization': 'Bearer 9cfda59e-ab9c-4d44-a3b0-794325f8b2e6',
                'Content-Type': 'multipart/form-data'
              },
            }
          );
          console.log('Response:', response.data);
          if (response.status === 201) {
            handleCancel();
          }
        } catch (error) {
          console.error('Error posting data:', error);
        }
      };

      postData();
    }
    console.log(state);
  }

  useEffect(() => {
    const cachedBase64AgentImage = localStorage.getItem('cachedBase64AgentImage');
    const cachedAddAgentImageName = localStorage.getItem('cachedAddAgentImageName');
    if (cachedBase64AgentImage && cachedAddAgentImageName) {
      const recoveredFile = base64ToFile(cachedBase64AgentImage, cachedAddAgentImageName);
      setState(prevState => ({
        ...prevState,
        image: recoveredFile,
      }));
      setImagePreview(URL.createObjectURL(recoveredFile));
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideAddAgentModal);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideAddAgentModal);
    };
  }, []);

  // მონაცემების შენახვის ლოგიკა
  useEffect(() => {
    localStorage.setItem('cachedAddAgentState', JSON.stringify(state));
    localStorage.setItem('cachedAgentImagePreview', imagePreview);
    localStorage.setItem('cachedAgentErrorState', JSON.stringify(errorState));
  }, [state, imagePreview]);

  useEffect(() => {
    if (isOpen) {
      const previewImage = document.querySelector('.image-preview');

      previewImage.querySelector("img").onerror = function () {
        this.style.display = 'none';
        imagePreviewHolderRef.current.style.zIndex = "0";
        deleteImageRef.current.style.display = "none";
      };

      if (state.image === null) {
        imagePreviewHolderRef.current.style.zIndex = "0";
        deleteImageRef.current.style.display = "none";
      }
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="add-agent-modal-overlay">
      <div className="add-agent-modal-content" ref={addAgentModalRef}>
        <div className="form-holder">
          <h1>აგენტის დამატება</h1>
          <form id="agent-info-form">
            <div className="agent-info">
              <div className='name-input-holder'>
                <label for="name">სახელი*</label>
                <input type="text" id="name" name="name" className={errorState.nameInputStyle} onChange={handleNameChange} defaultValue={state.name} required />
                <div className={errorState.nameStyle} ref={nameErrorRef}>
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 1.40918L3.125 9.591L0 5.87199" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <p className='potential-error-message'>{errorState.nameText}</p>
                </div>
              </div>
              <div className='surname-input-holder'>
                <label for="surname">გვარი*</label>
                <input type="text" id="surname" name="surname" className={errorState.surnameInputStyle} onChange={handleSurnameChange} defaultValue={state.surname} required />
                <div className={errorState.surnameStyle} ref={surnameErrorRef}>
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 1.40918L3.125 9.591L0 5.87199" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <p className='potential-error-message'>{errorState.surnameText}</p>
                </div>
              </div>
              <div className='email-input-holder'>
                <label for="email">ელ-ფოსტა*</label>
                <input type="text" id="email" name="email" className={errorState.emailInputStyle} onChange={handleEmailChange} defaultValue={state.email} required />
                <div className={errorState.emailStyle} ref={emailErrorRef}>
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 1.40918L3.125 9.591L0 5.87199" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <p className='potential-error-message'>{errorState.emailText}</p>
                </div>
              </div>
              <div className='phone-input-holder'>
                <label for="phone">ტელეფონის ნომერი*</label>
                <input type="text" id="phone" name="phone" className={errorState.phoneInputStyle} onChange={handlePhoneChange} defaultValue={state.phone} required />
                <div className={errorState.phoneStyle} ref={phoneErrorRef}>
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 1.40918L3.125 9.591L0 5.87199" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <p className='potential-error-message'>{errorState.phoneText}</p>
                </div>
              </div>
            </div>
            <div className="listing-thumbnail">
              <div className='image-input-holder'>
                <label for="image">ატვირთეთ ფოტო*</label>
                <div className='file-upload-holder'>
                  <FileUploader handleChange={handleImageChange} name="image" required />
                  <div className='image-preview' ref={imagePreviewHolderRef}>
                    <img src={imagePreview} ref={imagePreviewRef} />
                    <svg ref={deleteImageRef} onClick={() => handleDeleteThumbnail()} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="11.5" fill="white" stroke="currentColor" />
                      <path d="M6.75 8.5H7.91667H17.25" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M16.0834 8.50033V16.667C16.0834 16.9764 15.9605 17.2732 15.7417 17.492C15.5229 17.7107 15.2262 17.8337 14.9167 17.8337H9.08341C8.774 17.8337 8.47725 17.7107 8.25846 17.492C8.03966 17.2732 7.91675 16.9764 7.91675 16.667V8.50033M9.66675 8.50033V7.33366C9.66675 7.02424 9.78966 6.72749 10.0085 6.5087C10.2272 6.28991 10.524 6.16699 10.8334 6.16699H13.1667C13.4762 6.16699 13.7729 6.28991 13.9917 6.5087C14.2105 6.72749 14.3334 7.02424 14.3334 7.33366V8.50033" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M10.8333 11.417V14.917" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M13.1667 11.417V14.917" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                  <img className="add-image" src="/images/plus.png" />
                </div>
                <div className={errorState.imageStyle} ref={imageErrorRef}>
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 1.40918L3.125 9.591L0 5.87199" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <p className='potential-error-message'>{errorState.imageText}</p>
                </div>
              </div>
            </div>
          </form>
          <div className='add-agent-buttons'>
            <button id="cancel-btn" onClick={() => { handleCancel() }}>გაუქმება</button>
            <button id="submit-btn" onClick={() => { handleSubmit() }}>დაამატე აგენტი</button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default AddAgentModal;