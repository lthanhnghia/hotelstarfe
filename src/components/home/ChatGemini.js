import React, { useState, useEffect ,useRef } from "react";
import axios from "axios";
import { request } from "../../config/configApi";
function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const chatBoxRef = useRef(null);
  const [showWelcomeTooltip, setShowWelcomeTooltip] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setShowWelcomeTooltip(false);
  }, 5000); // Hiển thị 5 giây rồi ẩn

  return () => clearTimeout(timer);
}, []);
  useEffect(() => {
    setTimeout(() => {
      setMessages([
        {
          role: "assistant",
          text: "Tôi là Gemini – trợ lý tư vấn phòng. Bạn muốn hỏi về giá, tiện nghi hay loại phòng nào?",
        },
      ]);
    }, 1000);
  }, []);
useEffect(() => {
  if (chatBoxRef.current) {
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }
}, [messages]);
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await request({
  method: "POST",
  path: "/api/chat",
  data: input,
  headers: {
    "Content-Type": "text/plain",
  },
});

if (response) {
  const botMessage = { role: "assistant", text: response };
  setMessages((prev) => [...prev, botMessage]);
}
    } catch (error) {
      console.error("Lỗi gửi yêu cầu:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Đã xảy ra lỗi khi kết nối đến server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* Nút bong bóng chat */}
      <div
        style={styles.geminiChat_bubble}
        onClick={() => setIsOpen(!isOpen)}
        title="Mở/Đóng chat Gemini"
      >
        💬
         {showWelcomeTooltip && (
    <div style={styles.geminiChat_tooltip}>
      Nhấn vào đây để chat với Gemini!
    </div>
  )}
      </div>

      {/* Giao diện chat */}
      {isOpen && (
        <div style={styles.geminiChat_container}>
          {/* Header với nút tắt */}
          <div style={styles.geminiChat_header}>
            <h2 style={styles.geminiChat_title}>Hỗ trợ khách sạn (Gemini)</h2>
            <button
              onClick={() => setIsOpen(false)}
              style={styles.geminiChat_closeButton}
              aria-label="Đóng chat"
            >
              ✖
            </button>
          </div>

          {/* Nội dung tin nhắn */}
          <div style={styles.geminiChat_chatBox} ref={chatBoxRef}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.geminiChat_message,
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  backgroundColor: msg.role === "user" ? "#cce5ff" : "#d4edda",
                }}
              >
                <strong>{msg.role === "user" ? "Bạn" : "Gemini"}:</strong> {msg.text}
              </div>
            ))}
            {loading && <div style={styles.geminiChat_loading}>Đang phản hồi...</div>}
          </div>

          {/* Khu nhập tin nhắn */}
          <div style={styles.geminiChat_inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              style={styles.geminiChat_input}
              placeholder="Nhập câu hỏi..."
              aria-label="Nhập câu hỏi"
            />
            <button onClick={sendMessage} style={styles.geminiChat_button}>
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
const isMobile = window.innerWidth <= 480;

const styles = {
  geminiChat_bubble: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#007bff",
    color: "white",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 10000,
  },
  geminiChat_container: {
    position: "fixed",
    bottom: "90px",
    right: isMobile ? "10px" : "20px",
    width: isMobile ? "calc(100vw - 20px)" : "100%",
    maxWidth: "400px",
    height: isMobile ? "80vh" : "70vh",
    maxHeight: "600px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
    zIndex: 10000,
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
  geminiChat_header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  geminiChat_title: {
    fontSize: isMobile ? "14px" : "16px",
    margin: 0,
  },
  geminiChat_closeButton: {
    background: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
  },
  geminiChat_chatBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto",
    padding: "10px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  geminiChat_message: {
    padding: "10px",
    borderRadius: "8px",
    maxWidth: "85%",
    wordWrap: "break-word",
    fontSize: isMobile ? "13px" : "14px",
  },
  geminiChat_inputArea: {
    display: "flex",
    gap: "8px",
    flexDirection: isMobile ? "column" : "row",
  },
  geminiChat_input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  geminiChat_button: {
    padding: "10px 15px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
    width: isMobile ? "100%" : "auto",
  },
  geminiChat_loading: {
    fontStyle: "italic",
    color: "gray",
  },geminiChat_tooltip: {
  position: "absolute",
  bottom: "70px",
  right: "0",
  backgroundColor: "#333",
  color: "#fff",
  padding: "6px 10px",
  borderRadius: "6px",
  fontSize: "13px",
  whiteSpace: "nowrap",
  zIndex: 10001,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
}
};


export default ChatApp;
