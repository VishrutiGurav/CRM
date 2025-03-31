import React, { useState } from "react";
import "./MouList.css";
import { FaUserGraduate, FaSearch , FaUserCircle} from "react-icons/fa"; // For profile icon

const MouList = () => {
      const [search, setSearch] = useState("");
      const [sort, setSort] = useState("latest");
    
      // Sample Data
      const mouData = [
        { id: 1, name: "Vishruti Gurav", date: "24 March 2024" },
        { id: 2, name: "Amit Sharma", date: "20 March 2024" },
        { id: 3, name: "Neha Verma", date: "18 March 2024" },
      ];
    
      // Sort function
      const sortedData = [...mouData].sort((a, b) =>
        sort === "latest"
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date)
      );
    
      return (
        <div className="mou-container">
      <h1 className="title">MOU Submissions</h1>
      <div className="title-underline"></div> {/* Blurred Line Below Title */}
    
      <div className="search-sort">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          </div>
            <select onChange={(e) => setSort(e.target.value)} value={sort}>
              <option value="latest">Sort by Latest</option>
              <option value="oldest">Sort by Oldest</option>
            </select>
          </div>
    
          <div className="mou-list">
            {sortedData
              .filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((mou) => (
                <div key={mou.id} className="moucard">
                  <FaUserCircle className="profile-icon" />
                  <div className="mou-info">
                    <h2>{mou.name}</h2>
                    <p className="date">{mou.date}</p>
                    <div className="buttons">
                      <button className="approve">✔ Approve</button>
                      <button className="reject">✖ Reject</button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      );
    };
    

export default MouList;
