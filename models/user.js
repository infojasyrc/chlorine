class User {

  /**
   * Constructor
   * @param {Object} user 
   */
  constructor(user) {
    this.name = user.name;
    this.lastName = user.lastName;
    this.email = user.email;
    this.isAdmin = user.isAdmin || false;
    this.isSuperAdmin = user.isSuperAdmin || false;
    this.userId = user.userId;
    this.id = user.id || '';
  }

}

export default User;
