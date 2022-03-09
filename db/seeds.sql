INSERT INTO department(name)
VALUES  ("Engineering"),
        ("Finance"),
        ("Legal"),
        ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES  ("Lead Engineer", 150000, 1),
        ("Software Engineer", 120000, 1),  
        ("Account Manager", 160000, 2),
        ("Accountant", 125000, 2),
        ("Legal Team Lead", 250000, 3),
        ("Lawyer", 190000, 3),
        ("Sales Lead", 100000, 4),
        ("Salesperson", 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Niccolo", "Eck", 1, NULL),
        ("Abigail", "Eck", 2, 1),
        ("Kassie", "Pascual", 3, NULL),
        ("Rodelle", "Sacman", 4, 3),
        ("Orion", "Wu", 5, NULL),
        ("Ronell", "Santos", 6, 5),
        ("Jim", "Del Carmen", 7, NULL),
        ("Katie", "Paul", 8, 7);