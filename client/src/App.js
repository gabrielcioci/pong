import React from 'react';
import {Route, BrowserRouter as Router} from "react-router-dom"
import {Provider} from 'react-redux';
import store from './store/store'
import './assets/App.scss';
import Welcome from "./components/Welcome";
import PongRoom from "./components/PongRoom";
import io from 'socket.io-client'

function App() {
    const socket = io(process.env.REACT_APP_SOCKET_URL)
    return (
        <Provider store={store}>
            <Router>
                <div className="App">
                    <section>
                        <Route path="/" exact component={(props)=> <Welcome {...props} socket={socket}/>}/>
                        <Route path="/game" exact component={(props)=> <PongRoom {...props} socket={socket}/>}/>
                    </section>
                </div>
            </Router>
        </Provider>
    );
}

export default App;
