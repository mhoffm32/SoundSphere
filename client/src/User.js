class User{
    constructor(id, nName,email, password) {
        this.id = id;
        this.nName = nName;
        this.email = email;
        this.password = password;
        this.disabled = 0;
    }

    deactivate(){
        this.disabled = 1;
    }


}

class AdminUser extends User{

}
export default User;

