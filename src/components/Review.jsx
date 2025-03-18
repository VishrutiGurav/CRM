import React, { useState, useEffect } from 'react';
import Layout from "./Layout";
import account from "../assets/account.png";
import search from "../assets/search.png";
import axios from 'axios';
import "./Review.css";

const Application2 = ({ isOpen }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [tableData, setTableData] = useState([]); 
    const [sortOrder, setSortOrder] = useState('newest'); 
    const [selectedMou, setSelectedMou] = useState(null); 
    const [acceptModal, setAcceptModal] = useState(false); 
    const [rejectModal, setRejectModal] = useState(false); 
    const [rejectReason, setRejectReason] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); 
    const [acceptMessage, setAcceptMessage] = useState("");
   

    const openModal = (mou) => {
        setSelectedMou(mou);  // Set the selected MoU to open the modal
        setShowModal(true);   // Show the modal (using a state to control visibility)
    };
    
    const closeModal = () => {
        setSelectedMou(null);  // Reset the selected MoU
        setShowModal(false);   // Hide the modal
    };
    const openAcceptModal = () => {
        setAcceptModal(true);
        setRejectModal(false); // Close reject modal if open
    };

    const openRejectModal = () => {
        setRejectModal(true);
        setAcceptModal(false); // Close accept modal if open
    };
    // Fetch MoU data from the database
    useEffect(() => {
        const fetchMoUData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/client/getDetails");
                const fetchedData = response.data;

                // Map the fetched data to structure it into table rows
                const mappedData = fetchedData.map((item, index) => ({
                    date: new Date().toLocaleDateString(),
                    mouName: `MoU-${index + 1}`, // Example for MoU name
                    institute: item.instituteDetails.instituteName,
                    status: 'Pending',
                }));

                setTableData(mappedData); // Store fetched data into state
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchMoUData();
    }, []);

    // Handle actions like Accept, Reject, Request More Info
    const handleAction = (action, mou) => {
        // Close any open modal when any other button is clicked
        closeModal(); // Automatically close any open modal

        if (action === 'Accept') {
            setAcceptModal(true); // Show Accept confirmation modal
            setSelectedMou(mou);
        } else if (action === 'Reject') {
            setRejectModal(true); // Show Reject modal to enter reason
            setSelectedMou(mou);
            // Auto-focus on the rejection reason input field
            setTimeout(() => {
                document.getElementById('reject-reason').focus();
            }, 100);
        }
    };

    // Handle Accept confirmation
    const confirmAccept = () => {
        console.log(`Sending detailed MoU to: ${selectedMou.institute}`);
        setAcceptModal(false); // Close the modal after confirming
        closeModal(); // Close the view modal if open
    };

    // Handle Reject confirmation with reason
    const confirmReject = () => {
        if (rejectReason.trim() === '') {
            // Display error message if rejection reason is empty
            setErrorMessage("Rejection reason cannot be empty.");
            return;
        }
        console.log(`Rejection reason for ${selectedMou.mouName}: ${rejectReason}`);
        setRejectModal(false); // Close the modal after rejecting
        setRejectReason(''); // Clear reason after rejection
        setErrorMessage(''); // Clear error message
        closeModal(); // Close the view modal if open
    };

    // Sort MoU data based on the sort order
    const sortedData = tableData.sort((a, b) => {
        if (sortOrder === 'newest') {
            return new Date(b.date) - new Date(a.date);
        } else if (sortOrder === 'oldest') {
            return new Date(a.date) - new Date(b.date);
        } else if (sortOrder === 'asc') {
            return a.institute.localeCompare(b.institute);
        } else if (sortOrder === 'desc') {
            return b.institute.localeCompare(a.institute);
        } else {
            return 0;
        }
    });
    
    // Filter MoU data based on search term
    const filteredData = sortedData.filter((item) => {
        return item.institute.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.mouName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <Layout isOpen={isOpen}>
            <div className={`content ${isOpen ? 'content-shifted' : 'content-full'}`}>
                <div className="scrollable-container">
                    <header>
                        <div className="head">
                            <h1>MoU Review Requests</h1>
                        </div> 

                        <div className="search-bar-container">
                            <input
                                className="search-bar-extended"
                                placeholder="Search by institute or MoU..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <select
                                className="sort-dropdown"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="newest">Newest to Oldest</option>
                                <option value="oldest">Oldest to Newest</option>
                                <option value="asc">Institute (A-Z)</option>
                                <option value="desc">Institute (Z-A)</option>
                            </select>
                        </div>
                    </header>
                    <hr />
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>MoU Name</th>
                                    <th>Institute</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                    <th>View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.date}</td>
                                            <td>{item.mouName}</td>
                                            <td>{item.institute}</td>
                                            <td>
                                                <button className="status-button">{item.status}</button>
                                            </td>
                                            <td>
                                            <button className="accept-button" onClick={openAcceptModal}>Accept</button>
                                             <button className="reject-button" onClick={openRejectModal}>Reject</button>

                                                <button className="request-spec-button" onClick={() => handleAction('Request More Info', item)}>
                                                    Request More Info
                                                </button>
                                            </td>
                                            <td>
                                                <button className="view-button" onClick={() => openModal(item)}>
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">No MoU requests found for the selected criteria.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Modal to display selected MoU details */}
                    {selectedMou && showModal && (
                        <div className="modal">
                            <div className="modal-content">
                                <span className="close" onClick={closeModal}>&times;</span>
                                <h2>{selectedMou.mouName}</h2>
                                <p><strong>Institute:</strong> {selectedMou.institute}</p>
                                <p><strong>Status:</strong> {selectedMou.status}</p>
                                <p><strong>Date:</strong> {selectedMou.date}</p>
                            </div>
                        </div>
                    )}

                   {/* Accept MoU Modal */}
                   {acceptModal && (
                        <div className="modal">
                            <div className="modal-content">
                                <span className="close" onClick={() => setAcceptModal(false)}>&times;</span>
                                <h2>Accept MoU</h2>
                                <p>Confirm to send Detailed Mou Form </p>
                                <button className="confirm-button" onClick={confirmAccept}>Confirm</button>
                                <button className="cancel-button" onClick={() => setAcceptModal(false)}>Cancel</button>
                            </div>
                        </div>
                    )}

                    {/* Reject MoU Modal */}
                    {rejectModal && (
                        <div className="modal">
                            <div className="modal-content">
                                <span className="close" onClick={() => setRejectModal(false)}>&times;</span>
                                <h2>Reject MoU</h2>
                                <p>Please provide the reason for rejection:</p>
                                <input
                                    id="reject-reason"
                                    type="text"
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Enter reason for rejection"
                                />
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                                <button className="confirm-button" onClick={confirmReject}>Confirm</button>
                                <button className="cancel-button" onClick={() => setRejectModal(false)}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Application2;
