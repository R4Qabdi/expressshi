import prisma from '../database/config.database.js'

export const getUsers = async (req, res) => {
  const users = await prisma.users.findMany()
  sendResponse(res, 200, true, "Users retrieved successfully", users);
}

export const getUserById = async (req, res) => {
  // Mendapatkan ID user yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mengambil user dengan ID yang sesuai dari database menggunakan Prisma Client
  const user = await prisma.users.findUnique({
    where: {
      id: id
    }
  })

  // Jika user tidak ditemukan, kirimkan pesan error
  if (!user) {
    // res.send(`User with ID: ${id} not found`)
    return sendResponse(res, 404, false, `User with ID: ${id} not found`);

  }

  // res.send(user)
  sendResponse(res, 200, true, "User retrieved successfully", user);
}

export const getUserByIdWithProfile = async (req, res) => {
  // Mendapatkan ID pengguna yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mengambil pengguna dengan ID yang sesuai dari database menggunakan Prisma Client
  const user = await prisma.users.findUnique({
    where: {
      id: id,
    },
    include: {
      profiles: true,
    },
  })

  // Jika pengguna tidak ditemukan, kirimkan pesan error
  if (!user) {
    return sendResponse(res, 404, false, `User with ID: ${id} not found`);
  }

sendResponse(res, 200, true, "User retrieved successfully", user);
}

export const createUser = async (req, res) => {

  // Mendapatkan data user baru dari request body
  const { userId, address, phone } = req.body

  // Menambahkan user baru ke database menggunakan Prisma Client
  const user = await prisma.users.create({
    data: {
      name,
      email,
      password,
      role
    }
  })

  // res.send('User created successfully')
  sendResponse(res, 201, true, "User created successfully", user);
}

export const updateUser = async (req, res) => {

  // Mendapatkan ID user yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mendapatkan data user yang akan diupdate dari request body
  const { name, email, password, role } = req.body

  // Mencari user dengan ID yang sesuai di database menggunakan Prisma Client
  const user = await prisma.users.findUnique({
    where: {
      id: id
    }
  })

  // Jika user tidak ditemukan, kirimkan pesan error
  if (!user) {
    // res.send(`User with ID: ${id} not found`)
    return sendResponse(res, 404, false, `User with ID: ${id} not found`);
  }

  // Mengupdate user dengan ID yang sesuai di database menggunakan Prisma Client
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
  })

  // res.send(`user with ID: ${id} updated successfully`)
  sendResponse(res, 200, true, "User updated successfully", null);
}

export const deleteUser = async (req, res) => {

  // Mendapatkan ID user yang akan dihapus dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mencari user dengan ID yang sesuai di database menggunakan Prisma Client
  const user = await prisma.users.findUnique({
    where: {
      id: id
    }
  })

  // Jika user tidak ditemukan, kirimkan pesan error
  if (!user) {
    // res.send(`User with ID: ${id} not found`)
    return sendResponse(res, 404, false, `User with ID: ${id} not found`);
  }

  // Menghapus user dengan ID yang sesuai di database menggunakan Prisma Client
  await prisma.users.delete({
    where: {
      id: id
    }
  })

  // res.send(`User with ID: ${id} deleted successfully`)
  sendResponse(res, 200, true, "User deleted successfully", null);
}

const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};
// // GET ALL USERS
// router.get('/', async (req, res) => {
//   // Mengambil semua user dari database menggunakan Prisma Client
//   const users = await prisma.users.findMany();
//   res.send(users);
// });

// // GET SINGLE USER
// router.get('/:id', async (req, res) => {
//   const id = parseInt(req.params.id);

//   // Mengambil user dengan ID yang sesuai
//   const user = await prisma.users.findUnique({
//     where: {
//       id: id
//     }
//   });

//   if (!user) {
//     // return res.send(`User with ID: ${id} not found`);
//     return sendResponse(res, 404, false, `User with ID: ${id} not found`);
//   }

//   // res.send(user);
//   sendResponse(res, 200, true, "User retrieved successfully", user);
// });

// // POST NEW USER
// router.post('/', async (req, res) => {
//   const { name, email, password, role } = req.body;

//   // Menambahkan user baru ke database
//   await prisma.users.create({
//     data: {
//       name,
//       email,
//       password,
//       role
//     }
//   });

//   // res.send('User created successfully');
//   sendResponse(res, 200, true, "User created successfully", null);
// });

// // PUT (UPDATE) USER
// router.put('/:id', async (req, res) => {
//   const id = parseInt(req.params.id);
//   const { name, email, password, role } = req.body;

//   const user = await prisma.users.findUnique({
//     where: {
//       id: id
//     }
//   });

//   if (!user) {
//     // return res.send(`User with ID: ${id} not found`);
//     return sendResponse(res, 404, false, `User with ID: ${id} not found`);

//   }

//   await prisma.users.update({
//     where: {
//       id: id
//     },
//     data: {
//       name,
//       email,
//       password,
//       role
//     }
//   });

//   // res.send(`User with ID: ${id} updated successfully`);
//   sendResponse(res, 200, true, "User updated successfully", null);

// });

// // DELETE USER
// router.delete('/:id', async (req, res) => {
//   const id = parseInt(req.params.id);

//   const user = await prisma.users.findUnique({
//     where: {
//       id: id
//     }
//   });

//   if (!user) {
//     // return res.send(`User with ID: ${id} not found`);
//     return sendResponse(res, 404, false, `User with ID: ${id} not found`);

//   }

//   await prisma.users.delete({
//     where: {
//       id: id
//     }
//   });
// });

// const sendResponse = (res, statusCode, success, message, data = null) => {
//   return res.status(statusCode).json({
//     success,
//     message,
//     data
//   });
// };