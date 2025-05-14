class User {
  constructor(id, nName, email, password) {
    this.id = id;
    this.nName = nName;
    this.email = email;
    this.password = password;
    this.disabled = 0;
    this.admin = 0;
  }

  makeAdmin() {
    this.admin = 1;
  }

  deactivate() {
    this.disabled = 1;
  }
}

class AdminUser extends User {}

export default User;
