import React from "react";
import styles from "./Home.module.css";
import back from "./assets/back-svgrepo-com.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
const socket = io("https://cribchat-backend-production.up.railway.app");
const Home = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchedUser, setSearchedUser] = useState("");
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [fetchedUser, setFetchedUser] = useState();
  const [headerName, setHeaderName] = useState("Crib-Chat");
  const [message, setMessage] = useState();
  const [chatMsg, setChatMsg] = useState([]);
  const [activeRoom, setActiveRoom] = useState();
  const [isMobile, setIsMobile] = useState(false);
  const [showSideBar, setShowSideBar] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    function setVh() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }

    setVh(); // Set on mount

    window.addEventListener("resize", setVh); // Optional: update on resize

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", setVh);
    };
  }, []);
  useEffect(() => {
    if (!user) {
      navigate("/signup");
    }
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    fetch("https://cribchat-backend-production.up.railway.app/users/login", {
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
    fetch("https://cribchat-backend-production.up.railway.app/users/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: searchEmail }),
    })
      .then((res) => res.json())
      .then((res) => {
        setSearchEmail("");
        if (res.status === "fail") {
          let timerInterval;
          Swal.fire({
            title: "User not found!",
            html: "Try again in <b></b> milliseconds.",
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              const timer = Swal.getPopup().querySelector("b");
              timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
              }, 100);
            },
            willClose: () => {
              clearInterval(timerInterval);
            },
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              console.log("I was closed by the timer");
            }
          });
          return;
        }

        setSearchedUser(res);
      });
  };

  const sfends = (el) => {
    setFriends((prev) => [...prev, el]);
  };
  const joinRoom = (id1, id2) => {
    const id = [id1, id2].sort().join("_private_");
    setActiveRoom(id);
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
    socket.on("resMsg", (data) => {
      setChatMsg((prev) => [...prev, data]);
    });
    return () => {
      socket.off("ifJoined");
      socket.off("resMsg");
    };
  }, []);
  const sendMessage = () => {
    socket.emit("message", { id: fetchedUser?.user.id, message, activeRoom });
  };
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 720);
    };

    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      {showSideBar ? (
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
                  setSearchedUser(false);
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
                      setShowSideBar(false);
                      setIsMobile(false);
                      setHeaderName(el.name);
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
      ) : (
        ""
      )}

      {/* Main Chat Area */}
      {(!isMobile || (isMobile && activeRoom)) && (
        <div className={styles.mainChat}>
          <div className={styles.chatHeader}>
            <img
              src={back}
              className={styles.back}
              onClick={() => {
                setActiveRoom(false);
                setShowSideBar(true);
              }}
            />
            <div className={styles.chatHeaderAvatar}></div>
            <div className={styles.chatHeaderInfo}>
              <div className={styles.chatHeaderName}>{headerName}</div>
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
            {chatMsg.map((el) => (
              <div
                className={
                  el.id === fetchedUser?.user.id
                    ? styles.messageSent
                    : styles.messageReceived
                }
              >
                <div className={styles.messageText}>{el.message}</div>
              </div>
            ))}

            {/* Add more messages as needed */}
          </div>
          <div className={styles.chatInputArea}>
            <div className={styles.plus}>+</div>
            <input
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              type="text"
              placeholder="Type a message"
              className={styles.chatInput}
            />
            <button
              className={styles.iconButton}
              title="Send"
              onClick={() => {
                sendMessage();
                setMessage("");
              }}
            >
              &#10148;
            </button>
            <button className={styles.iconButton} title="Mic">
              &#127908;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
