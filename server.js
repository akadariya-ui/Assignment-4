/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Alish kadariya       Student ID: 142481854        Date: 2025-07-11
*
*  Published URL: 
*
*  
********************************************************************************/

const express = require("express");
const path = require("path");
const data = require("./modules/project");

const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
const HTTP_PORT = process.env.PORT || 8080;

// Static files
app.use(express.static("public"));

// Initialize data before setting up routes
data.initialize()
  .then(() => {
    // Routes
    app.get("/", (req, res) => {
      res.render("home", { page: "/" });
    });

    app.get("/about", (req, res) => {
      res.render("about", { page: "/about" });
    });

    app.get("/solutions/projects", async (req, res) => {
      try {
        const sector = req.query.sector;
        let projects;

        if (sector) {
          projects = await data.getProjectsBySector(sector);
        } else {
          projects = await data.getAllProjects();
        }
        if (projects.length > 0) {
          res.render("projects", { projects: projects, page: "/solutions/projects" });
        } else {
          res.status(404).render("404", { page: "/solutions/projects", message: `No projects found for sector: ${sector}` });
        }
      } catch (err) {
        res.status(404).render("404", { page: "/solutions/projects", message: err });
      }
    });

    app.get("/solutions/projects/:id", async (req, res) => {
      try {
        const project = await data.getProjectById(parseInt(req.params.id));
        res.render("project", { project: project, page: "" });
      } catch (err) {
        res.status(404).render("404", { page: "", message: err });
      }
    });

    // Custom 404
    app.use((req, res) => {
      res.status(404).sendFile(path.join(__dirname, "views/404.html"));
    });

    // Start server
    app.listen(HTTP_PORT, () => {
      console.log(`Server running on port ${HTTP_PORT}`);
    });
  })
  .catch(err => {
    console.error("Failed to initialize project data:", err);
  });