const { table } = require("console");
const inquirer = require("inquirer");
const pw = require("fs").readFileSync("./env/password.txt", "utf-8").trim();
const mysql = require("mysql");
const { exit } = require("process");
const db = require("./db");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: pw,
    database: "employee_cms_db"
});

connection.connect(async (err) => {
    if (err) return console.error("error connecting: " + err.stack);
    
    intro();
    run(options, true);
});

const intro = () => {
    console.log(`\n\n ____              ____        ____    __       ____        \n/\\  _\`\\    /'\\_/\`\\/\\  _\`\\     /\\  _\`\\ /\\ \\     /\\  _\`\\      \n\\ \\ \\/\\_\\ /\\      \\ \\,\\L\\_\\   \\ \\ \\L\\ \\ \\ \\    \\ \\,\\_\\_\\    \n \\ \\ \\/_/_\\ \\ \\__\\ \\/_\\__ \\    \\ \\ ,__/\\ \\ \\  __\\/_\\__ \\    \n  \\ \\ \\L\\ \\\\ \\ \\_/\\ \\/\\ \\L\\ \\   \\ \\ \\/  \\ \\ \\L\\ \\ /\\ \\_\\ \\  \n   \\ \\____/ \\ \\_\\\\ \\_\\ \`\\____\\   \\ \\_\\   \\ \\____/ \\ \`\\____\\ \n    \\/___/   \\/_/ \\/_/\\/_____/    \\/_/    \\/___/   \\/_____/\n\n\n\n                  BUILT BY: Josiah Powell                  \n\n`);
    console.log("     This application is currently under construction.\n\n\n");
}

const options = {
    // CREATE
    "Create Employee": async () => {
        let first_name = await getInput("First Name");
        let last_name = await getInput("Last Name");
        let managerId = await getSelectedRowID("Select a Manager?", "employees", x => x.first_name + " " + x.last_name);
        let roleId = await getSelectedRowID("Select a Role?", "roles", x => x.title);

        return await connection.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?);`, [values], (err, res) => {
            if (err) console.log(err);
            else table(res);
        });
    },
    "Create Department": async () => {
        let name = await getInput("Department");
        return await knex('departments').insert({name: name});
    },
    "Create Role": async () => {
        let title = await getInput("Title");
        let salary = await getNumber("Salary");
        let departmentId = await getSelectedRowID("Select a Department?", "departments", x => x.title);
        return await knex('roles').insert({title: title, salary: salary, department_id: departmentId});
    },

    // READ
    "View all Employees": db.get("employees"),
    "View all Departments": db.get("departments"),
    "View all Roles": db.get("roles"),
    "View all Employees by Manager": async () => {
        let id = await getSelectedRowID("Select a Manager?", "employees", x => x.first_name + " " + x.last_name);
        return await db.getMatchesOn("employees", "manager_id", id);
    },

    // UPDATE

    // DELETE
    "Delete Employee": async () => {
        let id = await getSelectedRowID("Select an Employee?", "employees", x => x.first_name + " " + x.last_name);
        return await db.deleteEmployee(id);
    },

    "Delete Department": async () => {
        let id = await getSelectedRowID("Select a Department?", "departments", x => x.name);
        return await db.deleteEmployee(id);
    },
    "Delete Role": async () => {
        let id = await getSelectedRowID("Select a Role?", "roles", x => x.title);
        return await db.deleteEmployee(id);
    },

    "QUIT": "QUIT",
};



const run = async (options, recursiveRun = false) => {
    await inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: Object.keys(options),
    })
        .then(async (val) => {
            try {
                await options[val.choice].then(table);
            } catch (error) {
                try {
                    await options[val.choice]().then(table);
                } catch (error) {
                    exit("1");
                }
            }

            if (recursiveRun) await run(options, recursiveRun);
        });
}


const getSelectedRowID = async (question, tableName, getDisplayName) => {
    let objects = await db.get(tableName);
    let selectableChoices = objects.map(x => { return { id: x.id, name: getDisplayName(x) }; });
    let selectionID = await inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: question,
        choices: selectableChoices.map(x => x.name)
    })
    .then(res => selectableChoices.find(x => x.name === res.choice))
    .then(x => x.id);

    return selectionID;
}

const getInput = async (question) => {
    let result;

    await inquirer.prompt({
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

    await inquirer.prompt({
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






// await myQueries.getRoles().then(console.table);
// await myQueries.getDepartments().then(console.table);



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