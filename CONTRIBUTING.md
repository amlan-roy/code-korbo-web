# Contributing to Code Korbo

We love your input!😇<br>
We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug 🐞
- Discussing the current state of the code 🧑‍💻
- Submitting a fix 🔧
- Proposing New Feature 🚀

For Contribution we strictly follow [GitHub Flow](https://guides.github.com/introduction/flow/)

## Contents

- [Setting Up the Project](#setting-up-the-project)
- [How To Start Contributing](#how-to-start-contributing)
- [Reporting a Bug](#reporting-a-bug)
- [Proposing New Feature](#proposing-new-feature)
- [Want to have some discussion with Us](#want-to-have-some-discussion-with-us)

## Setting Up the Project

This is important and first step for contributing to project 😊

- [Fork](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo#fork-an-example-repository) the Repository
- Clone Your Forked copy -<br>
  Open up the GitBash/Command Line/Terminal and type in
  `git clone https://github.com/[YOUR-USERNAME]/code-korbo-web.git`

- Navigate to the directory of project -
  `cd code-korbo-web/`

- Create a new branch -
  `git checkout -b [branch_name]`

### Steps for setting up Frontend

- Setup the node modules -
  `npm i`

- Add a file named `.env.local` in the root of the directory and have the following in it -
  ```
  NEXT_PUBLIC_FIREBASE_API_KEY=
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
  NEXT_PUBLIC_FIREBASE_APP_ID=
  NEXT_PUBLIC_JUDGE_0_X_RAPIDAPI_KEY=
  NEXT_PUBLIC_JUDGE_0_X_RAPDAPI_HOST=
  ```
- Input your own keys here and you're good to Go!!

### Steps for getting your API keys

You can get you api keys by following thesteps below. Add these API keys in `.env.local` to get started.

#### Firebase

Setup a firebase project and get the keys from there. [Steps for it](https://firebase.google.com/docs/web/learn-more#config-object)

#### Judge0

- You can either get your Judge0 CE keys from Rapid API from [here](https://rapidapi.com/auth/sign-up?referral=/judge0-official/api/judge0-ce/pricing)
- Or you can use docker to [host it yourself](https://github.com/judge0/judge0/blob/master/CHANGELOG.md#deployment-procedure)
  - In this case, remove `NEXT_PUBLIC_JUDGE_0_X_RAPIDAPI_KEY` and `NEXT_PUBLIC_JUDGE_0_X_RAPDAPI_HOST` from `.env.local`
  - Update `CODE_EXECUTION_DOMAIN` to point to the local domain for judge0 (eg: `http://localhost:2358/`)
  - Remove all instances of `judge_0_config`

## How To Start Contributing

After [Setting Up Project](#user-content-setting-up-the-project) it's time to Contribute 🥰

- Please go through [Github Flow](https://guides.github.com/introduction/flow/), it will help you a lot if not already :)

- Take up an [Issue](https://github.com/amlan-roy/code-korbo-web/issues) or [Raise](https://github.com/amlan-roy/code-korbo-web/issues/new) one.

- Discuss your proposed changes & Get assigned.

- If your changes are approved, do the changes in branch `[branch_name]`.

- Still in branch `[branch_name].`

- **Stage and Commit only the required files.**
  Stage : `git add file_name`
  Commit : `git commit -m "YOUR_MESSAGE"`
- `git push origin [branch_name] -u`

- Once you push the changes to your repo, Go to your forked repository, the **Compare & pull request** button will appear in GitHub Click on it A new screen will open up.

- Open a pull request by clicking the **Create Pull Request** button.

- From here maintainers review your work,they can merge it if it is good, or they may ask you for some changes.

- If your PR is accepted, it is automatically deployed once merged. :)

- That's it!

## Reporting A Bug

- Head over [here](https://github.com/amlan-roy/code-korbo-web/issues/new?assignees=&labels=type%3Abug&template=bug_report.md&title=)
- Give appropriate Title and Description for your issue.
- When you're finished, click Submit new issue.
- After creating the issue you have to wait until the project maintainer assigns the issue to you.

## Proposing New Feature

- Head over [here](https://github.com/amlan-roy/code-korbo-web/issues/new?assignees=&labels=&template=feature_request.md&title=)
- Give appropriate Title and Description for your issue.
- When you're finished, click Submit new issue.
- After creating the issue you have to wait until the project maintainer assigns the issue to you.

## Want to have some discussion with Us

Feel free to start a New Discussion [here](https://github.com/amlan-roy/code-korbo-web/discussions) 🤗
There to answer your all doubts :)
