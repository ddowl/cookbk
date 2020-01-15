# Cookbk

Cookbk is a scheduling application that helps cooks plan large (concurrent) meals.

## Motivation

The motivation for this application comes from the difficulty that arises when trying to cook a meal that involves several recipes, even though the instructions for individual recipes are generally easy to follow. Cooks need to juggle extra information like:

- "When do I need to start recipe B so it finishes with the others?"
- "Do I have time to work on other tasks?"

A prime example is something like Thanksgiving dinner. If you want the turkey, stuffing, gravy, potatoes, and cranberry sauce to all come out piping hot (except the cranberry of course) at the same time, you either need (1) experience making large meals, or (2) a friend that can tell you when you should start working on each part of each recipe. Cookbk aims to be an electronic substitute of the latter.

## Technical Context
### Scheduling
It turns out that concurrent recipe scheduling bears a close resemblance to a well-known optimization problem called [Job-Shop scheduling](https://en.wikipedia.org/wiki/Job_shop_scheduling). All we need to do is add some additional constraints/variables such as (1) ensuring that every task ends _as late as possible_ from the target time (food comes out hot), and (2) letting the cook work on other recipes if possible (while a turkey is in the oven, for instance).

The bad news is that [this problem is NP-hard](https://en.wikipedia.org/wiki/Job_shop_scheduling#NP-hardness). The good news is that there are constraint solvers out there that are good at solving exactly this sort of thing. I've chosen to use [Google's OR-Tools](https://developers.google.com/optimization/scheduling/job_shop) Python client for implementing the scheduling algorithm.

There are many assumptions the current scheduling algorithm makes that can be improved in the future. Notably, it assumes that there are infinite cooks with infinite kitchen resources. Since this will probably yield some _very_ difficult instructions for the novice-cook-target-audience, we will likely need to parameterize the scheduling algorithm with additional resource constraints.

### Web Application Legacy Notes
`<rant>`

I initially created this project using a [Typescript](https://www.typescriptlang.org/) [React](https://reactjs.org/) + [GraphQL](https://graphql.org/) frontend with a Typescript / Node + [Prisma API](https://www.prisma.io/) backend, in order to learn GraphQL. I found this stack difficult to work with, partly due to the GraphQL components, and partly due to _all_ of the things I was used to getting for free with [Rails](https://rubyonrails.org/) (persistence, sessions, auth, etc) that I was having to struggle through implementing by hand (which is still a useful part of the learning process). I stepped away from the project for a while, somewhat frustrated with my lack of progress.

When I decided to attempt another web app implementation I chose to spend _even more_ novelty points on learning a new _language and web framework_, [Elixir](https://elixir-lang.org/) & [Phoenix](https://www.phoenixframework.org/), rather than going back to a web framework I had been using for years, Rails. I've really enjoyed all the learning (especially since I've been getting more into functional programming and Erlang), but now I live with the consequence of having 2 unfinished web apps living in the same repo.

The plan is to keep the Typescript stack around for reference as we make the Phoenix UI more crisp before deprecating it.

`</rant>`

## Install

To start a local instance of Cookbk, you'll need to clone this repo, and make sure you have Python and Elixir installed:

- [Download Python](https://www.python.org/downloads/)
  - I recommend using a version manager to make sure your Python version matches the required version in the `.python-version` file. I like [pyenv](https://github.com/pyenv/pyenv).
- [Download Elxir](https://elixir-lang.org/install.html), [Phoenix, and dependencies](https://hexdocs.pm/phoenix/installation.html)

The scheduler uses a Python virtual environment to store all of its dependencies. Make sure you're using the right Python version (in `.python-version`) and run the following in the `scheduler` directory:

```
$ python3 -m venv env
$ source env/bin/activate
(env) $ pip install -r requirements.txt
```

Then, navigate to the Phoenix app directory: `cookbk/server/phoenix/cookbk`. Assuming you've installed your Elixir & Phoenix dependencies correctly, you should be able to enter:

```
$ mix deps.get
$ mix deps.compile
$ cd assets && npm install && node node_modules/webpack/bin/webpack.js --mode development
$ mix ecto.create
$ mix phx.server
```

to start your local instance of Cookbk!

TODO: Maybe create a script to verify that scheduler environment has been set up, dependencies installed, Phoenix ready to go. Or, create a script that sets up the project.