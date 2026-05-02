// profiles.controller.js

import prisma from '../database/config.database.js'

export const getProfiles = async (req, res) => {
  const profiles = await prisma.profiles.findMany()
  sendResponse(res, 200, true, "Profiles retrieved successfully", profiles);
}

export const getProfileById = async (req, res) => {
  // Mendapatkan ID profile yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mengambil profile dengan ID yang sesuai dari database menggunakan Prisma Client
  const profile = await prisma.profiles.findUnique({
    where: {
      id: id
    }
  })

  // Jika profile tidak ditemukan, kirimkan pesan error
  if (!profile) {
    // res.send(`Profile with ID: ${id} not found`)
    return sendResponse(res, 404, false, `Profile with ID: ${id} not found`);

  }

  // res.send(profile)
  sendResponse(res, 200, true, "Profile retrieved successfully", profile);

}

export const createProfile = async (req, res) => {

  // Mendapatkan data profile baru dari request body
  const { userId, address, phone } = req.body

  // Menambahkan profile baru ke database menggunakan Prisma Client
  const profile = await prisma.profiles.create({
    data: {
      userId,
      address,
      phone
    }
  })

  // res.send('Profile created successfully')
  sendResponse(res, 201, true, "Profile created successfully", profile);
}

export const updateProfile = async (req, res) => {

  // Mendapatkan ID profile yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mendapatkan data profile yang akan diupdate dari request body
  const { userId, address, phone } = req.body

  // Mencari profile dengan ID yang sesuai di database menggunakan Prisma Client
  const profile = await prisma.profiles.findUnique({
    where: {
      id: id
    }
  })

  // Jika profile tidak ditemukan, kirimkan pesan error
  if (!profile) {
    // res.send(`Profile with ID: ${id} not found`)
    return sendResponse(res, 404, false, `Profile with ID: ${id} not found`);
  }

  // Mengupdate profile dengan ID yang sesuai di database menggunakan Prisma Client
  await prisma.profiles.update({
    where: {
      id: id
    },
    data: {
      userId,
      address,
      phone
    }
  })

  // res.send(`Profile with ID: ${id} updated successfully`)
  sendResponse(res, 200, true, "Profile updated successfully", null);
    
}

export const deleteProfile = async (req, res) => {

  // Mendapatkan ID profile yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mencari profile dengan ID yang sesuai di database menggunakan Prisma Client
  const profile = await prisma.profiles.findUnique({
    where: {
      id: id
    }
  })

  // Jika profile tidak ditemukan, kirimkan pesan error
  if (!profile) {
    // res.send(`Profile with ID: ${id} not found`)
    return sendResponse(res, 404, false, `Profile with ID: ${id} not found`);
  }

  // Menghapus profile dengan ID yang sesuai di database menggunakan Prisma Client
  await prisma.profiles.delete({
    where: {
      id: id
    }
  })

  // res.send(`Profile with ID: ${id} deleted successfully`)
  sendResponse(res, 200, true, "Profile deleted successfully", null);
}

const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};