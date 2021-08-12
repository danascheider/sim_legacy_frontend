const paths = {
  home: '/',
  login: '/login',
  dashboard: {
    main: '/dashboard',
    games: '/dashboard/games',
    shoppingLists: '/dashboard/shopping_lists',
    inventory: '/dashboard/inventory'
  }
}

export const allPaths = [
  paths.home,
  paths.login,
  paths.dashboard.main,
  paths.dashboard.games,
  paths.dashboard.shoppingLists,
  paths.dashboard.inventory
]

export const pathsScopedToGames = [
  paths.dashboard.shoppingLists,
  paths.dashboard.inventory
]

export default paths
