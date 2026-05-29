import prisma from '../database/config.database.js'
import logger from '../configs/logger.config.js'

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany()
    sendResponse(res, 200, true, "Users retrieved successfully", users);
  } catch (error) {
    logger.error('Error fetching users:', error)
    sendResponse(res, 500, false, 'Failed to retrieve users')
  }
}

export const getUserById = async (req, res) => {
  try {
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
  } catch (error) {
    logger.error('Error fetching user:', error)
    sendResponse(res, 500, false, 'Failed to retrieve user')
  }
}

export const getUserByIdWithProfile = async (req, res) => {
  try {
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
  } catch (error) {
    logger.error('Error fetching user with profile:', error)
    sendResponse(res, 500, false, 'Failed to retrieve user')
  }
}

export const createUser = async (req, res) => {
  try {
    // Mendapatkan data user baru dari request body
    const { name, email, password, role } = req.body

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
  } catch (error) {
    logger.error('Error creating user:', error)
    sendResponse(res, 500, false, 'Failed to create user')
  }
}

export const updateUser = async (req, res) => {
  try {
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
  } catch (error) {
    logger.error('Error updating user:', error)
    sendResponse(res, 500, false, 'Failed to update user')
  }
}

export const deleteUser = async (req, res) => {
  try {
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
  } catch (error) {
    logger.error('Error deleting user:', error)
    sendResponse(res, 500, false, 'Failed to delete user')
  }
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