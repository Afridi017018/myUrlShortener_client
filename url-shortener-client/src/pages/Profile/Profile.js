import React, { useEffect } from 'react';
import { useState } from 'react';
import Modal from "react-modal"
import TextInput from '../../components/TextInput/TextInput';
import { BASE_URL } from '../../services/helper';

import "./Profile.css"

const Profile = () => {

  const myToken = localStorage.getItem('token');

  const [userInfo, setUserInfo] = useState({
    id: "",
    image: "",
    name: "",
    email: "",
  })

  const [updateUserInfo, setUpdateUserInfo] = useState({
    id: "",
    name: "",
    image: ""
  })
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false)
  const [changePasswordIsOpen, setChangePasswordIsOpen] = useState(false)
  const [changePassword, setChangePassword] = useState({
    id: "",
    oldPass: "",
    newPass: ""
  })

  const [ipAddress, setIpAddress] = useState("")

  

  useEffect(() => {

   
      fetch(`${BASE_URL}/user/check-login`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${myToken}`,
        },
     
      })
        .then(response => response.json())
        .then(data => {
          setUserInfo({ ...userInfo, id: data.id, image: data.image, name: data.name, email: data.email })
  
        });
  

  }, [myToken,userInfo]);



  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };


  const openUpdateModal = () => {
    setUpdateUserInfo({
      id: userInfo.id,
      name: userInfo.name,
      image: userInfo.image,

    })
    setUpdateModalIsOpen(true)
  }

  const closeUpdateModal = () => {
    setUpdateModalIsOpen(false)
  }


  const handleUpdateProfile = () => {
    if (!userInfo.name) {
      alert("Name field cannot be empty")
      return;
    }

    fetch(`${BASE_URL}/user/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'authorization': `Bearer ${myToken}`,
      },

      body: JSON.stringify({ ...updateUserInfo })
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        setUpdateModalIsOpen(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }



  const openChangePasswordModal = () => {
    setChangePasswordIsOpen(true)
  }

  const closeChangePasswordModal = () => {
    setChangePasswordIsOpen(false);
    setChangePassword({ ...changePassword, newPass: "", oldPass: "" });
  }


  const handleChangePassword = () => {
    if (!changePassword.oldPass || !changePassword.newPass) {
      alert("Field cannot be empty")
      return;
    }

    fetch(`${BASE_URL}/user/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'authorization': `Bearer ${myToken}`,
      },

      body: JSON.stringify({ ...changePassword, id: userInfo.id })
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        setChangePasswordIsOpen(false);
        setChangePassword({ ...changePassword, newPass: "", oldPass: "" });
      })
      .catch((error) => {
        console.error('Error:', error);
      });


  }

  useEffect(() => {

    const getPublicIpAddress = async () => {

      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setIpAddress(data.ip);

    }

    getPublicIpAddress();
  }, []);

  return (
    <div>

      <div className='profile'>
        <div className="avatar-image">
          {
            userInfo.image ? <img src={userInfo.image} alt="" /> : <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcZsL6PVn0SNiabAKz7js0QknS2ilJam19QQ&usqp=CAU" alt="" />

          }
        </div>


        <div className="info-div">
          <div className="info">
          <h1>Name <span className='notation-1'>:</span> {userInfo.name ? <>{userInfo.name}</> : <img src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif" alt="" /> }</h1>

            <h1>Email <span className='notation-2'>:</span> {userInfo.email ? <>{userInfo.email}</> : <img src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif" alt="" /> }</h1>
   
          <h1>IP <span className='notation-3'>:</span> {ipAddress ? <>{ipAddress}</> : <img src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif" alt="" /> }</h1>
    
          </div>
        </div>

        <div className="update-profile">
          <button onClick={openUpdateModal}>Update Profile</button>
        </div>
        <div className="update-password">
          <button onClick={openChangePasswordModal}>Change Password</button>
        </div>

      </div>




      <div className="update-profile">
        <Modal
          isOpen={updateModalIsOpen}
          onRequestClose={closeUpdateModal}
          style={customStyles}
          contentLabel="Example Modal">
          <TextInput label="Name" placeholder="Name" value={updateUserInfo.name} onChange={(val) => setUpdateUserInfo({ ...updateUserInfo, name: val })} />

          <TextInput label="Image" placeholder="https://www.avatar.com/" value={updateUserInfo.image} onChange={(val) => setUpdateUserInfo({ ...updateUserInfo, image: val })} />
          <div className="modal-update-button">
            <button onClick={handleUpdateProfile} className='modal-update-button-1'>Update</button>
            <button onClick={closeUpdateModal} className='modal-cancel-button-2'>Cancel</button>
          </div>
        </Modal>
      </div>


      <div className="change-password">
        <Modal
          isOpen={changePasswordIsOpen}
          onRequestClose={closeChangePasswordModal}
          style={customStyles}
          contentLabel="Example Modal">
          <TextInput label="Current Password" placeholder="*****" value={changePassword.oldPass} onChange={(val) => setChangePassword({ ...changePassword, oldPass: val })} type="password" />
          <TextInput label="New Password" placeholder="*****" value={changePassword.newPass} onChange={(val) => setChangePassword({ ...changePassword, newPass: val })} type="password" />

          <div className="modal-update-button">
            <button onClick={handleChangePassword} className='modal-update-button-1'>Change</button>
            <button onClick={closeChangePasswordModal} className='modal-cancel-button-2'>Cancel</button>
          </div>
        </Modal>
      </div>


    </div>
  );
};

export default Profile;


