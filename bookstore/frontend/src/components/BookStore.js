import React, { Component } from 'react'
import Book from './Book';

export class BookStore extends Component {
    render() {
        return (
            <div>
                <Book name="AAA" />
                <Book name="BBB" />
                <Book name="CCC" />
            </div>
        )
    }
}

export default BookStore
