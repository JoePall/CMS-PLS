const db = require("./db");
const employees = new db.employees();
const roles = new db.roles();
const departments = new db.departments();
const count = 1000;

const departmentValues = ["Marketing", "Frontend Development", "Backend Development", "IT", "Support"];
const roleValues = ["Sales Consultant", "Developer", "Manager", "Software Engineer", "Support Agent"];
const first_names = ["James", "David", "Christopher", "George", "Ronald", "Gary", "Frank", "Raymond", "Dennis", "Douglas", "John", "Richard", "Daniel", "Kenneth", "Anthony", "Timothy", "Scott", "Jack", "Walter", "Henry", "Robert", "Charles", "Paul", "Steven", "Kevin", "Jose", "Eric", "Gregory", "Patrick", "Carl", "Michael", "Joseph", "Mark", "Edward", "Jason", "Larry", "Stephen", "Joshua", "Peter", "Arthur", "William", "Thomas", "Donald", "Brian", "Matthew", "Jeffrey", "Andrew", "Jerry", "Harold", "Ryan", "Mary", "Maria", "Lisa", "Sandra", "Laura", "Shirley", "Amy", "Pamela", "Caroline", "Frances", "Patricia", "Jennifer", "Nancy", "Donna", "Sarah", "Cynthia", "Anna", "Martha", "Christine", "Ann", "Barbara", "Susan", "Karen", "Ruth", "Kimberly", "Angela", "Rebecca", "Debra", "Marie", "Joyce", "Linda", "Margaret", "Betty", "Sharon", "Deborah", "Emily", "Virginia", "Amanda", "Janet", "Diane", "Elizabeth", "Dorothy", "Helen", "Michelle", "Jessica", "Brenda", "Kathleen", "Stephanie", "Catherine", "Alice",];
const last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzales", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson", "Bailey", "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson", "Watson", "Brooks", "Chavez", "Wood", "James", "Bennet", "Gray", "Mendoza", "Ruiz", "Hughes", "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long", "Ross", "Foster", "Jimenez",];

const run = async (count) => {

    // EMPLOYEES
    for (let i = 0; i < count; i++) {
        let first = first_names[(Math.floor(Math.random() * 99))];
        let last = last_names[(Math.floor(Math.random() * 99))];
        let roleId = (Math.floor(Math.random() * 5));
        let managerId = (Math.floor(Math.random() * 30));

        employees.insert([first, last, roleId, managerId]);
    }

    // ROLES
    for (let i = 0; i < count; i++) {
        let departmentId = (Math.floor(Math.random() * 4));
        let title = roleValues[departmentId];
        let salary = (Math.floor(Math.random() * 300000));
        
        roles.insert([title, salary, departmentId]);
    }

    // DEPARTMENTS
    for (let i = 0; i < 5; i++) {
        var name = [departmentValues[i]];

        departments.insert(name);
    }
};

run(count);