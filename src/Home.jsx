import React from "react";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";
const socket = io("cribchat-backend-production.up.railway.app");
const Home = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchedUser, setSearchedUser] = useState("");
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [fetchedUser, setFetchedUser] = useState();
  useEffect(() => {
    if (!user) {
      navigate("/signup");
    }
  }, []);

  useEffect(() => {
    fetch("cribchat-backend-production.up.railway.app/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: user }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.status === "fail") {
          return;
        }
        setFetchedUser(res);
      });
  }, []);
  const searchUser = () => {
    fetch("cribchat-backend-production.up.railway.app/users/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: searchEmail }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "fail") {
          alert(res.message);
        }
        setSearchedUser(res);
      });
  };

  const sfends = (el) => {
    setFriends((prev) => [...prev, el]);
  };
  const joinRoom = (id1, id2) => {
    const id = [id1, id2].sort().join("_private_");
    console.log("Emitting joinRoom with id:", id);
    socket.emit("joinRoom", id);
  };
  useEffect(() => {
    socket.on("ifJoined", (data) => {
      console.log("Received ifJoined event with data:", data);
      try {
        alert(data);
      } catch (error) {
        console.error("Alert failed:", error);
      }
    });
    return () => socket.off("ifJoined");
  }, []);
  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.chats}>Chats</h1>
          <div className={styles.sidebarIcons}>
            <button className={styles.iconButton} title="New Chat">
              &#128172;
            </button>
            <button className={styles.iconButton} title="Menu">
              &#8942;
            </button>
          </div>
        </div>
        <div className={styles.search}>
          <input
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            type="text"
            placeholder="Search with email"
            className={styles.searchInput}
          />
          <button
            className={styles.iconButton}
            title="Send"
            onClick={searchUser}
          >
            &#10148;
          </button>
        </div>
        {searchedUser ? (
          <div
            style={{
              color: "black",
              textAlign: "center",
              display: "flex",
              paddingLeft: "1rem",
              gap: ".5rem",
              paddingBottom: "1rem",
            }}
          >
            <h4>Found a user :</h4>
            <p
              style={{
                opacity: "80%",
                fontWeight: "500",
                cursor: "pointer",
              }}
              onClick={() => {
                sfends(searchedUser?.user);
              }}
            >
              {searchedUser?.user.name}
            </p>
          </div>
        ) : (
          ""
        )}
        <div className={styles.chatTabs}>
          <button className={`${styles.tabButton} ${styles.active}`}>
            All
          </button>
          <button className={styles.tabButton}>Unread</button>
          <button className={styles.tabButton}>Favorites</button>
          <button className={styles.tabButton}>Groups</button>
        </div>
        <div className={styles.chatList}>
          {friends
            ? friends.map((el) => (
                <div
                  className={styles.chatItem}
                  onClick={() => {
                    joinRoom(el.id, fetchedUser.user.id);
                  }}
                >
                  <div className={styles.chatAvatar}></div>
                  <div className={styles.chatInfo}>
                    <div className={styles.chatName}>{el.name}</div>
                    <div className={styles.chatLastMessage}>
                      Good morning ma
                    </div>
                  </div>
                  <div className={styles.chatTime}>11:57</div>
                </div>
              ))
            : ""}
          {/* Add more chat items as needed */}
        </div>
        <div className={styles.sidebarFooter}>
          <button className={styles.iconButton} title="Settings">
            &#9881;
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={styles.mainChat}>
        <div className={styles.chatHeader}>
          <div className={styles.chatHeaderAvatar}></div>
          <div className={styles.chatHeaderInfo}>
            <div className={styles.chatHeaderName}>Mum ✨</div>
            <div className={styles.chatHeaderStatus}>
              last seen today at 12:07
            </div>
          </div>
          <div className={styles.chatHeaderIcons}>
            <button className={styles.iconButton} title="Video Call">
              &#128249;
            </button>
            <button className={styles.iconButton} title="Search">
              &#128269;
            </button>
            <button className={styles.iconButton} title="Menu">
              &#8942;
            </button>
          </div>
        </div>
        <div className={styles.chatMessages}>
          <div className={styles.messageReceived}>
            <div className={styles.messageText}>
              Ok thank you I will show the person that wants to help me do it
              tomorrow
            </div>
            <div className={styles.messageTime}>21:41</div>
          </div>
          <div className={styles.messageSent}>
            <div className={styles.messageText}>Okay ma</div>
            <div className={styles.messageTime}>21:41</div>
          </div>
          <div className={styles.messageReceived}>
            <div className={styles.messageText}>Hi</div>
            <div className={styles.messageTime}>11:02</div>
          </div>
          <div className={styles.messageSent}>
            <div className={styles.messageText}>Good morning ma</div>
            <div className={styles.messageTime}>11:48</div>
          </div>
          {/* Add more messages as needed */}
        </div>
        <div className={styles.chatInputArea}>
          <div className={styles.plus}>+</div>
          <input
            type="text"
            placeholder="Type a message"
            className={styles.chatInput}
          />
          <button className={styles.iconButton} title="Send">
            &#10148;
          </button>
          <button className={styles.iconButton} title="Mic">
            &#127908;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
