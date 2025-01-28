import React, { useState, useEffect, useMemo } from "react";
import tasksData from "./tasks.json";
import Button from "./components/ui/button";
import { Select } from "./components/ui/select";
import "./index.css";

function TaskDashboard() {
  const [tasks, setTasks] = useState([]); 
  const [filter, setFilter] = useState({ status: "", priority: "" });
  const [sortBy, setSortBy] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  useEffect(() => {
    setTasks(tasksData);
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(
        (task) =>
          (!filter.status || task.status === filter.status) &&
          (!filter.priority || task.priority === filter.priority)
      )
      .sort((a, b) => {
        if (sortBy === "date") {
          return new Date(a.due_date) - new Date(b.due_date);
        } else if (sortBy === "priority") {
          const priorities = { High: 1, Medium: 2, Low: 3 };
          return priorities[a.priority] - priorities[b.priority];
        }
        return 0;
      });
  }, [tasks, filter, sortBy]);

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTasks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTasks, currentPage]);

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  const handleUpdateTask = (id, updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task
      )
    );
  };

  const handleDeleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleAddTask = (newTask) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      { ...newTask, id: tasks.length + 1 },
    ]);
  };

  return (
    <div
      className={`dashboard-container ${darkMode ? "dark-mode" : "light-mode"}`}
    >
      <header className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-bold">Task Dashboard</h1>
        <Button onClick={toggleDarkMode} label={darkMode ? "Light Mode" : "Dark Mode"} />
      </header>

      <div style={{display:"flex", gap:"20px"}} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <Select
          options={[
            { value: "", label: "All Statuses" },
            { value: "Pending", label: "Pending" },
            { value: "In Progress", label: "In Progress" },
            { value: "Complete", label: "Complete" },
          ]}
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        />

        <Select
          value={filter.priority}
          onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
          options={[
            { value: "", label: "All Priorities" },
            { value: "High", label: "High" },
            { value: "Medium", label: "Medium" },
            { value: "Low", label: "Low" },
          ]}
        />

        <Select
          options={[
            { value: "", label: "No Sorting" },
            { value: "date", label: "Sort by Due Date" },
            { value: "priority", label: "Sort by Priority" },
          ]}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        />
      </div>
<div style={{height: "30px"}} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedTasks.map((task) => (
          <div  style={{marginBottom:"20px"}} key={task.id} className="task-card">
            <div>
              <h2 className="text-lg font-semibold title">{task.title}</h2>
              <p className="text-sm text-gray-500 date ">{task.due_date}</p>
            </div>
            <div>
              <p className="desc" >{task.description}</p>
              <p className={`mt-2 text-sm priority`}>
                Priority: {task.priority}
              </p>
              <p className={`mt-1 text-sm status`}>Status: {task.status}</p>
              <div className="mt-4 flex justify-between">
                <Button
                  onClick={() =>
                    handleUpdateTask(task.id, { status: "Complete" })
                  }
                  label="Complete"
                  />
                <Button
                
                  onClick={() => handleDeleteTask(task.id)}
                  label="Delete"
                  style={{backgroundColor:"#ff3e3e"}}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

        <div style={{height: "30px"}} />
      <footer className="mt-5 flex justify-center items-center">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          label="Previous"

        />
        <span className="mx-3">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          label="Next"
        />
      </footer>
    </div>
  );
}

export default TaskDashboard;
