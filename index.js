import express from 'express';
// const express = require('express');
const app = express();
const port = 3000;
import prisma from './database.js' // Import Prisma Client dari file database.js

app.get('/', (req, res) => {
  res.send('helo');
});

// GET
// app.get('/books', (req, res) => {
//   res.send(`List of books will be here : ${books}`)
// })
app.get('/books', async (req, res) => {
  // Mengambil semua buku dari database menggunakan Prisma Client
  const books = await prisma.books.findMany()
  
  // res.send(books)
  sendResponse(res, 200, true, "Books retrieved successfully", books);

})

// GET
// app.get('/books/:id', (req, res) => {
//   const id = req.params.id

//   res.send(`Book details for ID: ${id}`)
// })
app.get('/books/:id', async (req, res) => {
  // Mendapatkan ID buku yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mengambil buku dengan ID yang sesuai dari database menggunakan Prisma Client
  const book = await prisma.books.findUnique({
    where: {
      id: id
    }
  })

  // Jika buku tidak ditemukan, kirimkan pesan error
  if (!book) {
    // res.send(`Book with ID: ${id} not found`)
    return sendResponse(res, 404, false, `Book with ID: ${id} not found`);

  }

  // res.send(book)
  sendResponse(res, 200, true, "Book retrieved successfully", book);

})

// POST
// app.post('/books', (req, res) => {
//   res.send('Book created successfully')
// })
app.post('/books', async (req, res) => {
  // Mendapatkan data buku baru dari request body
  const { title, author, year } = req.body

  // Menambahkan buku baru ke database menggunakan Prisma Client
  const book = await prisma.books.create({
    data: {
      title,
      author,
      year
    }
  })

  // res.send('Book created successfully')
  sendResponse(res, 201, true, "Book created successfully", book);
});

// PUT
// app.put('/books/:id', (req, res) => {
//   const id = req.params.id
  
//   res.send(`Book with ID: ${id} updated successfully`)
// })
app.put('/books/:id', async (req, res) => {
  // Mendapatkan ID buku yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mendapatkan data buku yang akan diupdate dari request body
  const { title, author, year } = req.body

  // Mencari buku dengan ID yang sesuai di database menggunakan Prisma Client
  const book = await prisma.books.findUnique({
    where: {
      id: id
    }
  })

  // Jika buku tidak ditemukan, kirimkan pesan error
  if (!book) {
    // res.send(`Book with ID: ${id} not found`)
    return sendResponse(res, 404, false, `Book with ID: ${id} not found`);
  }

  // Mengupdate buku dengan ID yang sesuai di database menggunakan Prisma Client
  await prisma.books.update({
    where: {
      id: id
    },
    data: {
      title,
      author,
      year
    }
  })

  // res.send(`Book with ID: ${id} updated successfully`)
  sendResponse(res, 200, true, "Book updated successfully", null);
}); 

// DELETE
// app.delete('/books/:id', (req, res) => {
//   const id = req.params.id
  
//   res.send(`Book with ID: ${id} deleted successfully`)
// })
app.delete('/books/:id', async (req, res) => {
  // Mendapatkan ID buku yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mencari buku dengan ID yang sesuai di database menggunakan Prisma Client
  const book = await prisma.books.findUnique({
    where: {
      id: id
    }
  })

  // Jika buku tidak ditemukan, kirimkan pesan error
  if (!book) {
    // res.send(`Book with ID: ${id} not found`)
    return sendResponse(res, 404, false, `Book with ID: ${id} not found`);
  }

  // Menghapus buku dengan ID yang sesuai di database menggunakan Prisma Client
  await prisma.books.delete({
    where: {
      id: id
    }
  })

  // res.send(`Book with ID: ${id} deleted successfully`)
  sendResponse(res, 200, true, "Book deleted successfully", null);
});

//apalah ini akuga ngerti sama sekali nok
// app.get('/users', (req, res) => {
//   res.send('List of users will be here')
// })
// app.get('/users/:id', (req, res) => {
//   const id = req.params.id

//   res.send(`User details for ID: ${id}`)
// })
// app.post('/users', (req, res) => {
//   res.send('User created successfully')
// })
// app.put('/users/:id', (req, res) => {
//   const id = req.params.id
  
//   res.send(`User with ID: ${id} updated successfully`)
// })
// app.delete('/users/:id', (req, res) => {
//   const id = req.params.id
  
//   res.send(`User with ID: ${id} deleted successfully`)
// })

// GET ALL USERS
app.get('/users', async (req, res) => {
  // Mengambil semua user dari database menggunakan Prisma Client
  const users = await prisma.users.findMany();
  res.send(users);
});

// GET SINGLE USER
app.get('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  // Mengambil user dengan ID yang sesuai
  const user = await prisma.users.findUnique({
    where: {
      id: id
    }
  });

  if (!user) {
    // return res.send(`User with ID: ${id} not found`);
    return sendResponse(res, 404, false, `User with ID: ${id} not found`);
  }

  // res.send(user);
  sendResponse(res, 200, true, "User retrieved successfully", user);
});

// POST NEW USER
app.post('/users', async (req, res) => {
  const { name, email, password, role } = req.body;

  // Menambahkan user baru ke database
  await prisma.users.create({
    data: {
      name,
      email,
      password,
      role
    }
  });

  // res.send('User created successfully');
  sendResponse(res, 200, true, "User created successfully", null);
});

// PUT (UPDATE) USER
app.put('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, password, role } = req.body;

  const user = await prisma.users.findUnique({
    where: {
      id: id
    }
  });

  if (!user) {
    // return res.send(`User with ID: ${id} not found`);
    return sendResponse(res, 404, false, `User with ID: ${id} not found`);

  }

  await prisma.users.update({
    where: {
      id: id
    },
    data: {
      name,
      email,
      password,
      role
    }
  });

  // res.send(`User with ID: ${id} updated successfully`);
  sendResponse(res, 200, true, "User updated successfully", null);

});

// DELETE USER
app.delete('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  const user = await prisma.users.findUnique({
    where: {
      id: id
    }
  });

  if (!user) {
    // return res.send(`User with ID: ${id} not found`);
    return sendResponse(res, 404, false, `User with ID: ${id} not found`);

  }

  await prisma.users.delete({
    where: {
      id: id
    }
  });

  // res.send(`User with ID: ${id} deleted successfully`);
  sendResponse(res, 200, true, "User deleted successfully", null);

});


const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});