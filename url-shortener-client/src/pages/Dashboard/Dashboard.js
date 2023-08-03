import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Modal from "react-modal"
import { FaClone } from 'react-icons/fa';
import copy from 'copy-to-clipboard';
import Button from '../../components/Button/Button';
import TextInput from '../../components/TextInput/TextInput';
import "./Dashboard.css"
import { BASE_URL } from '../../services/helper';




const Dashboard = ({ userId }) => {

    const myToken = localStorage.getItem('token');

    const [addView, setAddView] = useState(false)
    const [isValidUrl, setIsValidUrl] = useState(false)
    const [invalidText, setInvalidText] = useState(false)
    const [payload, setPayload] = useState({
        originalLink: "",
        name: "",
        userId: ""
    })

    const [shortUrl, setShortUrl] = useState("")

    const [urlsData, setUrlsData] = useState([])

    const [modalIsOpen, setIsOpen] = useState(false)

    const [eachUrl, setEachUrl] = useState({
        urlCode: "",
        name: "",
        originalLink: ""
    })

    const [copiedIndex, setCopiedIndex] = useState(-1);

    useEffect(() => {
        if (userId) {
            fetch(`${BASE_URL}/url/urlData/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'authorization': `Bearer ${myToken}`,
                },
            })
                .then(response => response.json())
                .then(data => {
                    setUrlsData(data);
                });
        }
    }, [userId, myToken, urlsData])


    const handleClick = () => {
        if (!payload.originalLink) {
            setInvalidText(false)
            return alert("Original link is needed!")
        }


        fetch(`${BASE_URL}/url/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'authorization': `Bearer ${myToken}`,
            },
            body: JSON.stringify({ ...payload, userId: userId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.isValidUrl) {
                    setIsValidUrl(true);
                    setInvalidText(false)
                    setShortUrl(`${BASE_URL}/url/${data.urlCode}`)
                }
                else {
                    setIsValidUrl(false);
                    setInvalidText(true)
                }


            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }


    const emptyUrl = () => {
        return (
            <div className="dashboard__empty-state">
                {urlsData.length < 1 && <p>You don't have any url</p>}
                <Button onClick={() => setAddView(true)} label="Create a new short url" variant="outlined-primary" />
            </div>
        )

    }

    const addNewUrl = () => {
        return (
            <div className="dashboard__empty-state">

                <TextInput label="Original Url" placeholder="https://www.google.com/" value={payload.originalLink} onChange={(val) => setPayload({ ...payload, originalLink: val })} />
                <TextInput label="Name" placeholder="Google" value={payload.name} onChange={(val) => setPayload({ ...payload, name: val })} />

                <div className="dashboard__add-new-actions">
                    <Button onClick={handleClick} label="Generate a short url" />
                    <Button onClick={() => setAddView(false)} label="Cancel" variant="outlined-primary" />
                </div>


            </div>
        )


    }

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: '60%',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };

    const openModal = (item) => {
        setIsOpen(true);
        setEachUrl({ urlCode: item.urlCode, name: item.name, originalLink: item.originalLink })
    }

    const closeModal = () => {
        setIsOpen(false);
    }



    const handleClipboard = (shortLink, index) => {
        copy(shortLink);
        setCopiedIndex(index);
        setTimeout(() => {
            setCopiedIndex(-1);
        }, 1500);
    };


    const handleUpdate = () => {
        fetch(`${BASE_URL}/url/update-url`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'authorization': `Bearer ${myToken}`,
            },

            body: JSON.stringify({ ...eachUrl })
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message)
                setIsOpen(false);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const handleUrlDelete = (urlCode) => {

        const confirmed = window.confirm(`Are you sure you want to delete "${BASE_URL}/url/${urlCode}" ?`)

        if (confirmed) {
            fetch(`${BASE_URL}/url/delete-url`, {
                method: "delete",
                headers: {
                    "Content-Type": "application/json",
                    'authorization': `Bearer ${myToken}`,
                },

                body: JSON.stringify({ urlCode })
            })
                .then(response => response.json())
                .then(data => {
                    alert(`Short Link ${data.message.urlCode} has been deleted!`)

                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }

    }







    return (
        <div className='dashboard'>

            {
                addView ? addNewUrl() : emptyUrl()
            }
            {
                addView &&
                <div>

                    {isValidUrl ?
                        <div className='shortUrl'>
                            <p>{shortUrl}</p> {shortUrl && <button className='clipboard-button'>
                                <FaClone onClick={() => handleClipboard(shortUrl, -2)} /></button>

                            }
                            {copiedIndex === -2 && (
                                <span className="copied-text">Copied</span>
                            )}
                        </div>
                        :
                        <div className='invalidUrl'>
                            {invalidText && <p>Given original url is invalid !</p>}
                        </div>
                    }

                </div>
            }


            <div className="test-model">
                {
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Example Modal">
                        <TextInput label="Name" placeholder="Name" value={eachUrl.name} onChange={(val) => setEachUrl({ ...eachUrl, name: val })} />
                        <TextInput label="Original Link" placeholder="https://www.abc.com/" value={eachUrl.originalLink} onChange={(val) => setEachUrl({ ...eachUrl, originalLink: val })} />
                        <div className="modal-update-button">
                            <button onClick={handleUpdate} className='modal-update-button-1'>Update</button>
                            <button onClick={closeModal} className='modal-cancel-button-2'>Cancel</button>
                        </div>
                    </Modal>
                }

            </div>

            {urlsData.length > 0 &&
                <div className="urls-table">
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Original Link</th>
                                    <th>Short Link</th>
                                    <th>Visit</th>
                                    <th>Added Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {urlsData.map((item, index) =>


                                    <tr key={item.id}>
                                        <td className='itemName'>{item.name} </td>
                                        <td><a href={item.originalLink}>{item.originalLink}</a> </td>
                                        <td><a href={`${BASE_URL}/url/${item.urlCode}`}>{BASE_URL}/url/{item.urlCode}</a> <button className='clipboard-button'><FaClone onClick={() => handleClipboard(`${BASE_URL}/url/${item.urlCode}`, index)} /></button>
                                            {copiedIndex === index && (
                                                <span className="copied-text">Copied</span>
                                            )}
                                        </td>
                                        <td>{item.visitCount} </td>
                                        <td>{item.createdAt} </td>
                                        <td><div className="action-buttons"><button className='action-button-1' onClick={() => openModal(item)}>Update</button> <button className='action-button-2' onClick={() => handleUrlDelete(item.urlCode)}>Delete</button> </div></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>}

        </div>
    );
};

export default Dashboard;


