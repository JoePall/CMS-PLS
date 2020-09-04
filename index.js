const { table } = require("console");
const { prompt } = require("inquirer");
const db = require("./db");
const employees = new db.employees();
const roles = new db.roles();
const departments = new db.departments();

const intro = () => {
    console.log(`\n\n ____              ____        ____    __       ____        \n/\\  _\`\\    /'\\_/\`\\/\\  _\`\\     /\\  _\`\\ /\\ \\     /\\  _\`\\      \n\\ \\ \\/\\_\\ /\\      \\ \\,\\L\\_\\   \\ \\ \\L\\ \\ \\ \\    \\ \\,\\_\\_\\    \n \\ \\ \\/_/_\\ \\ \\__\\ \\/_\\__ \\    \\ \\ ,__/\\ \\ \\  __\\/_\\__ \\    \n  \\ \\ \\L\\ \\\\ \\ \\_/\\ \\/\\ \\L\\ \\   \\ \\ \\/  \\ \\ \\L\\ \\ /\\ \\_\\ \\  \n   \\ \\____/ \\ \\_\\\\ \\_\\ \`\\____\\   \\ \\_\\   \\ \\____/ \\ \`\\____\\ \n    \\/___/   \\/_/ \\/_/\\/_____/    \\/_/    \\/___/   \\/_____/\n\n\n\n                  BUILT BY: Josiah Powell                  \n\n`);
    console.log("     This application is currently under construction.\n\n\n");
}

const options = {
    // CREATE
    "Create Employee": async () => {
        let first_name = await getInput("First Name");
        let last_name = await getInput("Last Name");
        let role = await selectFromTable(roles, "Select a Role?", x => x.title);
        let manager = await selectFromTable(employees, "Select a Manager?", x => x.first_name + " " + x.last_name);

        let values = [first_name, last_name, role.id, manager.id];

        return employees.insert(values);
    },
    "Create Department": async () => {
        let name = await getInput("Department");

        return departments.insert([name]);
    },
    "Create Role": async () => {
        let title = await getInput("Title");
        let salary = await getNumber("Salary");
        let department = await selectFromTable(departments, "Select a Department?", x => x.name);

        return roles.insert([title, salary, department.id], () => console.log("Inserted record"));
    },

    // READ
    "View all Employees": async () => await employees.get(),
    "View all Departments": async () => await departments.get(),
    "View all Roles": async () => await roles.get(),
    "View all Employees by Manager": async () => {
        let manager = await selectFromTable(employees, "Select a Manager?", x => x.first_name + " " + x.last_name);
        return employees.getByFieldMatch("manager_id", manager.id);
    },

    // UPDATE

    // DELETE

    "QUIT": "QUIT",
};

const run = async (options, recursiveRun = false) => {
    await prompt({
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: Object.keys(options),
    })
        .then(async (val) => {
            try {
                await options[val.choice]().then(table);
            } catch (error) { }

            if (recursiveRun) run(options, recursiveRun);
        });
}

const selectFromTable = async (table, promptTitle, getDisplayName) => {
    let objects = await table.get();
    let selectableChoices = objects.map(x => { return { id: x.id, name: getDisplayName(x) }; });
    return await prompt({
        type: 'list',
        name: 'choice',
        message: promptTitle,
        choices: ["none", ...selectableChoices.map(x => x.name)]
    })
    .then(selection => {
        if (selection.choice === "none") return null;
        else {
            return selectableChoices.find(x => x.name === selection.choice);
        }
    });
}

const selectEmployeeId = (question, getDisplayName) => {
    return employees.get()
        .then(objects =>
            selectEmployee(objects, getDisplayName, question).id);
}

const getInput = async (question) => {
    let result;

    await prompt({
        type: 'input',
        name: 'value',
        message: question,
    })
        .then(res => {
            result = res.value;
        });

    return result;
}

const getNumber = async (question) => {
    let result;

    await prompt({
        type: 'number',
        name: 'value',
        message: question,
    })
        .then(async res => {
            if (isNaN(res.value)) {
                console.log("Value must be a number.");
                result = await getNumber(question);
            }

            return parseInt(res.value);
        });

}

const init = () => {
    intro();
    run(options, true);
};
init();


async function selectEmployee(objects, getDisplayName, question) {
    let selectableChoices = objects.map(x => { return { id: x.id, name: getDisplayName(x) }; });
    await prompt({
        type: 'list',
        name: 'choice',
        message: question,
        choices: ["none", ...selectableChoices.map(x => x.name)]
    })
        .then(selection => {
            if (selection.choice === "none") res(null);
            res(selectableChoices.find(x => x.name === selection.choice));
        });
}


// myQueries.createRole("Manager", 70000);
//queryDB(query);

//TODO: Use node, inquirer, and MySQL.

//TODO: Design the following database schema containing three tables:

// TODO: User can CREATE departments, roles, employees
// TODO: User can READ departments, roles, employees
// TODO: User can UPDATE Update employee roles

// Bonus
// TODO: Update employee managers
// TODO: View employees by manager
// TODO: Delete departments, roles, and employees
// TODO: View the total utilized budget of a department -- ie the combined salaries of all employees in that department

// TODO: * Use [console.table](https://www.npmjs.com/package/console.table) to print MySQL rows to the console. There is a built-in version of `console.table`, but the NPM package formats the data a little better for our purposes.

// TODO: FINISH BREAKDOWN...
// Include a `seed.sql` file to pre-populate your database. This will make development of individual features much easier.
// * Focus on getting the basic functionality completed before working on more advanced features.
// * Check out [SQL Bolt](https://sqlbolt.com/) for some extra MySQL help.

// * GitHub repository with a unique name and a README describing the project.
// * The command-line application should allow users to:
//   * Add departments, roles, employees
//   * View departments, roles, employees
//   * Update employee roles

// ## Bonus

// * The command-line application should allow users to:

//   * Update employee managers

//   * View employees by manager

//   * Delete departments, roles, and employees

//   * View the total utilized budget of a department -- ie the combined salaries of all employees in that department

// ## Commit Early and Often

// One of the most important skills to master as a web developer is version control. Building the habit of committing via Git is important for two reasons:

// * Your commit history is a signal to employers that you are actively working on projects and learning new skills.

// * Your commit history allows you to revert your codebase in the event that you need to return to a previous state.

// Follow these guidelines for committing:

// * Make single-purpose commits for related changes to ensure a clean, manageable history. If you are fixing two issues, make two commits.

// * Write descriptive, meaningful commit messages so that you and anyone else looking at your repository can easily understand its history.

// * Don't commit half-done work, for the sake of your collaborators (and your future self!).

// REQUIRED...
// * The URL of the GitHub repository
// * A video demonstrating the entirety of the app's functionality 