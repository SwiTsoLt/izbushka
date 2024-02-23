// Actions

export enum UserActionsEnum {
  setUser = '[App Component] [User] Set',
  
  toggleFavoritePost = '[App Component] [User] Toggle Favorite Post',
  toggleFavoritePostSuccess = '[App Component] [User] Toggle Favorite Post Success',
  toggleFavoritePostError = '[App Component] [User] Toggle Favorite Post Error',
  
  getUserByAccessToken = '[App Component] [User] Get By Access Token',
  getUserByAccessTokenSuccess = '[App Component] [User] Get By Access Token Success',
  getUserByAccessTokenError = '[App Component] [User] Get By Access Token Error',
  
  resetUser = '[App Component] [User] Reset',
}
