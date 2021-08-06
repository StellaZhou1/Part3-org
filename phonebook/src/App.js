import React, { useState,useEffect} from 'react'
import personService from './services/persons'
import axios from 'axios'

const Notification = ({message,success}) => {
  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
    const successStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message===null)
  {
    return null
  }
  if (success)
    return (<div style={successStyle}>
    {message}</div>)
  else
    return (<div style={errorStyle}>
      {message}
      </div>)
}

const Filter = ({newFilter,setNewFilter}) => {
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }
  return <input value={newFilter} onChange={handleFilterChange}></input>
}

const PersonForm = ({persons,newPerson,newName,newNumber,setPersons,setNewName,setNewNumber,setMessage,setSuccess}) => {
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personToChange=persons.find((person)=>person.name===newName)
    const newPerson = {
      name: newName,
      number:newNumber
    }
    if (personToChange)
    {
      const confirmation=window.confirm(newName+ ' is already added to phonebook, replace the old number with a new one?')
      if(confirmation)
        personService.update(personToChange,newPerson)
        .then(changedPerson=>{setPersons(persons.map(p => changedPerson.id !== p.id ? p : changedPerson))
        setNewName('')
        setNewNumber('')
        setMessage('Changed '+changedPerson.name)
        setSuccess(true)
        setTimeout(() => {setMessage(null)}, 5000)
        })
        .catch(error => {
          setSuccess(false)
          setMessage(`The record of ${personToChange.name} was already removed from the server`)
          setTimeout(() => {setMessage(null)}, 5000)
        })
    }
    else
    {
      personService.create(newPerson).then(returnedPerson =>{
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
      setMessage('Added '+returnedPerson.name)
      setSuccess(true)
      setTimeout(() => {setMessage(null)}, 5000)
      })
      .catch(error => {
      setSuccess(false)
      setMessage(`Information of ${newPerson.name} has already been removed from the server`)
      setTimeout(() => {setMessage(null)}, 5000)
      })

    }

    
  }
  return (<form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>)
}
const deletePerson = (person,persons,setPersons)=> {
  let confirmation=window.confirm(`Delete ${person.name}?`)
  if (confirmation)
  {
    personService.deletePerson(person)
    .then(deletedPerson=>{
    setPersons(persons.filter(p => {return p.id!==person.id}))
  })
  }
  else
  {
    console.log("cancel")
  }


}
const Persons = ({persons,newFilter,setPersons}) => {
  const personsToShow = persons.filter(person=>{
    return person.name.toLowerCase().indexOf(newFilter.toLowerCase())>= 0})
  return <div>
  {personsToShow.map(person => <div key={person.name}>name: {person.name} number: {person.number} 
  <button type="button" onClick={()=>deletePerson(person,persons,setPersons)}>delete</button>
  </div>)}
  </div>
}

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [ message,setMessage ] = useState('')
  const [ success,setSuccess ] = useState(true)
  //hook must be a function
  useEffect(()=>{
    personService
    .getAll()
    .then(initialPersons=>setPersons(initialPersons))}
  ,[])
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} success={success}/>
      <div>
        filter shown with
        <Filter newFilter={newFilter} setNewFilter={setNewFilter}/>
      </div>
      <h2>add a new</h2>
      <PersonForm persons={persons} newName={newName} newNumber={newNumber} setPersons={setPersons} setNewName={setNewName}
       setNewNumber={setNewNumber} setMessage={setMessage} setSuccess={setSuccess}/>
      <h2>Numbers</h2>
      <Persons persons={persons} newFilter={newFilter} setPersons={setPersons}/>
    </div>
  )
}

export default App