import React, { Component } from 'react'

export class Book extends Component {
    render() {
        return (
            <div>
                {this.props.name}
            </div>
        )
    }
}

export default Book;
