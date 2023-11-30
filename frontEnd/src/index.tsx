import ReactDOM from 'react-dom/client';

import 'src/styles';
import App from './App';

import { AuthContextProvider } from 'src/context/AuthContext';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <AuthContextProvider>
        <App />
    </AuthContextProvider>
);


// import React from 'react';
// import ReactDOM from 'react-dom/client';

// import App from 'App';
// import 'css/index.css';
// import 'css/NavHeadBottom.css';

// import { SocketContextProvider } from 'context/SocketContext';
// import { PostListContextProvider } from 'context/PostListContext';
// import { ReelContextProvider } from 'context/ReelContext';
// import { PostImgContextProvider } from 'context/PostImgContext';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <AuthContextProvider>
//         <SocketContextProvider>
//             <PostListContextProvider>
//                 <ReelContextProvider>
//                     <PostImgContextProvider>
//                         <App />
//                     </PostImgContextProvider>
//                 </ReelContextProvider>
//             </PostListContextProvider>
//         </SocketContextProvider>
//     </AuthContextProvider>
// );