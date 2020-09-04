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

    getByFieldMatch(field, id) {
        return new Promise((res, rej) => {
            connection.query(`SELECT * FROM ?? WHERE ?? = ?;`, [this.tableName, field, id], (err, result) => {
                if (err) rej(err);
                res(result);
            });
        });
    };

    delete(id) {
        return new Promise((res, rej) => {
            connection.query(`DELETE FROM ?? WHERE ??.\`id\` = ?;`, [this.tableName, this.tableName, id], (err, result) => {
                if (err) rej(err);
                res(result);
            });
        });
    };

    updateFieldOnId(id, field, value) {
        return new Promise((res, rej) => {
            connection.query(`UPDATE ?? SET ??.?? = ? WHERE ??.\`id\` = ?;`, [this.tableName, this.tableName, field, value, this.tableName, id], (err, result) => {
                if (err) rej(err);
                
                res(result);
            });
        });
    };

    // INSERT
    insert(values) {
        return new Promise((res, rej) => {
            console.log(values);
            connection.query(`INSERT INTO ?? (??) VALUES (?);`, [this.tableName, this.insertValues, values], (err, result) => {
                if (err) rej(err);
                res(result);
            });
        });
    };
}

class departments extends table {
    constructor() {
        super();
        this.insertValues = ["name"];
    }

    getTotalBudget(id) {
        return new Promise((res, rej) => {
            connection.query(`SELECT SUM(roles.salary) 
FROM departments
INNER JOIN roles
ON departments.id = roles.department_id
WHERE departments.id = ?;`, id, (err, result) => {
                if (err) rej(err);
                res(result);
            });
        });
    };
}

class employees extends table {
    constructor() {
        super();
        this.insertValues = ["first_name", "last_name", "role_id", "manager_id"];
    }
}

class roles extends table {
    constructor() {
        super();
        this.insertValues = ["title", "salary", "department_id"];
    }
}

module.exports = { departments, roles, employees };