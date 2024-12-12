export const HomePage = () => {
  return (
    <div className="prose dark:prose-invert">
      <h1>Next JS Starter Template</h1>

      <p>
        The aim of this starter template is to provide the minimum boilerplate
        needed to get started on your next SAAS project.
      </p>

      <h2 className="underline">Features</h2>

      <ul>
        <li>
          Framework with <strong>Next.js (TypeScript)</strong> 👨🏼‍💻
        </li>
        <li>
          Styling with <strong>Tailwind CSS</strong> and{" "}
          <strong>shadcn/ui</strong> 🎨
        </li>
        <li>
          State Management with <strong>Redux Toolkit</strong> 🗄️
        </li>
        <li>
          Subscriptions with <strong>Stripe</strong> 💳
        </li>
        <li>
          Authentication with <strong>Auth JS</strong> 🔐
        </li>
        <li>
          Serverless Postgres Database with <strong>Neon</strong> 🐘
        </li>
        <li>
          ORM with <strong>Prisma</strong> 📦
        </li>
        <li>
          File Storage with <strong>Cloudflare R2</strong> 📂
        </li>
        <li>
          Transactional Emails with <strong>Resend & React Email</strong> 📧
        </li>
        <li>
          Analytics with <strong>Fathom</strong> 📈
        </li>
      </ul>
    </div>
  );
};
