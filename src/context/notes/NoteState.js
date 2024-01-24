import NoteContext from "./noteContext";
import {useState} from 'react';

const NoteState = (props) => {
  
  const host = "http://localhost:5000"

  const [notes, setNotes] = useState([])

  // Get all Notes
  const getNotes = async () => {

    const response = await fetch(`${host}/api/notes/fetchallNotes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      }
    });
    const json = await response.json();

    setNotes(json);
  }

  // Add a Note:
  const addNote = async (title, description, tag) => {

    const response = await fetch(`${host}/api/notes/addNote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });
    const note = await response.json();
    setNotes(notes.concat(note));
    
  }

  // Delete a Note:
  const deleteNote = async (id) => {
    
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      }
    });
    
    const newNotes = notes.filter((note) => { return note._id !== id });
    setNotes(newNotes);
  }

  // Edit a Note:
  const editNote = async (id, title, description, tag) => {

    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({title, description, tag})
    });
    // Logic to edit in client.
    let newNotes = JSON.parse(JSON.stringify(notes));
    for (let i=0;i<newNotes.length;i++){
      if (newNotes[i]._id === id) {
        newNotes[i].title = title;
        newNotes[i].description = description;
        newNotes[i].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  }
  
  return (
      <NoteContext.Provider value={{notes, addNote, deleteNote, editNote, getNotes}}>
          {props.children}
      </NoteContext.Provider>
  )

}

export default NoteState;

