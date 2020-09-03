const pw = require("fs").readFileSync("./env/password.txt", "utf-8").trim();
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: pw,
    database: "employee_cms_db"
});

connection.connect(async (err) => {
    if (err) return console.error("error connecting: " + err.stack);

    insert();

});

const departments = ["Marketing", "Frontend Development", "Backend Development", "IT", "Support"];
const roles = ["Sales Consultant", "Developer", "Manager", "Software Engineer", "Support Agent"];
const first_names = ["James", "David", "Christopher", "George", "Ronald", "Gary", "Frank", "Raymond", "Dennis", "Douglas", "John", "Richard", "Daniel", "Kenneth", "Anthony", "Timothy", "Scott", "Jack", "Walter", "Henry", "Robert", "Charles", "Paul", "Steven", "Kevin", "Jose", "Eric", "Gregory", "Patrick", "Carl", "Michael", "Joseph", "Mark", "Edward", "Jason", "Larry", "Stephen", "Joshua", "Peter", "Arthur", "William", "Thomas", "Donald", "Brian", "Matthew", "Jeffrey", "Andrew", "Jerry", "Harold", "Ryan", "Mary", "Maria", "Lisa", "Sandra", "Laura", "Shirley", "Amy", "Pamela", "Caroline", "Frances", "Patricia", "Jennifer", "Nancy", "Donna", "Sarah", "Cynthia", "Anna", "Martha", "Christine", "Ann", "Barbara", "Susan", "Karen", "Ruth", "Kimberly", "Angela", "Rebecca", "Debra", "Marie", "Joyce", "Linda", "Margaret", "Betty", "Sharon", "Deborah", "Emily", "Virginia", "Amanda", "Janet", "Diane", "Elizabeth", "Dorothy", "Helen", "Michelle", "Jessica", "Brenda", "Kathleen", "Stephanie", "Catherine", "Alice",];
const last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzales", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson", "Bailey", "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson", "Watson", "Brooks", "Chavez", "Wood", "James", "Bennet", "Gray", "Mendoza", "Ruiz", "Hughes", "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long", "Ross", "Foster", "Jimenez",];


const insert = async () => {

    // EMPLOYEES
    for (let i = 0; i < 500; i++) {
        let first = first_names[(Math.floor(Math.random() * 99))];

        let last = last_names[(Math.floor(Math.random() * 99))];

        let roleId = (Math.floor(Math.random() * 5));
        let managerId = (Math.floor(Math.random() * 30));

        var employees = [first, last, roleId, managerId];

        await connection.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?);`, [employees], (err, res) => {
            if (err) console.log(err);
        });
    }

    // ROLES
    for (let i = 0; i < 50; i++) {
        let departmentId = (Math.floor(Math.random() * 4));
        let name = roles[departmentId];
        let salary = (Math.floor(Math.random() * 120000));
        var values = [name, salary, departmentId];

        await connection.query(`INSERT INTO roles (title, salary, department_id) VALUES (?);`, [values], (err, res) => {
            if (err) console.log(err);
        });
    }

    // DEPARTMENTS
    for (let i = 0; i < 5; i++) {
        var values = [departments[i]];

        await connection.query(`INSERT INTO departments (name) VALUES (?);`, [values], (err, res) => {
            if (err) console.log(err);
        });
    }
};

