const { table } = require("console");
const { prompt } = require("inquirer");
const { exit } = require("process");
const db = require("./db");
const employees = new db.employees();
const roles = new db.roles();
const departments = new db.departments();

const intro = () => {
    console.log(`\n\n ____              ____        ____    __       ____        \n/\\  _\`\\    /'\\_/\`\\/\\  _\`\\     /\\  _\`\\ /\\ \\     /\\  _\`\\      \n\\ \\ \\/\\_\\ /\\      \\ \\,\\L\\_\\   \\ \\ \\L\\ \\ \\ \\    \\ \\,\\_\\_\\    \n \\ \\ \\/_/_\\ \\ \\__\\ \\/_\\__ \\    \\ \\ ,__/\\ \\ \\  __\\/_\\__ \\    \n  \\ \\ \\L\\ \\\\ \\ \\_/\\ \\/\\ \\L\\ \\   \\ \\ \\/  \\ \\ \\L\\ \\ /\\ \\_\\ \\  \n   \\ \\____/ \\ \\_\\\\ \\_\\ \`\\____\\   \\ \\_\\   \\ \\____/ \\ \`\\____\\ \n    \\/___/   \\/_/ \\/_/\\/_____/    \\/_/    \\/___/   \\/_____/\n\n\n\n                  BUILT BY: Josiah Powell                  \n\n`);
}

const options = {
    // CREATE
    "Create Employee": async () => {
        let first_name = await getInput("First Name");
        let last_name = await getInput("Last Name");
        let role = await selectFromTable(roles, "Select a Role?", x => x.title);
        let manager = await getEmployeeSelection("Select a Manager?");
        
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
    "View all Employees under a Manager": async () => {
        let manager = await getEmployeeSelection("Select a Manager?");
        return employees.getByFieldMatch("manager_id", manager.id);
    },
    "View Total Budget by Department": async () => {
        let selection = await selectFromTable(departments, "Select Department?", x => x.name);
        
        return departments.getTotalBudget(selection.id);
    },
    
    // UPDATE
    "Update employee Role": async () => {
        let employee = await getEmployeeSelection("Select Employee?");
        let role = await selectFromTable(roles, "Select Role?", x => x.title);
        
        employees.updateFieldOnId(employee.id, "role_id", role.id);
    },
    "Update employee Manager": async () => {
        let employee = await getEmployeeSelection("Select Employee?");
        let manager;
        do {
            manager = await getEmployeeSelection("Select Manager?");
            if (manager.id === employee.id) console.log("Manager must be a different selection from employee.");
        } while (manager.id === employee.id)
        
        employees.updateFieldOnId(employee.id, "manager_id", manager.id);
    },
    
    // DELETE
    "Delete Employee": async () => {
        let selection = await selectFromTable(employees, "Select Employee?", x => x.first_name + " " + x.last_name);
        
        employees.delete(selection.id);
    },
    "Delete Department": async () => {
        let selection = await selectFromTable(departments, "Select Department?", x => x.name);
        
        departments.delete(selection.id);
    },
    "Delete Role": async () => {
        let selection = await selectFromTable(roles, "Select Role?", x => x.title);
        
        roles.delete(selection.id);
    },
    
    // QUIT
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
            if (val.choice === "QUIT") exit(1);
            await options[val.choice]().then(data => {
                if (data === undefined) return;
                table(data);
            });
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

const getEmployeeSelection = (promptMessage) => selectFromTable(employees, promptMessage, x => x.first_name + " " + x.last_name);

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