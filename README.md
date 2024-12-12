# Next JS Starter Template

The aim of this starter template is to provide the bare minimum boilerplate needed to get started on your next SAAS project.

## Features

- Application code with **Next.js (TypeScript)** 👨🏼‍💻

- Styling with **Tailwind CSS** and **shadcn/ui** 🎨

- State Management with **Redux Toolkit** 🗄️

- Subscriptions with **Stripe** 💳

- Authentication with **Auth JS (V5)** 🔐

- Serverless Postgres Database with **Neon** 🐘

- Database ORM with **Prisma** 📦

- File Storage with **Cloudflare R2** 📂

- Transactional Emails with **Resend & React Email** 📧

- Analytics with **Fathom** 📊

## Directory Structure

```
  src/
    actions                                  # Shared Actions
    app                                      # App Routes
    components                               # App Components
    emails                                   # React Email Templates
    hooks                                    # Global Hooks
    lib/                                     # Libraries
      auth                                   # Auth JS
      db                                     # Neon - Prisma
      r2                                     # Cloudflare Storage
      resend                                 # Resend
      store                                  # Redux Toolkit
      stripe                                 # Stripe
      utils.ts                               # Shared Utility Functions
      types.ts                               # Shared Types
    constants.ts                             # Share Constants
    middleware.ts                            # Next JS Middleware
  .env.example
  .eslintrc.json                             # ESlint config
  .gitignore                                 # Git ignore
  .prettierrc                                # Prettierrc config
  components.json                            # shadcn/ui config
  next.config.mjs                            # Next JS config
  package.json
  postcss.config.mjs                         # PostCSS config
  README.md
  tailwind.config.ts                         # Tailwind config
  tsconfig.json                              # TypeScript config
```

## Install

To get started, clone the repository and run the following commands with your package manager of choice:

```
git clone https://github.com/darrencarlin/next-starter.git
```

```
cd next-starter
bun install
```

Once you setup neon and copy your .env.local variables, run these commands to sync your local schema with the database

```
bun run db:generate
bun run db:push
```

## Environment Variables

Pay close attention to the `.env.example` file, you will need to create a `.env.local` file and add the required environment variables. If there are parts of the application you don't need, you can remove those parts based on the folder structure below

## Getting Started / Folder Structure

### Redux Toolkit

path: `src/lib/store`

Redux Toolkit documentation can be found [here](https://redux-toolkit.js.org/usage/nextjs)

The store is setup with some simple app loading state to give you an idea how it works.

path: `src/lib/store/slices/app-slice.ts`

In the root `layout.tsx` file, you'll find a function called `getAppState` which pre-populates the store with a value, allowing you to get data server-side when the application loads.

You can toggle this loading state on the home page.

### Stripe

path: `src/lib/stripe`

You can sign up for a Stripe account [here](https://stripe.com/)

Stripe documentation can be here [here](https://docs.stripe.com/)

There are several custom functions in the `actions.ts` file

1.  `updateStripeSubscription` Updates a users subscription details in Neon

2.  `createCheckoutSession` Creates a checkout session for a given price ID

3.  `getStripeSubscriptions` Gets all subscription products from your stripe account

4.  `getActiveSubscription` Gets the active subscription for a user

There is one component for managing user subscriptions using the Stripe Customer Portal `src/components/manage-subscription-button.tsx`

To listen to Webhooks from Stripe location you can run the `stripe:listen` command found in the `package.json` file

### Auth JS

path: `src/lib/auth`

Auth JS documentation can be found [here](https://authjs.dev/)

We use the database strategy so everyhing in the user table should be synced with the session via the callback in `src/lib/auth/index.ts`

The main function used to check the session is

```
const session = await auth();
```

### Neon/Prisma

path: `src/lib/db`

You can sign up for a Neon account [here](https://neon.tech/)

Prisma documentation can be found [here](https://www.prisma.io/)

`index.ts` exports a simple `db` variable for interacting with the database

You can define new schema types within `schema.ts`

### Cloudflare R2

path: `src/lib/r2`

You can sign up for a Cloudflare account [here](https://www.cloudflare.com/en-gb/)

R2 documentation can be found [here](https://developers.cloudflare.com/r2/)

There are several custom functions in the `actions.ts` file

1.  `generateFileName` Generates a filename

2.  `uploadFile` Handles uploading FormData to the storage bucket.

There is one component which handles the file upload `src/components/file-upload.tsx`

**Note**: Cloudflare requires a credit card on file to get started with R2, the usage before you'll start to be charged is generous

### Resend

lib path: `src/lib/resend/index.ts`

emails path: `src/emails`

You can sign up for a Resend account [here](https://resend.com/)

Resend documentation can be found [here](https://resend.com/docs/introduction)

React Email documentation can be found [here](https://react.email/docs/introduction)

Currently just set up to send verification emails, when a user signs up, you can see the implementation details in `src/lib/auth/actions.ts` in the `signUp` function.

**Note**: Resend requires domain verification to send emails from an email address, so email sending will not work out of the box. You will have to setup some DNS records to get this working.

### Fathom Analytics

component path: `src/components/fathom-analytics.tsx`

You can sign up for a Fathom account [here](https://usefathom.com/)

## Other documentation

- [Next JS](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
