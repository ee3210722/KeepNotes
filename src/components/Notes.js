import React from 'react';
import { useContext, useEffect, useRef, useState} from 'react';
import NoteItem from './NoteItem';
import AddNote from './AddNote';
import noteContext from "../context/notes/noteContext";
import { useNavigate } from 'react-router-dom';

export default function Notes(props) {
    
    const context = useContext(noteContext);
    const { notes, getNotes, editNote } = context;

    const navigate = useNavigate();
    
    useEffect(() => {
        !localStorage.getItem('token') ? navigate('/login') : getNotes();
    })

    const updateNote = (currentNote) => {
        ref.current.click();
        setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag });
    }

    const ref = useRef(null);
    const refClose = useRef(null);

    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" })
    
    const handleClick = (e) => {
        editNote(note.id, note.etitle, note.edescription, note.etag);
        refClose.current.click();
        props.showAlert("Updated Successfully", "success")
    }
    
    const handleChange = (e) => {
        setNote({...note, [e.target.name]: e.target.value})
    }

    return (
        <>
        <AddNote showAlert={props.showAlert} />
        {/* This button is used to trigger the modal to open.*/}
        {/* However, it has the class d-none applied, which means it is initially hidden. */}
        <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
        </button>
        {/* Later in the updateNote function, the ref.current.click() is called. This programmatically simulates a click on the button, essentially triggering the modal to open even though the button is hidden. It's a way to open the modal without directly interacting with the button. */}
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        
                        {/* Here, I added a form which we are using in addNotes component */}
                        <div className="container my-3">
                        <form className="my-3">
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title</label>
                            <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} aria-describedby="emailHelp" onChange={handleChange}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={handleChange}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="tag" className="form-label">Tag</label>
                            <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={handleChange}/>
                        </div>
                        </form>
                        </div>
                        {/* Upto to here */}
                            
                    </div>
                    <div className="modal-footer">
                        <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button disabled={note.etitle.length<5 || note.edescription.length<5} onClick={handleClick} type="button" className="btn btn-primary">Update Note</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="row my-3">
            <h2>Your Notes</h2>
            <div className="container mx-2">
                {notes.length===0 && 'No Notes to Display'}    
            </div>    
            {notes.map((note, index) => {
                return <NoteItem key={index} updateNote={updateNote} showAlert={props.showAlert } note={note} />
            })}
        </div>
        
        </>    
    )
}
