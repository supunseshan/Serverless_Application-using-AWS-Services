// src/utils/validators.js

export const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const validatePassword = (password) => {
  const errors = []
  if (password.length < 8) errors.push('At least 8 characters')
  if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter')
  if (!/[a-z]/.test(password)) errors.push('At least one lowercase letter')
  if (!/[0-9]/.test(password)) errors.push('At least one number')
  return errors
}

export const validateEventForm = ({ title, description, date, location }) => {
  const errors = {}
  if (!title?.trim()) errors.title = 'Title is required'
  if (title?.length > 200) errors.title = 'Title must be under 200 characters'
  if (!description?.trim()) errors.description = 'Description is required'
  if (!date) errors.date = 'Date is required'
  if (date && new Date(date) < new Date()) errors.date = 'Date must be in the future'
  if (!location?.trim()) errors.location = 'Location is required'
  return errors
}

export const hasErrors = (errors) => Object.keys(errors).length > 0
