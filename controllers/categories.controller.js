// categories.controller.js

// import prisma from '../database/config.database.js'

export const getCategories = async (req, res) => {
  const Categories = await prisma.categories.findMany()
  sendResponse(res, 200, true, "Categories retrieved successfully", Categories);
}

export const getCategoryById = async (req, res) => {
  // Mendapatkan ID kategori yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mengambil kategori dengan ID yang sesuai dari database menggunakan Prisma Client
  const category = await prisma.categories.findUnique({
    where: {
      id: id
    }
  })

  // Jika kategori tidak ditemukan, kirimkan pesan error
  if (!category) {
    // res.send(`Category with ID: ${id} not found`)
    return sendResponse(res, 404, false, `Category with ID: ${id} not found`);

  }

  // res.send(category)
  sendResponse(res, 200, true, "Category retrieved successfully", category);

  // TODO: CODE GET CATEGORY BY ID
}

export const createCategory = async (req, res) => {

  // Mendapatkan data kategori baru dari request body
  const { name } = req.body

  // Menambahkan kategori baru ke database menggunakan Prisma Client
  const category = await prisma.categories.create({
    data: {
      name
    }
  })

  // res.send('Category created successfully')
  sendResponse(res, 201, true, "Category created successfully", category);
  
}

export const updateCategory = async (req, res) => {

  // Mendapatkan ID kategori yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mendapatkan data kategori yang akan diupdate dari request body
  const { name } = req.body

  // Mencari kategori dengan ID yang sesuai di database menggunakan Prisma Client
  const category = await prisma.categories.findUnique({
    where: {
      id: id
    }
  })

  // Jika kategori tidak ditemukan, kirimkan pesan error
  if (!category) {
    // res.send(`Category with ID: ${id} not found`)
    return sendResponse(res, 404, false, `Category with ID: ${id} not found`);
  }

  // Mengupdate kategori dengan ID yang sesuai di database menggunakan Prisma Client
  await prisma.categories.update({
    where: {
      id: id
    },
    data: {
      name
    }
  })

  // res.send(`Category with ID: ${id} updated successfully`)
  sendResponse(res, 200, true, "Category updated successfully", null);
  
}

export const deleteCategory = async (req, res) => {

  // Mendapatkan ID kategori yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mencari kategori dengan ID yang sesuai di database menggunakan Prisma Client
  const category = await prisma.categories.findUnique({
    where: {
      id: id
    }
  })

  // Jika kategori tidak ditemukan, kirimkan pesan error
  if (!category) {
    // res.send(`Category with ID: ${id} not found`)
    return sendResponse(res, 404, false, `Category with ID: ${id} not found`);
  }

  // Menghapus kategori dengan ID yang sesuai di database menggunakan Prisma Client
  await prisma.categories.delete({
    where: {
      id: id
    }
  })

  // res.send(`Category with ID: ${id} deleted successfully`)
  sendResponse(res, 200, true, "Category deleted successfully", null);
  
}
export const isCategoryExist = async (id) => {
  // Mencari kategori dengan ID yang sesuai di database menggunakan Prisma Client
  const category = await prisma.categories.findUnique({
    where: {
      id: id,
    },
  })

  return !!category
}

const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};