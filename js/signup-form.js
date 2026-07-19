(function () {
	'use strict';

	const form = document.forms['signupform'];
	if (!form) return;

	const err0 = document.querySelector('.error-0');
	const err1 = document.querySelector('.error-1');
	const err2 = document.querySelector('.error-2');
	const err3 = document.querySelector('.error-3');
	const sus0 = document.querySelector('.suc-0');
	const sus1 = document.querySelector('.suc-1');
	const sus2 = document.querySelector('.suc-2');
	const sus3 = document.querySelector('.suc-3');

	const atLeastOneNum = /^(?=.*[0-9])/;
	const atLeastOneSym = /^(?=.*[!@#$%^&*])/;
	const passwordPattern = /^[a-zA-Z0-9!@#$%^&*]{0,16}$/;
	const emailPattern = /^(([^<>()[\]\.,;:\s@"]+(\.[^<>()[\]\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/;

	function validateUsername() {
		if (form.username.value === '') {
			err0.textContent = 'Username cannot be blank';
			sus0.textContent = '';
			return false;
		}
		if (form.username.value.length <= 5 || form.username.value.length >= 15) {
			err0.textContent = 'Username MIN 5 MAX 15 CHARACTERS';
			sus0.textContent = '';
			return false;
		}
		sus0.textContent = 'success';
		err0.textContent = '';
		return true;
	}

	function validateEmail() {
		if (form.email.value === '') {
			err1.textContent = 'Email cannot be blank';
			sus1.textContent = '';
			return false;
		}
		if (!form.email.value.match(emailPattern)) {
			err1.textContent = 'Not a valid email';
			sus1.textContent = '';
			return false;
		}
		sus1.textContent = 'success';
		err1.textContent = '';
		return true;
	}

	function validatePassword() {
		if (form.password.value === '') {
			err2.textContent = 'Password cannot be blank';
			sus2.textContent = '';
			return false;
		}
		if (!form.password.value.match(passwordPattern)) {
			return false;
		}
		if (!form.password.value.match(atLeastOneNum)) {
			err2.textContent = 'Password must contain at least one number';
			sus2.textContent = '';
			return false;
		}
		if (!form.password.value.match(atLeastOneSym)) {
			err2.textContent = 'Must contain at least one special character';
			sus2.textContent = '';
			return false;
		}
		if (form.password.value.length <= 5) {
			err2.textContent = 'Password MIN 5 CHARACTERS';
			sus2.textContent = '';
			return false;
		}
		sus2.textContent = 'success';
		err2.textContent = '';
		return true;
	}

	function validateConfirmPassword() {
		if (form.confirmpassword.value === '') {
			err3.textContent = 'Password cannot be blank';
			sus3.textContent = '';
			return false;
		}
		if (form.password.value !== form.confirmpassword.value) {
			err3.textContent = 'Passwords do not match';
			sus3.textContent = '';
			return false;
		}
		sus3.textContent = 'success';
		err3.textContent = '';
		return true;
	}

	form.addEventListener('submit', function (event) {
		const isValid =
			validateUsername() &&
			validateEmail() &&
			validatePassword() &&
			validateConfirmPassword();

		if (!isValid) {
			event.preventDefault();
		}
	});

	form.username.onblur = validateUsername;
	form.email.onblur = validateEmail;
	form.password.onblur = validatePassword;
	form.confirmpassword.onblur = validateConfirmPassword;
})();
