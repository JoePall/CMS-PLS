const pw = require("fs").readFileSync("./env/password.txt", "utf-8").trim();
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: pw,
    database: "employee_cms_db"
});

connection.connect((err) => {
    if (err) return console.error("error connecting: " + err.stack);
});

class table {
    constructor() {
        this.tableName = this.constructor.name;
    }

    get() {
        return new Promise((res, rej) => {
            connection.query(`SELECT * FROM ??;`, this.tableName, (err, result) => {
                if (err) rej(err);
                res(result);
            });
        });
    };

    getByID(id) {
        return new Promise((res, rej) => {
            this.getByFieldMatch("id", id);
        });
    };

    getByFieldMatch(field, id) {
        return new Promise((res, rej) => {
            connection.query(`SELECT * FROM ?? WHERE ?? = ?;`, [this.tableName, field, id], (err, result) => {
                if (err) rej(err);
                res(result);
            });
        });
    };

    // INSERT
    insert(values) {
        return new Promise((res, rej) => {
            console.log(values);
            let query = connection.query(`INSERT INTO ?? (??) VALUES (?);`, [this.tableName, this.insertValues, values], (err, result) => {
                if (err) rej(err);
                res(result);
            });

            console.log(query);
        });
    };
}

class departments extends table {
    constructor() {
        super();
        this.insertValues = ["name"];
    }
}

class employees extends table {
    constructor() {
        super();
        this.insertValues = ["first_name", "last_name", "role_id", "manager_id"];
    }

    getEmployeesWithManagers() {
        return new Promise((res, rej) => {
            connection.query(`SELECT * FROM ${this.tableName} WHERE COUNT(manager_id) > 0;`, (err, result) => {
                if (err) rej(err);
                res(result);
            });
        });
    };

    getEmployeesWithRoles() {
        return new Promise((res, rej) => {
            connection.query(`SELECT * FROM ${this.tableName} WHERE COUNT(role_id) > 0;`, (err, result) => {
                if (err) rej(err);
                res(result);
            });
        });
    };
}

class roles extends table {
    constructor() {
        super();
        this.insertValues = ["title", "salary", "department_id"];
    }
}

module.exports = { departments, roles, employees };