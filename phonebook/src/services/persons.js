import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'
const getAll = ()=> {
	return axios.get(baseUrl).then(response => response.data)
}
const create = (newPerson)=> {
	return axios.post(baseUrl,newPerson)
	.then(response => response.data)
}
const deletePerson = (person)=>{
	return axios.delete(`${baseUrl}/${person.id}`)
   .then((response) => response.data)
}

const update = (person,newPerson) => {
	return axios.put(`${baseUrl}/${person.id}`,newPerson)
	.then(response => response.data)
}

export default { 
  getAll: getAll,
  create: create,
  deletePerson:deletePerson,
  update:update
}