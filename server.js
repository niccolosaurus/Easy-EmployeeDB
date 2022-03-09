const connection = require("./config/connection");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

// Database Connect and Starter Title (created by: Joseph DeWoody)
  // connect to the mysql server and sql database
  connection.connect(function(err) {
    if (err) throw err;
      // run the start function after the connection is made to prompt the user
    start();
  });

function start() {
    inquirer.prompt({
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        name: "action",
        choices: [
            "View All Employees",
            "Add An Employee",
            "Remove An Employee",
            "Update Employee Roles",
            "View All Roles",
            "Add A Role",
            "View All Departments",
            "Add A Department",
            "Quit"
        ]
    })
    
    .then( (inputs) => {
        console.log(inputs.action);
        switch(inputs.action) {
            case "View All Employess":
                viewEmployees();
                break;
            case "Add An Employee":
                addEmployee();
                break;
            case "Remove An Employee":
                removeEmployee();
                break;
            case "Update Employee Roles":
                updateRoles();
                break;
            case "View All Roles":
                viewRoles();
                break;
            case "Add A Role":
                addRole();
                break;
            case "View All Departments":
                viewDepartments();
                break;
            case "Add A Department":
                addDepartment();
                break;
            case "Quit":
                console.log("You're All Done!")
                connection.end();
                break;
        }
    });
};

//Showing All Employees
viewEmployees = () => {
    console.log("Showing all the employees ...");
    connection.query("SELECT * FROM employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary", (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
};


//Adding An Employee
addEmployee = () => {
    console.log("Adding an employee ...");
    inquirer.prompt ([
        {
            type: "input",
            message: "Enter the employees first name.",
            name: "firstName"
        },
        {
            type: "input",
            message: "Enter the employees last name.",
            name: "lastName"
        },
        {
            type: "number",
            message: "Enter the employees Role ID.",
            name: "roleId"
        },
        {
            type: "input",
            message: "Enter the Managers ID for this employee, if the employee doesn't have a manager then leave this empty.",
            name: "managerId"
        }
    ])
    .then( (res) => {
        connection.query(
            "INSERT INTO employee SET ?",
            {
                first_name: res.firstName,
                last_name: res.lastName,
                role_id: res.roleId,
                manager_id: res.managerId
            },
            (err) => {
                if (err) throw err;
                console.table("Congrats! You created a new employee!");
                viewEmployees();
            }
        );
    });
};

//Delete An Employee
removeEmployee = () => {
    console.log("You are about to remove an employee...");
    connection.query("SELECT * FROM employee", (err, res) => {
        if(err) throw err;

        inquirer.prompt ([
            {
                name: "deleteEmployee",
                type: "rawlist",
                choices: function() {
                    let employeeList = [];
                    for(let i = 0; i < res.length; i++) {
                        employeeList.push(res[i].id);
                    }
                    return employeeList;
                },
                message: "Are you sure you want to remove this employee?"
            }])
            .then( (res) => {
                console.log(res.deleteEmployee);
                connection.query(
                    "DELETE FROM employee WHERE ?",
                    {
                        id: res.deleteEmployee
                    },
                    (err, res) => {
                        if(err) throw err;
                        console.table("Employee has been deleted")
                    })
                    viewEmployees();
            });
    });
};

//Updating An Employee's Role
updateRoles = () => {
    let employeeList = [];
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, FROM employee", (err, res) => {
        if(err) throw err;
        for(let i = 0; i < res.length; i++) {
            employeeList.push(res[i].id);
        }

        inquirer.prompt([
            {
                name: "employeeName",
                type: "rawlist",
                choices: employeeList,
                message: "What employee would you like update?"
            },
            {
                name: "updatedRole",
                type: "input",
                message: "Enter the new employee's Role ID."
            },
        ])
        .then( (res) => {
            connection.query(`UPDATE employee SET role_id = ${res.updatedRole} WHERE id = ${res.employeeName}`,
            (err) => {
                if(err) throw err;
                console.table("Congrats! You updated this Employee's Role!");
                viewEmployees();
            });
        });
    });
};

//View All The Roles
viewRoles = () => {
    console.log("Showing all the roles...");
    connection.query("SELECT * FROM role", (err, res) => {
        if(err) throw err;
        console.table(res);
        start();
    });
};

//Addiing A Role
addRole = () => {
    console.log("Adding a new Role...");
    inquirer.prompt([
        {
            type: "input",
            message: "Enter a new Role",
            name: "newRole"
        },
        {
            type: "input",
            message: "Enter the Salary for the Role.",
            name: "salary",
            validate: function(val) {
                if(isNaN(val) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            type: "number",
            message: "Enter the Department ID.",
            name: "departmentId"
        }
    ])
    .then( (res) => {
        connection.query("INSERT INTO role SET ?", 
        {
            title: res.newRole,
            salary: res.salary || 0,
            department_id: res.departmentId
        },
        (err) => {
            if(err) throw err;
            console.table("Congrats! You created a new Role!")
            viewRoles();
        });
    });
};

//View All The Departments
viewDepartments = () => {
    console.log("Here are all the Departments...");
    connection.query("SELECT * FROM department", (err, res) => {
        if(err) throw err;
        console.table(res);
        start();
    });
};

//Adding A New Department
addDepartment = () => {
    console.log("Would you like to create a new Department?");
    inquirer.prompt([
        {
            type: "input",
            message: "What is the new Departments name?",
            name: "newDepartment"
        },
    ])
    .then( (res) => {
        connection.query("INSERT INTO department (name) VALUES (?)", (res.newDepartment),
        (err) => {
            if(err) throw err;
            console.table("Congrats! You created a new Department!");
            viewDepartments();
        });
    });
};