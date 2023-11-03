import React from "react";

const NotesList = (props) => (
    <div className="Note-list">
        {props.children}
    </div>
)

export default NotesList;