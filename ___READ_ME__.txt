RUN EXPRESS SERVER: npm start
RUN DB SERVER: npm run json:server



-------------------------------
url: http://localhost:4000/graphql
//addUser in dbJson
mutation {
  addUser(firstName: "shahbaz", age: 32) {
    id
    firstName
    age
    
  }
}

//editUser in dbJson
mutation{
  editUser(id: "iYnqlci", firstName: "mehul", age: 14){
    id,
    firstName,
    age
  }
}

//deleteUser in dbJson
mutation {
  deleteUser(id:"Ds3f94B"){
    id
  }
}

-------------------------------
url: http://localhost:4000/graphql
copy: 
{
  user(id: "13") {
    id
    firstName
    age
    company{
      id
      name
      description
    }
  }
}
-------------------------------
url: http://localhost:4000/graphql
copy: 
{
  company(id: "1") {
    name
    id
    description
  }
}

-------------------------------
url: http://localhost:4000/graphql
copy: 
{
  company(id: "2") {
    id
    name
    description
    users {
      id
      firstName
      age
    }
  }
}

copy:
{
  company(id: "2") {
    id
    name
    description
    users {
      id
      firstName
      age
      company{
        description
      }
    }
  }
}

copy:
{
  apple: company(id: "1") {
    ...companiesDetails
  }
  google: company(id: "2") {
     ...companiesDetails
   
  }
}

## QUERY FRAGMENTS: avoid duplicates keys ##
fragment companiesDetails on Company {
  id
  name
  description
}



-------------------------------
url: http://localhost:5000/companies/1