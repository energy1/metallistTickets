export default class NavbarController {
  //end-non-standard

  //start-non-standard
  constructor(Auth) {
    'ngInject';
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.isCashier = Auth.isCashier || Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
    this.isCollapsed = true;
  }

}