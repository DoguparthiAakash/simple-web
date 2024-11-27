"use client";
import React from "react";

import { useUpload } from "../utilities/runtime-helpers";

function MainComponent() {
  const [activeTab, setActiveTab] = useState("chats");
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showReels, setShowReels] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const handleClose = (closeFunction) => {
    setIsClosing(true);
    setTimeout(() => {
      closeFunction(false);
      setIsClosing(false);
    }, 200);
  };
  const [contacts] = useState([
    {
      id: 1,
      name: "You",
      avatar: "/avatar1.jpg",
      status: "Active now",
      lastMessage: "Hey there!",
      unreadCount: 0,
      isOnline: true,
    },
    {
      id: 2,
      name: "John",
      avatar: "/avatar2.jpg",
      status: "Active 5m ago",
      lastMessage: "See you tomorrow!",
      unreadCount: 3,
      isOnline: true,
    },
    {
      id: 3,
      name: "Sarah",
      avatar: "/avatar3.jpg",
      status: "Active 1h ago",
      lastMessage: "Thanks!",
      unreadCount: 1,
      isOnline: false,
    },
    {
      id: 4,
      name: "Mike",
      avatar: "/avatar4.jpg",
      status: "Active yesterday",
      lastMessage: "Ok, got it",
      unreadCount: 0,
      isOnline: false,
    },
  ]);
  const [groups] = useState([
    {
      id: 1,
      name: "Family Group",
      avatar: "/group1.jpg",
      members: 5,
      activeMembers: 3,
    },
    {
      id: 2,
      name: "Work Team",
      avatar: "/group2.jpg",
      members: 12,
      activeMembers: 8,
    },
  ]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [currentUser] = useState({
    id: 1,
    name: "You",
    avatar: "/avatar1.jpg",
  });
  const [otherUser] = useState({
    id: 2,
    name: "John",
    avatar: "/avatar2.jpg",
  });
  const [reels, setReels] = useState([
    {
      id: 1,
      userId: "@john123",
      user: "John",
      avatar: "/avatar2.jpg",
      video: "/video1.mp4",
      likes: 234,
      comments: 45,
      saved: false,
      liked: false,
      following: false,
    },
    {
      id: 2,
      userId: "@sarah456",
      user: "Sarah",
      avatar: "/avatar3.jpg",
      video: "/video2.mp4",
      likes: 567,
      comments: 89,
      saved: false,
      liked: false,
      following: false,
    },
  ]);
  const [upload, { loading }] = useUpload();
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() || selectedMedia) {
      if (selectedMedia) {
        handleMediaUpload();
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: newMessage,
            sender: currentUser,
            timestamp: new Date(),
            type: "text",
          },
        ]);
      }
      setNewMessage("");
      setSelectedMedia(null);
      setPreviewUrl(null);
    }
  };
  const handleMediaSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedMedia(file);
    setPreviewUrl(URL.createObjectURL(file));
  };
  const handleMediaUpload = async () => {
    if (!selectedMedia) return;

    try {
      setUploadProgress(0);
      const { url, error } = await upload({
        file: selectedMedia,
        onProgress: (progress) => setUploadProgress(progress),
      });

      if (error) {
        setError(error);
        return;
      }

      const type = selectedMedia.type.startsWith("image/") ? "image" : "video";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          fileUrl: url,
          type,
          sender: currentUser,
          timestamp: new Date(),
        },
      ]);

      setUploadProgress(0);
      setSelectedMedia(null);
      setPreviewUrl(null);
    } catch (err) {
      setError("Failed to upload media");
      setUploadProgress(0);
    }
  };
  const handleImageUpload = async (file) => {
    if (!file) return;

    const { url, error } = await upload({ file });

    if (error) {
      setError(error);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        fileUrl: url,
        type: "image",
        sender: currentUser,
        timestamp: new Date(),
      },
    ]);
    handleClose(setShowCamera);
  };
  const handleLike = (reelId) => {
    setReels(
      reels.map((reel) =>
        reel.id === reelId
          ? {
              ...reel,
              liked: !reel.liked,
              likes: reel.liked ? reel.likes - 1 : reel.likes + 1,
            }
          : reel
      )
    );
  };
  const handleFollow = (reelId) => {
    setReels(
      reels.map((reel) =>
        reel.id === reelId
          ? {
              ...reel,
              following: !reel.following,
            }
          : reel
      )
    );
  };
  const handleReelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Please upload a video file");
      return;
    }

    try {
      setUploadProgress(0);
      const { url, error } = await upload({
        file,
        onProgress: (progress) => setUploadProgress(progress),
      });

      if (error) {
        setError(error);
        return;
      }

      setReels((prev) => [
        {
          id: Date.now(),
          userId: "@" + currentUser.name.toLowerCase() + Date.now(),
          user: currentUser.name,
          avatar: currentUser.avatar,
          video: url,
          likes: 0,
          comments: 0,
          saved: false,
          liked: false,
          following: false,
        },
        ...prev,
      ]);
      setUploadProgress(0);
    } catch (err) {
      setError("Failed to upload video");
      setUploadProgress(0);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50" role="main">
      <div className="bg-white shadow-sm">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => setShowSettings(true)}
              className="text-gray-600"
              aria-label="Open settings"
            >
              <i className="fas fa-cog text-xl" aria-hidden="true"></i>
            </button>
            <nav
              className="flex space-x-4"
              role="tablist"
              aria-label="Chat sections"
            >
              <button
                onClick={() => setActiveTab("chats")}
                className={`px-3 py-1 rounded-full ${
                  activeTab === "chats"
                    ? "bg-[#007AFF] text-white"
                    : "text-gray-600"
                }`}
                role="tab"
                aria-selected={activeTab === "chats"}
                aria-controls="chats-panel"
                id="chats-tab"
              >
                Chats
              </button>
              <button
                onClick={() => setActiveTab("contacts")}
                className={`px-3 py-1 rounded-full ${
                  activeTab === "contacts"
                    ? "bg-[#007AFF] text-white"
                    : "text-gray-600"
                }`}
                role="tab"
                aria-selected={activeTab === "contacts"}
                aria-controls="contacts-panel"
                id="contacts-tab"
              >
                Contacts
              </button>
              <button
                onClick={() => setActiveTab("reels")}
                className={`px-3 py-1 rounded-full ${
                  activeTab === "reels"
                    ? "bg-[#007AFF] text-white"
                    : "text-gray-600"
                }`}
                role="tab"
                aria-selected={activeTab === "reels"}
                aria-controls="reels-panel"
                id="reels-tab"
              >
                Reels
              </button>
            </nav>
            <button
              onClick={() => setShowNewGroup(true)}
              className="text-[#007AFF]"
              aria-label="Create new group"
            >
              <i className="fas fa-plus" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>

      {activeTab === "chats" && (
        <div
          className="flex-1 overflow-y-auto px-4 py-2"
          role="tabpanel"
          id="chats-panel"
          aria-labelledby="chats-tab"
        >
          <div className="max-w-lg mx-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender.id === currentUser.id
                    ? "justify-end"
                    : "justify-start"
                }`}
                style={{ animation: "slideInMessage 0.3s ease-out forwards" }}
              >
                {message.sender.id !== currentUser.id && (
                  <img
                    src={message.sender.avatar}
                    alt={`${message.sender.name}'s avatar`}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-lg
            ${
              message.sender.id === currentUser.id
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
                  role="article"
                  aria-label={`Message from ${message.sender.name}`}
                >
                  {message.type === "text" ? (
                    message.text
                  ) : message.type === "image" ? (
                    <img
                      src={message.fileUrl}
                      alt="Shared image"
                      className="rounded-lg max-w-full cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(message.fileUrl, "_blank")}
                    />
                  ) : message.type === "video" ? (
                    <video
                      src={message.fileUrl}
                      className="rounded-lg max-w-full"
                      controls
                      preload="metadata"
                    />
                  ) : (
                    <a
                      href={message.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                      aria-label={`Download file: ${message.fileName}`}
                    >
                      <i className="fas fa-file" aria-hidden="true"></i>
                      <span className="underline">{message.fileName}</span>
                    </a>
                  )}
                  <div className="text-xs mt-1 opacity-70" role="time">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "contacts" && (
        <div
          className="flex-1 overflow-y-auto p-4"
          role="tabpanel"
          id="contacts-panel"
          aria-labelledby="contacts-tab"
        >
          <div className="max-w-lg mx-auto space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                role="listitem"
              >
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      src={contact.avatar}
                      alt={`${contact.name}'s avatar`}
                      className="w-12 h-12 rounded-full"
                    />
                    {contact.isOnline && (
                      <div
                        className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                        role="status"
                        aria-label="Online"
                      ></div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold">{contact.name}</div>
                    <div
                      className="text-sm text-gray-500"
                      aria-label="Last message"
                    >
                      {contact.lastMessage}
                    </div>
                  </div>
                </div>
                {contact.unreadCount > 0 && (
                  <div
                    className="bg-[#007AFF] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    role="status"
                    aria-label={`${contact.unreadCount} unread messages`}
                  >
                    {contact.unreadCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "reels" && (
        <div
          className="flex-1 overflow-y-auto bg-black"
          role="tabpanel"
          id="reels-panel"
          aria-labelledby="reels-tab"
        >
          {reels.map((reel) => (
            <div key={reel.id} className="h-screen relative">
              <video
                src={reel.video}
                className="w-full h-full object-cover"
                loop
                controls
                aria-label={`Reel by ${reel.user}`}
              />
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-3">
                  <img
                    src={reel.avatar}
                    alt={reel.user}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      {reel.user}
                      <button
                        onClick={() => handleFollow(reel.id)}
                        className={`text-xs px-2 py-1 rounded ${
                          reel.following ? "bg-gray-500" : "bg-[#007AFF]"
                        }`}
                      >
                        {reel.following ? "Following" : "Follow"}
                      </button>
                    </div>
                    <div className="text-sm text-gray-300">{reel.userId}</div>
                  </div>
                </div>
              </div>
              <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
                <button
                  className="text-white"
                  onClick={() => handleLike(reel.id)}
                  aria-label={reel.liked ? "Unlike" : "Like"}
                  aria-pressed={reel.liked}
                >
                  <i
                    className={`fas fa-heart text-2xl ${
                      reel.liked ? "text-[#FF0000]" : ""
                    }`}
                    aria-hidden="true"
                  ></i>
                  <div className="text-sm" aria-label={`${reel.likes} likes`}>
                    {reel.likes}
                  </div>
                </button>
                <button className="text-white" aria-label="Comments">
                  <i className="fas fa-comment text-2xl" aria-hidden="true"></i>
                  <div
                    className="text-sm"
                    aria-label={`${reel.comments} comments`}
                  >
                    {reel.comments}
                  </div>
                </button>
                <button className="text-white" aria-label="Share">
                  <i
                    className="fas fa-paper-plane text-2xl"
                    aria-hidden="true"
                  ></i>
                </button>
                <button className="text-white" aria-label="Save">
                  <i
                    className="fas fa-bookmark text-2xl"
                    aria-hidden="true"
                  ></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "chats" && (
        <div className="bg-white border-t border-gray-200">
          {showCamera && (
            <div
              className="fixed inset-0 bg-black z-50"
              role="dialog"
              aria-label="Camera"
            >
              <div className="relative h-full">
                <div className="absolute top-4 left-4 z-10 flex space-x-4">
                  <button className="text-white text-xl" aria-label="Flash">
                    <i className="fas fa-bolt" aria-hidden="true"></i>
                  </button>
                  <button
                    className="text-white text-xl"
                    aria-label="Night mode"
                  >
                    <i className="fas fa-moon" aria-hidden="true"></i>
                  </button>
                </div>
                <div className="absolute top-4 right-4 z-10 flex space-x-4">
                  <button
                    className="text-white text-xl"
                    aria-label="Switch camera"
                  >
                    <i className="fas fa-sync-alt" aria-hidden="true"></i>
                  </button>
                  <button
                    onClick={() => setShowCamera(false)}
                    className="text-white text-xl"
                    aria-label="Close camera"
                  >
                    <i className="fas fa-times" aria-hidden="true"></i>
                  </button>
                </div>
                <input
                  type="file"
                  accept="image/*,video/*"
                  capture="environment"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleImageUpload(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  id="cameraInput"
                  aria-label="Take photo or video"
                />
                <label
                  htmlFor="cameraInput"
                  className="absolute inset-0 flex items-center justify-center"
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      document.getElementById("cameraInput")?.click();
                    }
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full border-4 border-white mb-4 flex items-center justify-center">
                      <i
                        className="fas fa-camera text-white text-3xl"
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div className="text-white text-sm">Tap to capture</div>
                  </div>
                </label>
                <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-8">
                  <button className="text-white text-xl" aria-label="Gallery">
                    <i className="fas fa-images" aria-hidden="true"></i>
                  </button>
                  <button className="text-white text-xl" aria-label="Effects">
                    <i className="fas fa-magic" aria-hidden="true"></i>
                  </button>
                  <button className="text-white text-xl" aria-label="Filters">
                    <i className="fas fa-filter" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
          )}
          {showEmojis && (
            <div
              className="max-w-lg mx-auto p-2 grid grid-cols-8 gap-2 bg-white border-t border-gray-200"
              role="dialog"
              aria-label="Emoji picker"
            >
              {[
                "😊",
                "😂",
                "❤️",
                "👍",
                "😎",
                "🎉",
                "🔥",
                "✨",
                "🥰",
                "😍",
                "🤗",
                "🤔",
                "😅",
                "😭",
                "🙌",
                "👋",
                "🎈",
                "🌟",
                "💫",
                "💕",
                "💖",
                "💝",
                "🌈",
                "🍕",
              ].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setNewMessage((prev) => prev + emoji)}
                  className="text-2xl hover:bg-gray-100 rounded p-1"
                  aria-label={`Add ${emoji} emoji`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
          {selectedMedia && (
            <div className="max-w-lg mx-auto p-2 border-t border-gray-200">
              <div className="relative">
                {selectedMedia.type.startsWith("image/") ? (
                  <img
                    src={previewUrl}
                    alt="Selected media preview"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={previewUrl}
                    className="w-full h-40 object-cover rounded-lg"
                    controls
                  />
                )}
                <button
                  onClick={() => {
                    setSelectedMedia(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}
          <div className="max-w-lg mx-auto p-2">
            <form
              onSubmit={sendMessage}
              className="flex items-center gap-2"
              role="form"
            >
              <button
                type="button"
                onClick={() => setShowEmojis(!showEmojis)}
                className="text-gray-600 w-8 h-8 flex items-center justify-center"
                aria-label="Open emoji picker"
                aria-expanded={showEmojis}
              >
                <i className="fas fa-smile" aria-hidden="true"></i>
              </button>
              <input
                type="text"
                name="message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Chat"
                className="flex-1 bg-gray-100 text-gray-800 rounded-full px-4 py-2 outline-none"
                aria-label="Message input"
              />
              <label className="text-gray-600 w-8 h-8 flex items-center justify-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaSelect}
                  className="hidden"
                  aria-label="Attach photo or video"
                />
                <i className="fas fa-image" aria-hidden="true"></i>
              </label>
              <label className="text-gray-600 w-8 h-8 flex items-center justify-center cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.zip,.rar"
                  onChange={handleMediaSelect}
                  className="hidden"
                  aria-label="Attach file"
                />
                <i className="fas fa-paperclip" aria-hidden="true"></i>
              </label>
              <button
                type="button"
                onClick={() => setShowCamera(true)}
                className="text-gray-600 w-8 h-8 flex items-center justify-center"
                aria-label="Open camera"
              >
                <i className="fas fa-camera" aria-hidden="true"></i>
              </button>
              {(newMessage || selectedMedia) && (
                <button
                  type="submit"
                  className="text-blue-500 w-8 h-8 flex items-center justify-center"
                  aria-label="Send message"
                >
                  <i className="fas fa-paper-plane" aria-hidden="true"></i>
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {activeTab === "reels" && (
        <div className="fixed bottom-4 right-4">
          <label className="bg-[#007AFF] text-white rounded-full w-12 h-12 flex items-center justify-center cursor-pointer shadow-lg relative">
            <input
              type="file"
              accept="video/*"
              capture="environment"
              onChange={handleReelUpload}
              className="hidden"
              aria-label="Upload new reel"
            />
            {loading ? (
              <div
                className="absolute inset-0 flex items-center justify-center"
                role="status"
                aria-label="Uploading"
              >
                <div className="h-full w-full rounded-full border-4 border-white border-t-transparent animate-spin"></div>
                <span className="absolute text-xs">{uploadProgress}%</span>
              </div>
            ) : (
              <i className="fas fa-plus text-xl" aria-hidden="true"></i>
            )}
          </label>
          {error && (
            <div
              className="absolute bottom-16 right-0 bg-red-500 text-white text-sm px-4 py-2 rounded-lg"
              role="alert"
            >
              {error}
            </div>
          )}
        </div>
      )}

      {showNewGroup && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 ${
            isClosing ? "overlay-exit" : ""
          }`}
          role="dialog"
          aria-labelledby="create-new-title"
          aria-modal="true"
          style={{ animation: "fadeIn 0.2s ease-out" }}
        >
          <div
            className={`bg-white rounded-lg p-6 w-full max-w-md ${
              isClosing ? "modal-exit" : ""
            }`}
            style={{ animation: "slideInModal 0.3s ease-out" }}
          >
            <h3 className="text-lg font-semibold mb-4" id="create-new-title">
              Create New
            </h3>
            <div className="space-y-4">
              <button className="w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <i className="fas fa-users mr-3" aria-hidden="true"></i>
                    New Group
                  </div>
                  <span className="text-sm text-gray-500">
                    Create a group chat
                  </span>
                </div>
              </button>
              <button className="w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <i className="fas fa-globe mr-3" aria-hidden="true"></i>
                    New Community
                  </div>
                  <span className="text-sm text-gray-500">
                    {groups.reduce(
                      (acc, group) => acc + group.activeMembers,
                      0
                    )}{" "}
                    active
                  </span>
                </div>
              </button>
            </div>
            <button
              onClick={() => handleClose(setShowNewGroup)}
              className="mt-4 w-full p-2 bg-[#007AFF] text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${
            isClosing ? "overlay-exit" : ""
          }`}
          role="dialog"
          aria-labelledby="settings-title"
          aria-modal="true"
          style={{ animation: "fadeIn 0.2s ease-out" }}
        >
          <div
            className={`bg-white rounded-lg w-full max-w-md overflow-hidden ${
              isClosing ? "modal-exit" : ""
            }`}
            style={{ animation: "slideInModal 0.3s ease-out" }}
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt="Your profile picture"
                    className="w-20 h-20 rounded-full border-2 border-gray-200"
                  />
                  <button
                    className="absolute bottom-0 right-0 bg-[#007AFF] text-white rounded-full w-6 h-6 flex items-center justify-center"
                    aria-label="Change profile picture"
                  >
                    <i className="fas fa-camera text-sm" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
              <div className="text-center mt-3">
                <h4 className="font-semibold text-lg" id="settings-title">
                  {currentUser.name}
                </h4>
                <p className="text-gray-500 text-sm">
                  @{currentUser.name.toLowerCase()}
                </p>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <button className="w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <i
                      className="fas fa-user-edit mr-3 text-[#007AFF]"
                      aria-hidden="true"
                    ></i>
                    Edit Profile
                  </div>
                  <i
                    className="fas fa-chevron-right text-gray-400"
                    aria-hidden="true"
                  ></i>
                </div>
              </button>
              <button
                className="w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100"
                role="switch"
                aria-checked={isDarkMode}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <i
                      className="fas fa-moon mr-3 text-[#007AFF]"
                      aria-hidden="true"
                    ></i>
                    Dark Mode
                  </div>
                  <div
                    className={`w-12 h-6 rounded-full p-1 ${
                      isDarkMode ? "bg-[#007AFF]" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                        isDarkMode ? "translate-x-6" : ""
                      }`}
                    ></div>
                  </div>
                </div>
              </button>
              <button className="w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <i
                      className="fas fa-bell mr-3 text-[#007AFF]"
                      aria-hidden="true"
                    ></i>
                    Notifications
                  </div>
                  <i
                    className="fas fa-chevron-right text-gray-400"
                    aria-hidden="true"
                  ></i>
                </div>
              </button>
              <button className="w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <i
                      className="fas fa-lock mr-3 text-[#007AFF]"
                      aria-hidden="true"
                    ></i>
                    Privacy
                  </div>
                  <i
                    className="fas fa-chevron-right text-gray-400"
                    aria-hidden="true"
                  ></i>
                </div>
              </button>
              <button className="w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <i
                      className="fas fa-question-circle mr-3 text-[#007AFF]"
                      aria-hidden="true"
                    ></i>
                    Help
                  </div>
                  <i
                    className="fas fa-chevron-right text-gray-400"
                    aria-hidden="true"
                  ></i>
                </div>
              </button>
              <button className="w-full p-3 text-left text-red-500">
                <div className="flex items-center">
                  <i
                    className="fas fa-sign-out-alt mr-3"
                    aria-hidden="true"
                  ></i>
                  Log Out
                </div>
              </button>
            </div>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => handleClose(setShowSettings)}
                className="w-full p-2 bg-[#007AFF] text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideInMessage {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideInModal {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideOutModal {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-exit {
          animation: slideOutModal 0.2s ease-out forwards;
        }
        
        .overlay-exit {
          animation: fadeOut 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default MainComponent;