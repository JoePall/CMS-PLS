const pw = require("fs").readFileSync("./env/password.txt", "utf-8").trim();
const { table } = require("console");
const mysql = require("mysql");
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: pw,
        database: 'employee_cms_db'
    }
});

const db = {
    get: async (tableName) => {
        return await knex(tableName)
            .on("query", x => x);
    },
    getMatchesOn: async (tableName, field, value) => {
        return await knex(tableName)
            .where(field, value)
            .on("query", x => x);
    },

    // CREATE
    createEmployee: async (first_name, last_name, id = null, role_id = null, department_id = null) => {
        let values = [first_name, last_name, role_id, department_id]
        
        return await connection.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?);`, [values], (err, res) => {
            if (err) console.log(err);
            else table(res);
        });
    },    
    createDepartment: async (name, id = null) => {
        return await knex('departments').insert({ id: id, name: name });
    },    
    createRole: async (title, salary, id = null, department_id = null) => {
        return await knex('roles').insert({ id: id, title: title, salary: salary, department_id: department_id });
    },

    // DELETE
    deleteEmployee: async (id) => {
        return await knex('employees').delete();
    },
    deleteDepartment: async (id) => {
        return await knex('departments').delete();
    },
    deleteRole: async (id) => {
        return await knex('roles').delete();
    },    

    // // UPDATE
    // updateEmployees: async () => {
    //     return await knex("employee")
    //         .on("query", x => x)
    //         .then(result => result);
    // },
    // updateDepartments: async () => {
    //     return await knex("department")
    //         .on("query", x => x)
    //         .then(result => result);
    // },
    // updateRoles: async () => {
    //     return await knex("role")
    //         .on("query", x => x)
    //         .then(result => result);
    // }

    // TODO: User can CREATE departments, roles, employees
    // TODO: User can READ departments, roles, employees
    // TODO: User can UPDATE Update employee roles

}

// TODO: You may wish to have a separate file containing functions for performing specific SQL queries you'll need to use. Could a constructor function or a class be helpful for organizing these?

// TODO: You will need to perform a variety of SQL JOINS to complete this assignment, and it's recommended you review the week's activities if you need a refresher on this.





// SELECT * FROM employee_cms_db.employee;

//HINT: This can be done in a couple different ways using external data as well, but you do have all of the data you need within your database to find the correlations.Give your methods some thought before having to rely upon external info.

//HINT: Remember that MySQL has the ability to combine two or more tables together so long as they share equivalent data.What data is similar between the two lists ?





module.exports = db;