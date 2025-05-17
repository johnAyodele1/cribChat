import React from "react";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.chats}>Chats</h1>
          <div className={styles.sidebarIcons}>
            <button className={styles.iconButton} title="Status">
              &#128247;
            </button>
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
            type="text"
            placeholder="Search or start new chat"
            className={styles.searchInput}
          />
        </div>
        <div className={styles.chatTabs}>
          <button className={`${styles.tabButton} ${styles.active}`}>
            All
          </button>
          <button className={styles.tabButton}>Unread</button>
          <button className={styles.tabButton}>Favorites</button>
          <button className={styles.tabButton}>Groups</button>
        </div>
        <div className={styles.chatList}>
          {/* Example chat item */}
          <div className={styles.chatItem}>
            <div className={styles.chatAvatar}></div>
            <div className={styles.chatInfo}>
              <div className={styles.chatName}>David ✨</div>
              <div className={styles.chatLastMessage}>Good morning ma</div>
            </div>
            <div className={styles.chatTime}>11:57</div>
          </div>
          <div className={styles.chatItem}>
            <div className={styles.chatAvatar}></div>
            <div className={styles.chatInfo}>
              <div className={styles.chatName}>+234 812 113 1751</div>
              <div className={styles.chatLastMessage}>Thanks</div>
            </div>
            <div className={styles.chatTime}>11:20</div>
          </div>
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
          <button className={styles.iconButton} title="Emoji">
            &#128515;
          </button>
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
