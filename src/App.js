import React , { useState,useEffect } from 'react';
import './App.css';
import Preview from './components/Preview';
import Massage from './components/massage';
import NotesContainer from './components/Notes/NotesContainer';
import NotesList from './components/Notes/NotesList';
import Note from './components/Notes/Note';
import NoteForm from './components/Notes/NoteForm';
import Alert from './components/Alert';

function App() {

  const [notes, setNotes] = useState ([]);
  const [title, setTitle] = useState ('');
  const [content, setContent] = useState ('');
  const [selectedNote, setSelectedNote] = useState (null);
  const [creating, setCreating] = useState (false);
  const [editing, setEditing] = useState (false);
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(()=> {
    if (localStorage.getItem('notes')) {
      setNotes(JSON.parse(localStorage.getItem('notes')));}  
      else {
      localStorage.setItem('notes',JSON.stringify([]));}
  },[]);

  useEffect(() => {
    if (validationErrors.length !==0) {
      setTimeout(() => {
        setValidationErrors([]);
      },3000)
    }
  }, [validationErrors]);

  // save to the local storage
  const saveToLocalStorage = (key,value) => {
    localStorage.setItem(key,JSON.stringify(value));
  };

  // verify the data
  const validate = () => {
    const validationErrors = [];
    let passed = true;
    if (!title) {
      validationErrors.push('.voeg maar de titel toe, alstublieft')
      passed = false;
    }

    if (!content) {
      validationErrors.push('.voeg maar de inhoud toe, alstublieft');
      passed = false;
    }

    setValidationErrors(validationErrors);
    return passed;
  }

  //change the title handler
  const changeTitleHandler = (event) => {
    setTitle(event.target.value)
  }
  

  // change the note content
  const changeCnotentHandler = (event) => {
    setContent(event.target.value)
  }

  // save the note handler
  const saveNoteHandler = () => {
    if (!validate()) return;
    const note = {
      id: new Date(),
      title: title,
      content: content
    }

    const uptededNotes = [...notes,note];

    setNotes (uptededNotes);
    saveToLocalStorage ('notes',uptededNotes)
    setCreating (false);
    setSelectedNote (note.id);
    setTitle ('');
    setContent ('');
  }

  //clicking a note
  const selectNoteHandler = (noteId) => {
    setSelectedNote(noteId);
    setCreating(false);
    setEditing(false);
  }

  // moving to edit a note
  const editingNoteHandler = () => {
     const note=notes.find(note=>note.id===selectedNote)
     setEditing(true);
     setTitle(note.title);
     setContent(note.content);
  }
  
  //editing the note
  const updateNoteHandler = () => {
    if (!validate()) return;
    const updatedNotes = [...notes];    
    const noteIndex = notes.findIndex(note => note.id === selectedNote);
    updatedNotes[noteIndex] = {
      id: selectedNote,
      title: title,
      content: content
    };
    
    setNotes(updatedNotes);
    saveToLocalStorage ('notes',updatedNotes)
    setEditing(false);
    setTitle('');
    setContent('');
  } 

  // moving to the interface of adding a note
  const addNoteHandler = () =>{
    setCreating(true);
    setEditing(false);
    setTitle('');
    setContent('');
 }

// deleting a selected note
  const deleteNoteHandler = () => {
    const updatedNotes = [...notes];
    const noteIndex= updatedNotes.findIndex(note=>note.id===selectedNote);
    updatedNotes.splice(noteIndex, 1);
    setNotes(updatedNotes);
    saveToLocalStorage ('notes',updatedNotes)
    setSelectedNote(null)
 }
  const getAddNote = () => {

    return (
      <NoteForm
         formTitle='een nieuwe notitie'
         title={title}
         content={content}
         titleChanged={changeTitleHandler}
         contentChanged={changeCnotentHandler}
         submitText='opslaan'
         submitClicked={saveNoteHandler}/>
    );
  };

  const getPreview = () => {

    if (notes.length ===0 ) {
      return <Massage title='Er is geen notities'/>
 }
 
    if (!selectedNote) {
      return <Massage title='kies maar een notitie, alstublieft'/>
 }
    const note = notes.find( note => note.id === selectedNote );
    
    let noteDisplay = (
      <div>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
      </div>
    )
    if (editing) {
      noteDisplay = (
        <NoteForm
         formTitle='bijwerking een notitie'
         title={title}
         content={content}
         titleChanged={changeTitleHandler}
         contentChanged={changeCnotentHandler}
         submitText='bijweking'
         submitClicked={updateNoteHandler}
        />
      )
    }

    return (
      <div>
        {!editing && 
        <div className="note-operations">
          <a href="#" onClick={editingNoteHandler} >
            <i className="fa fa-pencil-alt" />
          </a>
          <a href="#" onClick={deleteNoteHandler} >
            <i className="fa fa-trash" />  
          </a>
        </div>
         }

        {noteDisplay}
      </div>
    );
  };

  
  return (
    <div className="App">
      <NotesContainer >
        <NotesList >
         {notes.map(note => <Note 
         key={note.id}
         title={note.title} 
         noteClicked={()=>selectNoteHandler(note.id)}
         active = {selectedNote === note.id}/>)
         }
        </NotesList>
        <button className="add-btn" onClick={addNoteHandler}>+</button>
      </NotesContainer>
      <Preview>
         {creating ? getAddNote() : getPreview()} 
      </Preview> 
      {validationErrors.length !== 0 && <Alert validationMessages = {validationErrors} />}
    </div>
  );
}

export default App;
