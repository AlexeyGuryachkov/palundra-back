module.exports = {
	defaultError: (error) => {
		return {code: 66, message: error}
	},

//sign in errors
	userNotFound: (email) => { 
		return {code: 1 , message: `Пользователя с адресом ${email} не существует`}
	},
	invalidPassword: () => {
		return {code: 2, message: 'Не верный пароль'}
	},
	emailExists: (email) => {
		return {code: 3, message: `Пользователь с адресом ${email} уже существует`}
	}
}