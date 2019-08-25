import React, { useState } from "react";
import moment from 'moment';
// moment is a library for parsing, validating, manipulating, and formatting dates

import { Rating } from '@material-ui/lab';

export default function Comment(props) {
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);

    // const { name, message, createdAt } = props.comment;
    const { _id, name, message, createdAt, rating, likes, dislikes } = props.comment;
    const { likePost, dislikePost } = props;

    return (
        <div className="media mb-3">
{/* <img
    className="mr-3 bg-light rounded"
    width="48"
    height="48"
    src={imgUrl}
    alt={name}
/> */}

<div className="media-body p-2 shadow-sm rounded bg-light border">
    <small className="float-right text-muted">{moment(createdAt).fromNow()}</small>
    <h6 className="mt-0 mb-1 text-muted"><strong>{name}</strong></h6>
    <Rating value={rating} readOnly />
    {message}
    <a href="#" onClick={e =>
    {
        e.preventDefault(); 
        const didDisliked = dislikePost(_id, liked, disliked);
        // console.log(didLiked);
        // console.log(didDisliked);
        setDisliked(didDisliked);
        setLiked(false);
     }}
        >
            <small className="float-right text-muted"><i className="far fa-thumbs-down">
    <span className="badge badge-primary">{dislikes}</span>
    </i></small></a>
    <small className="float-right text-muted">&nbsp;&nbsp;&nbsp;</small>
    <a href="#" onClick={e =>
        {
            e.preventDefault(); 
            const didLiked = likePost(_id, liked, disliked);
        // console.log(didLiked);
        // console.log(didDisliked);
            setLiked(didLiked);
            setDisliked(false);
         }}
            >
                <small className="float-right text-muted"><i className="far fa-thumbs-up">
    <span className="badge badge-primary">{likes}</span>
    </i></small></a>
</div>
</div>
    );
}