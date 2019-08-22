import React from "react";
import Comment from "./Comment";

export default function CommentList(props) {
    return (
        <div className="commentList">
            <h5 className="text-muted mb-4">
                <span className="badge badge-success">{props.comments.length}</span>{" "}
                Comment{props.comments.length > 0 ? "s" : ""}
            </h5>

            {props.comments.length === 0 && !props.loading ? (
                <div className="alert text-center alert-info">
                    Be the first to comment!
                </div>
            ) : null}

            {/* Sort posts by creation date and then render them */}
            {props.comments.sort((y, x) => { return new Date(x.createdAt) - new Date(y.createdAt) })
                .map((comment, index) => (
                    <Comment key={index} comment={comment} />
                ))}
        </div>
    );
}