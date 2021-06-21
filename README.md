# Skyrim Inventory Management Frontend

## Production Site

https://sim.danascheider.com

## Overview

Skyrim Inventory Management is a split-stack app enabling users to manage inventory and tasks in Skyrim. This app is primarily intended for my personal use and anybody else should use at their own risk. The back end is available in [this repo](https://github.com/danascheider/skyrim_inventory_management) and runs in production at https://sim-api.danascheider.com. The SIM front end is the only authorised client at this time.

The SIM front end is built in [create-react-app](https://github.com/facebook/create-react-app) with React 17 and uses [Sign In With Google](https://developers.google.com/identity/sign-in/web/sign-in) to authenticate users.

## Developer Information

### Running Locally

#### Running the Back End

In order to run the front end locally, you will need to run the backend on `http://localhost:3000`. To do this, you will need to set the `GOOGLE_OAUTH_CLIENT_ID` environment variable with the development OAuth credentials (you can get this value from the front-end [config file](/src/utils/config.js) - make sure to use the development client ID). It is recommended to use [dotenv](https://github.com/bkeepers/dotenv) with a `.envrc` file to set this value in development. Additional instructions are available in the README of the [backend repo](https://github.com/danascheider/skyrim_inventory_management).

#### Running the Front End

Before you can run the front end, you will need to install dependencies. Clone this repository, `cd` into it, and run:
```
yarn install
```
You can run the front-end server using:
```
yarn start
```
Contrary to create-react-app (CRA) defaults, the SIM front end is configured to run on `http://localhost:3001` (instead of port 3000) when you run this command. The API's [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) policy dictates that the front end must run on port 3001 in development.

### Development Workflows

We use [this Trello board](https://trello.com/b/ZoVvVBJc/sim-project-board) to track work for both this app and the SIM API. When picking up a card, check out a development branch on your local to make the changes you need to make.

When you have finished the work, push to GitHub and make a pull request. Link the Trello card in the PR description. The PR description should also include:

* **Context:** Any information a reader will need to understand why you've made the changes you have
* **Summary of Changes:** A bulleted list summarising the changes you have made
* **Explanation:** A detailed explanation of any technical or design choices you made, tradeoffs you faced, and alternatives you considered, including enough detail to make sense to a reviewer or a future developer investigating Git history

All pull requests are expected to include updates to Storybook stories and developer and/or user documentation as appropriate. Storybook stories should cover any possible component states, such as loading states or states resulting from API error responses. API responses can be mocked using `msw`. API docs for the SIM API are available [in the docs directory](https://github.com/danascheider/skyrim_inventory_management/blob/main/docs/api/README.md) of that repo.

In order to deploy your work to Heroku, you will need to run `yarn build`. This should be done on a separate PR based off your main PR branch so as not to clutter the main PR that gets reviewed. Remember to rebase and run `yarn build` again on that branch if you make any changes to your main PR.

After creating your pull requests, attach them to the Trello card and move it into the "Reviewing" column. When your PRs have been reviewed, you are free to merge them.

### Storybook

The SIM front end components are tested extensively using [Storybook](https://storybook.js.org/), which allows components to be developed and tested in isolation. Storybook runs on a server on `http://localhost:6006`. After setting up your repo and running `yarn install`, you can run your Storybook server with:
```
yarn storybook
```
Storybook generally handles hot reloads easily. However, there are a few cases where certain types of changes completely bork the server. If that happens, kill and restart the server before you panic.

### Deployment

The SIM front end is deployed to [Heroku](https://heroku.com) under the app name `obscure-reaches-80056`. Deployment is done manually via the command line and Git. It is recommended to install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) to work with Heroku.

#### Configuring the Heroku Git Remote

Once you have installed the Heroku CLI, you need to set the Git remote. Begin by running `heroku login`, pressing any key to be taken to the browser login window, and going through the login flow. Once you're logged in, you can close the browser window and return to your terminal.

Then, from the root directory of this repo, run:
```
heroku git:remote --app=obscure-reaches-80056
```
Once you've done this, running `git remote` should reveal a remote called `heroku`.

#### Deploying

All deployments should be done from the `main` branch. Note that, on Heroku, the app runs from the `build` directory. That's why the [Development Workflows](#development-workflows) section above suggests making a PR with the changes to the `build` directory based off the branch of your main PR to facilitate review. After merging both PRs, on your local terminal, run:
```
git checkout main
git pull
git push heroku main
```

### Sign In With Google

SIM exclusively uses [Sign In With Google](https://developers.google.com/identity/sign-in/web/sign-in) for user authentication and authorisation. On the front end, this is implemented with the [`react-google-login`](https://www.npmjs.com/package/react-google-login) package for sign-in and a [home-rolled solution](/src/components/logoutDropdown/logoutDropdown.js) for logout (more on that in a minute).

The `GoogleLogin` component generated by `react-google-login` enables a user to click a login button and automatically be taken to a popup (on desktop) or login screen (on mobile or tablet) where they can authorise the app, choosing a Google account to use if they are logged in with more than one. The app is uniquely identified to Google using the client ID stored in the [app config](/src/utils/config.js). `react-google-login` allows developers to define callbacks to run on login success and failure.

On successful authorisation, the Google response returns a [JWT bearer token](https://jwt.io/introduction). In SIM's login success callback, this token is set as the value of the `_sim_google_session` cookie. At the same time, a request is made to the API's `/auth/verify_token` endpoint with the token in the `Authorization` header. This verifies the token on the server and creates or updates a user account, populating it with the profile data that Google sends to the server directly. (User profiles cannot be created or updated directly through the API.) Once the server has verified the user, they are redirected to their dashboard.

#### Authenticating API Calls

Any time you fetch data from the API, you need to authenticate the API call using the JWT bearer token stored in the `_sim_google_session` cookie. This is done by including an authorisation header (where `xxxxxxxxxx` is the value of the cookie):
```
Authorization: Bearer xxxxxxxxxx
```

#### Logging Out

Unfortunately, the `GoogleLogout` component provided by `react-google-login` [doesn't work as advertised](https://github.com/anthonyjgrove/react-google-login/issues/130) on apps that use [React-Router](https://reactrouter.com/), as SIM does. As a workaround, SIM uses a home-rolled logout component that removes the cookie and makes a request to Google to revoke the token before redirecting the user to the (unauthenticated) SIM homepage.

This home-rolled solution is not without tradeoffs. `react-google-login` offers an `isSignedIn` prop for its `GoogleLogin` component that, when set to `true`, keeps the user logged in by running the login success callback every time the page reloads. Unfortunately, this had to be set to `false` to prevent the cookie from immediately being reset every time it was removed during logout. Consequently, users are forced to log in again somewhat more often than is ideal. The maintainer of `react-google-login` has indicated (in the comments of the above issue report) that he does not intend to fix the bug but will accept a pull request if someone else wants to.
