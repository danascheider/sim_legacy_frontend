const paths = {
  home: '/',
  login: '/login',
  dashboard: {
    main: '/dashboard',
    games: '/dashboard/games',
    shoppingLists: '/dashboard/shopping_lists'
  }
}

export const allPaths = [
  paths.home,
  paths.login,
  paths.dashboard.main,
  paths.dashboard.games,
  paths.dashboard.shoppingLists
]

export const pathsScopedToGames = [
  paths.dashboard.shoppingLists
]

export default paths
