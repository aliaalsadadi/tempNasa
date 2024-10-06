import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyDEmoJPQhkqu9EWUQJCBGbQeSVKx5qjy_w";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "tunedModels/skylify-ild09jqmuzw9",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    setMessages(storedMessages);
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage) return;

    const userMessage = { text: inputMessage, fromUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setInputMessage('');
    setIsWaiting(true);

    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const result = await chatSession.sendMessage(inputMessage);

      if (result.response) {
        const botResponseText = result.response.text().replace(/##+/g, '**');
        const botResponse = { text: botResponseText, fromUser: false };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
      }

      setIsWaiting(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsWaiting(false);
    }
  };

  return (
    <div style={{ zIndex: 1000,position: 'relative'}}>
      <div
        onClick={toggleChat}
        className="fixed bottom-5 right-10 cursor-pointer text-xl text-white bg-red-600 p-2 rounded-full shadow-lg w-9 h-9 flex items-center justify-center"
      >
        {isOpen ? <span className="text-2xl">▼</span> :
          <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 128 128" aria-hidden="true" role="img" class="iconify iconify--noto" preserveAspectRatio="xMidYMid meet">

            <linearGradient id="IconifyId17ecdb2904d178eab5675" gradientUnits="userSpaceOnUse" x1="63.874" y1="4.412" x2="63.874" y2="35.688" gradientTransform="matrix(1 0 0 -1 0 128)">

              <stop offset="0" stop-color="#b3b3b3">

              </stop>

              <stop offset=".033" stop-color="#b7b7b7">

              </stop>

              <stop offset=".374" stop-color="#d9d9d9">

              </stop>

              <stop offset=".559" stop-color="#e6e6e6">

              </stop>

            </linearGradient>

            <path d="M64.4 92.2h-.13c-25.82.04-52.19 9.31-52.19 31.37v.37H115.66v-.37c.01-20.8-25.33-31.37-51.26-31.37z" fill="url(#IconifyId17ecdb2904d178eab5675)">

            </path>

            <path d="M89.12 123.94v-8.7c0-2.19-1.79-3.99-3.99-3.99H44.69c-2.19 0-3.99 1.79-3.99 3.99v8.7h48.42z" fill="#a6a6a6">

            </path>

            <path d="M116.17 123.94v-.35c0-5.12-2.25-8.34-3.4-11.25l-8.06 2.81l3.29 8.8h8.17z" fill="#757575">

            </path>

            <path d="M20.51 123.94c.19-1.03.3-2.08.3-3.16c0-4.02-1.62-7.73-4.43-10.77c-2.73 3.6-4.2 7.67-4.2 12.22v1.71h8.33z" fill="#757575">

            </path>

            <linearGradient id="IconifyId17ecdb2904d178eab5676" gradientUnits="userSpaceOnUse" x1="63.983" y1="36.167" x2="63.983" y2="18.139" gradientTransform="matrix(1 0 0 -1 0 128)">

              <stop offset=".004" stop-color="#e6e6e6">

              </stop>

              <stop offset=".333" stop-color="#d9d9d9">

              </stop>

              <stop offset=".941" stop-color="#b7b7b7">

              </stop>

              <stop offset="1" stop-color="#b3b3b3">

              </stop>

            </linearGradient>

            <path d="M97.45 102.5c-11.44 4.91-23.94 7.24-36.38 6.81a84.918 84.918 0 0 1-18.15-2.61c-3.09-.79-6.14-1.76-9.12-2.89c-2.67-1.02-5.37-2.03-7.34-4.2c-1.75-1.93-2.85-4.62-2.26-7.24c.59-2.6 2.58-4.82 5.02-5.83c2.79-1.16 5.77-.89 8.5.24c2.8 1.17 5.66 2.17 8.58 2.96c11.9 3.23 24.63 3.12 36.48-.3c1.69-.49 3.36-1.04 5.01-1.66c1.63-.61 3.21-1.45 4.92-1.8c2.92-.6 6.24.03 8.51 2.05c2.3 2.05 3.34 5.28 2.34 8.23c-.97 2.86-3.38 5.07-6.11 6.24z" fill="url(#IconifyId17ecdb2904d178eab5676)">

            </path>

            <ellipse cx="64" cy="52.94" rx="49.17" ry="48.69" fill="#4c4c4c">

            </ellipse>

            <ellipse cx="64" cy="52.94" rx="46.44" ry="45.96" fill="#212121">

            </ellipse>

            <g>

              <path d="M95.3 80.11c-1.12-2.04.31-4.11 2.74-6.68c3.86-4.07 8.07-13.51 4.16-23.1c.02-.05-.77-1.67-.75-1.72l-1.61-.08c-.52-.07-18.17-.11-35.85-.11s-35.33.04-35.85.11c0 0-2.38 1.75-2.36 1.8c-3.9 9.59.3 19.03 4.16 23.1c2.43 2.57 3.86 4.64 2.74 6.68c-1.08 1.98-4.32 2.27-4.32 2.27s.75 2.03 2.54 3.12c1.66 1.01 3.7 1.25 5.11 1.28c0 0 5.52 7.63 19.93 7.63h16.04c14.42 0 19.93-7.63 19.93-7.63c1.41-.03 3.45-.27 5.11-1.28c1.8-1.09 2.54-3.12 2.54-3.12s-3.18-.29-4.26-2.27z" fill="#312d2d">

              </path>

              <radialGradient id="IconifyId17ecdb2904d178eab5677" cx="101.142" cy="45.824" r="21.003" gradientTransform="matrix(1 0 0 .4912 -24.064 59.667)" gradientUnits="userSpaceOnUse">

                <stop offset=".728" stop-color="#454140" stop-opacity="0">

                </stop>

                <stop offset="1" stop-color="#454140">

                </stop>

              </radialGradient>

              <path d="M63.99 94.41v-8.47l25.63-2.03l2.33 2.87s-5.52 7.63-19.93 7.63h-8.03z" fill="url(#IconifyId17ecdb2904d178eab5677)">

              </path>

              <radialGradient id="IconifyId17ecdb2904d178eab5678" cx="80.457" cy="48.947" r="6.207" gradientTransform="matrix(-.9057 .4238 -.3144 -.6719 186.026 77.84)" gradientUnits="userSpaceOnUse">

                <stop offset=".663" stop-color="#454140">

                </stop>

                <stop offset="1" stop-color="#454140" stop-opacity="0">

                </stop>

              </radialGradient>

              <path d="M91.89 83.08c-3.84-5.83 4.68-8 4.68-8s.01 0 .01.01c-1.48 1.84-2.15 3.44-1.29 5.03c1.08 1.98 4.32 2.27 4.32 2.27s-4.41 3.9-7.72.69z" fill="url(#IconifyId17ecdb2904d178eab5678)">

              </path>

              <radialGradient id="IconifyId17ecdb2904d178eab5679" cx="96.543" cy="66.506" r="27.263" gradientTransform="matrix(-.0746 -.9972 .8311 -.0622 33.61 161.905)" gradientUnits="userSpaceOnUse">

                <stop offset=".725" stop-color="#454140" stop-opacity="0">

                </stop>

                <stop offset="1" stop-color="#454140">

                </stop>

              </radialGradient>

              <path d="M102.22 50.33c3.81 9.29-.2 18.85-3.96 22.88c-.52.55-2.7 2.7-3.2 4.42c0 0-8.56-11.93-11.11-18.95c-.52-1.42-.99-2.87-1.05-4.38c-.05-1.13.13-2.47.78-3.43c.8-1.18 18.08-1.52 18.08-1.52c.01 0 .46.98.46.98z" fill="url(#IconifyId17ecdb2904d178eab5679)">

              </path>

              <radialGradient id="IconifyId17ecdb2904d178eab5680" cx="46.342" cy="66.506" r="27.263" gradientTransform="matrix(.0746 -.9972 -.8311 -.0622 98.155 111.844)" gradientUnits="userSpaceOnUse">

                <stop offset=".725" stop-color="#454140" stop-opacity="0">

                </stop>

                <stop offset="1" stop-color="#454140">

                </stop>

              </radialGradient>

              <path d="M25.8 50.33c-3.81 9.29.2 18.85 3.95 22.88c.52.55 2.7 2.7 3.2 4.42c0 0 8.56-11.93 11.11-18.95c.52-1.42.99-2.87 1.05-4.38c.05-1.13-.13-2.47-.78-3.43c-.8-1.18-1.73-.86-3.08-.86c-2.59 0-13.89-.66-14.77-.66c.01 0-.68.98-.68.98z" fill="url(#IconifyId17ecdb2904d178eab5680)">

              </path>

              <radialGradient id="IconifyId17ecdb2904d178eab5681" cx="50.941" cy="45.824" r="21.003" gradientTransform="matrix(-1 0 0 .4912 101.883 59.667)" gradientUnits="userSpaceOnUse">

                <stop offset=".728" stop-color="#454140" stop-opacity="0">

                </stop>

                <stop offset="1" stop-color="#454140">

                </stop>

              </radialGradient>

              <path d="M64.03 94.41v-8.47L38.4 83.91l-2.33 2.87s5.52 7.63 19.93 7.63h8.03z" fill="url(#IconifyId17ecdb2904d178eab5681)">

              </path>

              <radialGradient id="IconifyId17ecdb2904d178eab5682" cx="30.256" cy="48.947" r="6.207" gradientTransform="matrix(.9057 .4238 .3144 -.6719 -12.537 99.116)" gradientUnits="userSpaceOnUse">

                <stop offset=".663" stop-color="#454140">

                </stop>

                <stop offset="1" stop-color="#454140" stop-opacity="0">

                </stop>

              </radialGradient>

              <path d="M36.13 83.08c3.84-5.83-4.68-8-4.68-8s-.01 0-.01.01c1.48 1.84 2.15 3.44 1.29 5.03c-1.08 1.98-4.32 2.27-4.32 2.27s4.41 3.9 7.72.69z" fill="url(#IconifyId17ecdb2904d178eab5682)">

              </path>

            </g>

            <g>

              <path d="M89.18 54.03H38.82c-5.43 0-9.87 4.73-9.87 10.52s4.44 10.52 9.87 10.52h50.36c5.43 0 9.87-4.73 9.87-10.52s-4.44-10.52-9.87-10.52z" fill="#edc391">

              </path>

              <path d="M64 17.75c-16.04 0-30.89 17.15-30.89 41.83c0 24.55 15.3 36.68 30.89 36.68s30.89-12.14 30.89-36.68c0-24.68-14.85-41.83-30.89-41.83z" fill="#f9ddbd">

              </path>

              <g fill="#454140">

                <path d="M55.87 53.67c-.9-1.19-2.98-2.92-7.02-2.92s-6.12 1.73-7.02 2.92c-.4.53-.3 1.13-.02 1.5c.26.34 1.01.66 1.85.38c.83-.28 2.47-1.13 5.2-1.15c2.73.02 4.36.86 5.2 1.15c.83.28 1.59-.03 1.85-.38c.26-.36.36-.97-.04-1.5z">

                </path>

                <path d="M86.17 53.67c-.9-1.19-2.98-2.92-7.02-2.92s-6.12 1.73-7.02 2.92c-.4.53-.3 1.13-.02 1.5c.26.34 1.01.66 1.85.38c.83-.28 2.46-1.13 5.2-1.15c2.73.02 4.36.86 5.2 1.15c.83.28 1.59-.03 1.85-.38c.25-.36.35-.97-.04-1.5z">

                </path>

              </g>

              <g fill="#312d2d">

                <ellipse cx="48.85" cy="61.75" rx="4.54" ry="4.7">

                </ellipse>

                <ellipse cx="79.15" cy="61.75" rx="4.54" ry="4.7">

                </ellipse>

              </g>

              <path d="M67.56 70.27c-.1-.04-.2-.06-.3-.08h-6.52c-.1.01-.2.04-.3.08c-.59.24-.92.85-.64 1.5s1.58 2.48 4.19 2.48c2.62 0 3.91-1.83 4.19-2.48c.29-.65-.03-1.26-.62-1.5z" fill="#dba689">

              </path>

              <path d="M71.76 77.72c-2.93 1.75-12.56 1.75-15.49 0c-1.69-1-3.41.53-2.71 2.06c.69 1.5 5.94 5 10.48 5s9.72-3.49 10.41-5c.69-1.53-1.01-3.06-2.69-2.06z" fill="#444">

              </path>

            </g>

            <g>

              <path d="M100.8 32.05c-2.24-3.39-7.27-7.94-11.77-8.24c-.72-4.34-5.36-8.01-9.85-9.43c-12.15-3.85-20.06.47-24.31 2.79c-.88.48-6.58 3.64-10.57 1.37c-2.5-1.42-2.45-5.27-2.45-5.27s-7.83 2.98-5.15 11.29c-2.69.11-6.22 1.25-8.08 5.02c-2.22 4.5-1.43 8.26-.79 10.06c-2.32 1.96-5.23 6.15-3.23 11.57c1.5 4.09 7.51 5.97 7.51 5.97c-.42 7.35.95 11.88 1.67 13.72c.13.32.58.29.67-.04c.91-3.64 4.01-16.34 3.7-18.56c0 0 10.42-2.07 20.36-9.38c2.02-1.49 4.21-2.76 6.55-3.69c12.48-4.97 15.09 3.51 15.09 3.51s8.65-1.66 11.26 10.35c.98 4.5 1.65 11.71 2.2 16.75c.04.36.52.43.67.1c.88-2 2.62-5.97 3.04-10.02c.15-1.42 3.99-3.31 5.64-9.42c2.18-8.16-.54-16-2.16-18.45z" fill="#312d2d">

              </path>

              <radialGradient id="IconifyId17ecdb2904d178eab5683" cx="80.548" cy="79.47" r="32.723" gradientTransform="matrix(.3076 .9515 .706 -.2282 -.336 -9.978)" gradientUnits="userSpaceOnUse">

                <stop offset=".699" stop-color="#454140" stop-opacity="0">

                </stop>

                <stop offset="1" stop-color="#454140">

                </stop>

              </radialGradient>

              <path d="M97.26 59.96c.15-1.42 3.99-3.31 5.64-9.42c.18-.65.32-1.31.46-1.98c1.34-7.43-1.07-14.25-2.56-16.51c-2.07-3.14-6.52-7.25-10.74-8.09c-.37-.05-.72-.09-1.07-.11c0 0 .3 1.97-.5 3.55c-1.03 2.04-3.13 2.52-3.13 2.52c11 11 10.22 20.2 11.9 30.04z" fill="url(#IconifyId17ecdb2904d178eab5683)">

              </path>

              <radialGradient id="IconifyId17ecdb2904d178eab5684" cx="48.645" cy="115.151" r="8.58" gradientTransform="matrix(.8813 .4726 .5603 -1.045 -58.744 110.194)" gradientUnits="userSpaceOnUse">

                <stop offset=".58" stop-color="#454140">

                </stop>

                <stop offset="1" stop-color="#454140" stop-opacity="0">

                </stop>

              </radialGradient>

              <path d="M57.53 15.78c-1.01.49-1.89.97-2.66 1.39c-.88.48-6.58 3.64-10.57 1.37c-2.46-1.4-2.45-5.12-2.45-5.26c-1.13 1.44-4.55 11.74 5.44 12.42c4.31.3 6.96-3.46 8.54-6.64c.56-1.15 1.46-2.83 1.7-3.28z" fill="url(#IconifyId17ecdb2904d178eab5684)">

              </path>

              <radialGradient id="IconifyId17ecdb2904d178eab5685" cx="45.2" cy="107.323" r="7.875" gradientTransform="matrix(1 0 0 -1.2233 0 151.966)" gradientUnits="userSpaceOnUse">

                <stop offset=".702" stop-color="#454140" stop-opacity="0">

                </stop>

                <stop offset="1" stop-color="#454140">

                </stop>

              </radialGradient>

              <path d="M41.81 13.29c-.01.01-.03.01-.06.02h-.01c-.86.36-7.57 3.47-5.06 11.26l7.15 1.15c-6.32-6.41-2-12.44-2-12.44l-.02.01z" fill="url(#IconifyId17ecdb2904d178eab5685)">

              </path>

              <radialGradient id="IconifyId17ecdb2904d178eab5686" cx="44.117" cy="93.422" r="14.77" gradientTransform="matrix(-.9657 -.2598 -.2432 .9037 109.44 -38.386)" gradientUnits="userSpaceOnUse">

                <stop offset=".66" stop-color="#454140" stop-opacity="0">

                </stop>

                <stop offset="1" stop-color="#454140">

                </stop>

              </radialGradient>

              <path d="M41.11 25.28l-4.42-.71c-.17 0-.76.05-1.08.1c-2.49.35-5.42 1.63-7 4.92c-1.71 3.54-1.66 6.59-1.2 8.62c.13.68.41 1.45.41 1.45s2.19-2.07 7.39-2.21l5.9-12.17z" fill="url(#IconifyId17ecdb2904d178eab5686)">

              </path>

              <radialGradient id="IconifyId17ecdb2904d178eab5687" cx="40.613" cy="79.16" r="15.507" gradientTransform="matrix(.9907 .1363 .1915 -1.3921 -14.778 153.503)" gradientUnits="userSpaceOnUse">

                <stop offset=".598" stop-color="#454140" stop-opacity="0">

                </stop>

                <stop offset="1" stop-color="#454140">

                </stop>

              </radialGradient>

              <path d="M27.61 39.83c-2.18 1.93-5.11 6.24-2.95 11.58c1.63 4.03 7.43 5.78 7.43 5.78c0 .02 1.16.36 1.76.36l1.36-20.11c-2.78 0-5.45.83-7.18 2.04c.01.03-.43.32-.42.35z" fill="url(#IconifyId17ecdb2904d178eab5687)">

              </path>

            </g>

            <g>

              <radialGradient id="IconifyId17ecdb2904d178eab5688" cx="64.775" cy="120.5" r="26.001" gradientTransform="matrix(1 0 0 -1 0 128)" gradientUnits="userSpaceOnUse">

                <stop offset=".005" stop-color="#f2f2f2">

                </stop>

                <stop offset=".422" stop-color="#e5e5e5">

                </stop>

                <stop offset="1" stop-color="#ccc">

                </stop>

              </radialGradient>

              <path d="M64.01 22.61c21.75 0 40.51 12.81 49.16 31.29c0-.24.02-.49.02-.73C113.19 26.02 91.17 4 64.01 4c-27.46 0-49.6 22.38-49.18 49.18c0 .24.02.49.02.73c8.65-18.49 27.41-31.3 49.16-31.3z" fill="url(#IconifyId17ecdb2904d178eab5688)">

              </path>

            </g>

          </svg>
        }
      </div>

      {isOpen && (
        <div className="fixed bottom-20 right-10 w-96 border border-gray-700 rounded-lg shadow-lg bg-gray-900 text-white z-[999]">
          <div className="p-4 bg-gray-800 border-b border-gray-700 rounded-t-lg">
            <strong>Skylify 🚀 is an AI space scientist, that can respond with accurate data and information about space.</strong>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`my-2 flex ${msg.fromUser ? 'justify-start' : 'justify-end'}`}>
                <div className={`p-3 rounded-lg ${msg.fromUser ? 'bg-green-600' : 'bg-red-600'} max-w-xs break-words`}>
                  <strong>{msg.fromUser ? 'You: ' : 'Skylify: '}</strong>
                  <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                </div>
              </div>
            ))}
            {isWaiting && (
              <div className="my-2 flex justify-center">
                <div className="p-3 rounded-lg bg-gray-600 max-w-xs break-words">
                  <strong>Skylify: </strong>Waiting...
                </div>
              </div>
            )}
          </div>
          <form onSubmit={sendMessage} className="flex p-4 border-t border-gray-700 bg-gray-800 rounded-b-lg">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow mr-2 p-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
            />
            <button type="submit" className="p-2 rounded-lg bg-red-600 text-white">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;