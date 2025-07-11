
import React, { useState, useEffect, useRef, useContext } from "react";
import { SocketContext } from "../../context/SocketContext";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import "./globalchat.css";

const GlobalChatBox = () => {
    const socket = useContext(SocketContext);
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [replyToMessage, setReplyToMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const user = JSON.parse(localStorage.getItem("user")); // ✅ consistent use
    const companyId = user?.companyId;

    useEffect(() => {
        if (!companyId) {
            console.error("No companyId found");
            return;
        }

        socket.emit("joinCompanyRoom", companyId);

        const fetchMessages = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`http://localhost:5000/api/chat?companyId=${companyId}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setMessages(data);
                }
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();

        socket.on("chatMessage", (msg) => {
            if (msg.companyId === companyId) {
                setMessages((prev) => [...prev, msg]);
                if (String(msg.senderId) === String(user?._id)) {
                    setTimeout(scrollToBottom, 100);
                }
            }
        });

        return () => {
            socket.off("chatMessage");
        };
    }, [socket]);

    const sendMessage = () => {
        if (!newMsg.trim()) return;

        if (!user || !companyId) {
            console.error("User or companyId missing");
            return;
        }

        const message = {
            content: newMsg,
            senderName: user.name,
            senderId: user._id,
            companyId,
            timestamp: new Date().toISOString(),
            replyTo: replyToMessage
                ? {
                      senderName: replyToMessage.senderName,
                      content: replyToMessage.content,
                  }
                : null,
        };

        socket.emit("chatMessage", message);
        setNewMsg("");
        setReplyToMessage(null);
        scrollToBottom();
    };

    const handleEmojiSelect = (emoji) => {
        setNewMsg((prev) => prev + emoji.native);
        setShowEmojiPicker(false);
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="global-chat-container">
            <div className="chat-header">
                <h5>Team Collaboration</h5>
                <div className="status-indicator">
                    <span className="online-dot"></span>
                    <small>Active</small>
                </div>
            </div>

            {isLoading ? (
                <div className="chat-loading">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="chat-messages">
                    {messages.length === 0 ? (
                        <div className="no-messages">
                            <i className="bi bi-chat-square-text"></i>
                            <p>No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg, i) => {
                                const isSent = String(msg.senderId) === String(user?._id);
                                return (
                                    <div
                                        key={i}
                                        className={`message-bubble ${isSent ? "sent" : "received"}`}
                                    >
                                        <div className="message-header">
                                            <span className="sender-name">{msg.senderName}</span>
                                            <span className="message-time">
                                                {formatTime(msg.timestamp)}
                                            </span>
                                        </div>

                                        {msg.replyTo && (
                                            <div className="reply-preview">
                                                <div className="reply-header">
                                                    <i className="bi bi-reply-fill"></i>
                                                    <span>Replying to {msg.replyTo.senderName}</span>
                                                </div>
                                                <div className="reply-content">{msg.replyTo.content}</div>
                                            </div>
                                        )}

                                        <div className="message-content">{msg.content}</div>

                                        {!isSent && (
                                            <button
                                                className="reply-button"
                                                onClick={() => setReplyToMessage(msg)}
                                                title="Reply to this message"
                                            >
                                                <i className="bi bi-reply"></i>
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>
            )}

            {replyToMessage && (
                <div className="reply-indicator">
                    <div className="reply-content">
                        <strong>Replying to {replyToMessage.senderName}:</strong>{" "}
                        {replyToMessage.content.length > 50
                            ? `${replyToMessage.content.substring(0, 50)}...`
                            : replyToMessage.content}
                    </div>
                    <button
                        className="cancel-reply"
                        onClick={() => setReplyToMessage(null)}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            )}

            <div className="chat-input-container">
                <button
                    className="emoji-toggle"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    title="Emoji picker"
                >
                    <i className="bi bi-emoji-smile"></i>
                </button>

                {showEmojiPicker && (
                    <div className="emoji-picker-container">
                        <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light"  previewPosition="none" />
                    </div>
                )}

                <input
                    type="text"
                    className="chat-input"
                    placeholder="Type your message..."
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />

                <button
                    className="send-button"
                    onClick={sendMessage}
                    disabled={!newMsg.trim()}
                >
                    <i className="bi bi-send-fill"></i>
                </button>
            </div>
        </div>
    );
};

export default GlobalChatBox;
