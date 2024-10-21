const invalidCharacters = '01234567899~!@#$%^&*()_+|\\=?:;№"\'`'

const nameValidate = city => {
  return Boolean(
    city
      .split('')
      .filter(ch => {
        return invalidCharacters.includes(ch)
      })
      .join('').length,
  )
}

export default nameValidate
