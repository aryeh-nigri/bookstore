import React, { Component } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import $ from 'jquery';
// import './Posts.css';

export default class Posts extends Component {

    state = {
        posts: []
    }

    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);    // {message:"some message"}

        console.log(data);

        const newPost = {
            message: data.message,
            author: this.props.bookId.username,
            bookId: this.props.bookId
        };

        console.log(newPost);

        fetch('http://localhost:8080/posts/', {
            method: 'POST',
            body: newPost,
        }).then(post => {
            console.log(post);
            const posts = [...this.state.posts, post];
            this.setState({ posts });
        })
    }

    componentDidMount() {
        console.log(this.props.bookId);
        console.log(typeof (this.props.bookId));

        axios.get('http://localhost:8080/posts/' + this.props.bookId)
            .then(posts => {
                console.log(posts);
                this.setState({ posts });
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        return (
            <div>
                <div className="chat_window">
                    <div className="top_menu">
                        <div className="buttons">
                            <div className="button close"></div>
                            <div className="button minimize"></div>
                            <div className="button maximize"></div>
                        </div>
                        <div className="title">Chat</div>
                    </div>
                    <ul id="messages" className="messages">

                    </ul>

                    <div className="bottom_wrapper clearfix">
                        <i id="typing"></i>
                        <form id="form" onSubmit={this.handleSubmit}>
                            <div className="message_input_wrapper">
                                <label htmlFor="message">Enter message</label>
                                <input id="message" name="message" className="message_input" placeholder="Type your message here..." />
                            </div>
                            <button className="send_message">
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

// const socket = io('http://localhost:8080');
// var messages = $("#messages");

// socket.emit('newPost', { message: 'teste', author: 'fulano', bookId: '123' });

// socket.on('postReceived', data => {
//     console.log(data)
// });

// (function () {
//     $("form").submit(function (e) {
//         e.preventDefault(); // prevents page reloading
//         let li = document.createElement("li");
//         socket.emit("chat message", $("#message").val());

//         messages.appendChild(li).append($("#message").val());
//         let span = document.createElement("span");
//         messages.appendChild(span).append("by " + "Anonymous" + ": " + "just now");

//         $("#message").val("");

//         return false;
//     });

//     socket.on("received", data => {
//         let li = document.createElement("li");
//         let span = document.createElement("span");
//         var messages = document.getElementById("messages");
//         messages.appendChild(li).append(data.message);
//         messages.appendChild(span).append("by " + "anonymous" + ": " + "just now");
//         console.log("Hello bingo!");
//     });
// })();

// // fetching initial chat messages from the database
// (function () {
//     fetch("/posts")
//         .then(data => {
//             console.log(data);
//             return data.json();
//         })
//         .then(json => {
//             json.map(data => {
//                 let li = document.createElement("li");
//                 let span = document.createElement("span");
//                 messages.appendChild(li).append(data.message);
//                 messages
//                     .appendChild(span)
//                     .append("by " + data.sender + ": " + data);//formatTimeAgo(data.createdAt));
//             });
//         });
// })();

// //is typing...

// let messageInput = $("#message");
// let typing = $("#typing");

// //isTyping event
// messageInput.addEventListener("keypress", () => {
//     socket.emit("typing", { user: "Someone", message: "is typing..." });
// });

// socket.on("notifyTyping", data => {
//     typing.innerText = data.user + " " + data.message;
//     console.log(data.user + data.message);
// });

// //stop typing
// messageInput.addEventListener("keyup", () => {
//     socket.emit("stopTyping", "");
// });

// socket.on("notifyStopTyping", () => {
//     typing.innerText = "";
// });