import "./style.css";

export const About = () => (
  <main className="page__about">
    <div className="container about__wrapper">
      <h1>About the project</h1>

      <p>
        The Expense Accounting project is a web application developed using React, TypeScript, Redux and React Router to
        optimize user experience and manage expenses.
      </p>

      <h3>Main functions:</h3>
      <p>User Registration and Authorization: Users can register and login using their email and password.</p>
      <p>
        Password recovery: If the user forgets his password, he can use the password recovery feature using his email.
      </p>
      <p>
        Manage expense categories: Users can create, edit and delete expense categories to better organize their
        financial transactions.
      </p>
      <p>Categories allow to add subcategories.</p>
      <p>Adding Expenses: The app allows users to add expenses under selected categories.</p>
      <p>
        Expense History: Users have access to a detailed history of their expenses with the ability to filter by date,
        category and amount.
      </p>
      <p>
        Expense Analysis: With the expense analysis feature, users can view their expenses for a selected period (year,
        month, week, custom period).
      </p>

      <h2> It is planned to add functionality:</h2>
      <ul>
        <li>Editing and deleting expenses and income</li>
        <li>Export data in CSV format</li>
        <li>Dark Theme: The app supports dark theme for a comfortable nighttime experience.</li>
      </ul>
    </div>
  </main>
);
