import React, { Component } from 'react'
import BookStore from '../BookStore';

export class Home extends Component {
    render() {
        return (
            <div>
                <BookStore />
            </div>
        )
    }
}

export default Home;
