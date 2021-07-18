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
Storybook generally handles hot reloads easily. However, there are a few cases where certain types of changes completely bork the server. If that happens, kill and restart the server before you panic. Sometimes, certain stories will also break on hot reloads (especially those that mock API calls). You don't always need to restart thew whole server to fix these - sometimes it's enough to reload the page.

#### API Mocking

We've tried to make sure that Storybook stories make the best use of API mocking to mimic component behaviour in the running application. Unfortunately, it has not been consistently possible to mimic this behaviour perfectly. That's due to the fact that many API calls are made from within context providers that set data dynamically. Within the stories, we don't have access to data internal to the providers. That means that we can't mock series of actions, such as when a user increments then decrements the quantity of an item on a list, or adds and removes multiple lists from a page. Storybook should be considered as a development tool and not a testing one. If you need to test UI functionality, use [Jest](https://jestjs.io/docs/tutorial-react).

There are a few considerations when writing stories for components that make API calls (and the components themselves). The first is mock data. For mocking, we use the [mock service worker Storybook addon](https://storybook.js.org/addons/msw-storybook-addon/). For an example of how the MSW addon is used, look at the story for the [dashboard header](https://github.com/danascheider/skyrim_inventory_management_frontend/blob/main/src/components/dashboardHeader/dashboardHeader.stories.js), which makes a call to `/users/current` to get the user's profile information from the backend.

SIM components that make API calls typically first check for the presence of the `_sim_google_session` cookie before doing so. This is an issue in Storybook because Storybook doesn't set cookies and there doesn't seem to be a great solution out there for mocking them with decorators or addons. Components that check for the presence of an auth token can set this using the `AppContext` and the `overrideValue` for the `AppProvider` for components that use it:

```js
const overrideValue = { token: 'xxxxxx', profileData: data }

export default { title: 'DashboardHeader' }

export const Default = () => <DashboardProvider overrideValue={overrideValue}><DashboardHeader /></DashboardProvider>
```
For other cases where you absolutely must change app behaviour for Storybook, you can use the [`isStorybook`](/src/utils/isTestEnv.js) function. (There are also an `isJest` function, which identifies if the code is running in Jest, and an `isTestEnv` function that determines whether it is in either Storybook or Jest.) Use of these functions should be considered a code smell and avoided when possible.

### Testing with Jest

[Jest](https://jestjs.io/) has been set up with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) to handle testing of components. We are in the process of [retrofitting tests](https://trello.com/c/ulddni7U/78-testing-with-jest) to the application, so tests will be added to components that don't currently have them.

It is recommended, per the docs, to take a behaviour-based approach to testing with Jest, using the React Testing Library tooling to interact with elements like a user would. It's important that we write these tests with an eye to ensuring complete coverage of underlying logic, however. Most of the logic in the SIM front-end is in contexts and hooks, not in the components themselves, and we should make sure the tests simulate situations that will trigger this logic to run and test the outcome.

To run the Jest tests, you'll need to first run `yarn install` to make sure your dependencies are installed and up-to-date. To run the tests, run:
```
yarn test
```
This will run the tests in watch mode, running tests every time you save a file. Not all tests will run on every save - by default, Jest only reruns tests touching files that have changed since the last commit. You can press `q` to exit watch mode and go back to your terminal.

#### API Mocking

We use [MSW](https://mswjs.io/docs/getting-started) for mocking API calls in Jest (as well as Storybook). While MSW recommends mocking all API calls centrally, we have opted not to do that. The reason for this is that the outcome of our API calls cannot be determined solely by the request, but also by the state of records in the database and token validation. It's too hard to make centralised handlers that cover all the needed cases, so it's better to just set up a mock server in each of the tests where one is required and define the handlers there. For an example of this, see the [homepage test file](/src/pages/homePage/homePage.test.js).

### GitHub Actions

Jest has been configured to run in CI with GitHub actions. It runs against all pull requests against `main`, as well as when `main` is merged. After merging new code, make sure the build has passed before deploying to Heroku.

When working on an epic on a feature branch, you may want to configure GitHub Actions to run against PRs against the feature branch (or merges to that branch) and not just `main`. This can be done in the [pipeline definition file](/.github/workflows/ci.yml) by changing the following block:
```yml
on:
  push:
    branches: [main, your-feature-branch]
  pull_request:
    branches: [main, your-feature-branch]
```

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

SIM exclusively uses [Sign In With Google](https://developers.google.com/identity/sign-in/web/sign-in) for user authentication and authorisation. On the front end, this is implemented with the [`react-google-login`](https://www.npmjs.com/package/react-google-login) package for sign-in and a [home-rolled solution](/src/utils/logOutWithGoogle.js) for logout (more on that in a minute).

The `GoogleLogin` component generated by `react-google-login` enables a user to click a login button and automatically be taken to a popup (on desktop) or login screen (on mobile or tablet) where they can authorise the app, choosing a Google account to use if they are logged in with more than one. The app is uniquely identified to Google using the client ID stored in the [app config](/src/utils/config.js). `react-google-login` allows developers to define callbacks to run on login success and failure.

On successful authorisation, the Google response returns a [JWT bearer token](https://jwt.io/introduction). When the request succeeds, the `_sim_google_session` cookie is added with the JWT bearer token as the value and the user is redirected to the `/dashboard` page. API requests are authenticated using this bearer token in the `Authorization` header. When a request is made, the token is verified with Google and, if Google approves, the user's account is created or updated with the data Google sends back. (User profiles cannot be created or updated directly through the API.) Once the server has verified the user, they are redirected to their dashboard.

#### Authenticating API Calls

Any time you fetch data from the API, you need to authenticate the API call using the JWT bearer token stored in the `_sim_google_session` cookie. This is done by including an authorisation header (where `xxxxxxxxxx` is the value of the cookie). This is done automatically in the [`simApi`](/src/utils/simApi.js) module, which provides functions for contacting API endpoints.
```
Authorization: Bearer xxxxxxxxxx
```
If you are developing components that use the `AppContext`, it should be used to get token values:
```js
import { fetchUserProfile } from '../../utils/simApi'
import { useAppContext } from '../../hooks/contexts'

const MyComponent = () => {
  const { token } = useAppContext()

  const getProfile = () => {
    fetchUserProfile(token)
      .then(() => { /* do something */ })
  }
}
```

#### Logging Out

Unfortunately, the `GoogleLogout` component provided by `react-google-login` [doesn't work as advertised](https://github.com/anthonyjgrove/react-google-login/issues/130) on apps that use [React-Router](https://reactrouter.com/), as SIM does. As a workaround, SIM uses a home-rolled logout component that attempts to log out with `gapi` (Google's own OAuth library that `react-google-login` uses under the hood) and, failing that, just removes the cookie and redirects to the login page.

The maintainer of `react-google-login` has indicated (in the comments of the above issue report) that he does not intend to fix the bug in the library but will accept a pull request if someone else wants to submit one.
