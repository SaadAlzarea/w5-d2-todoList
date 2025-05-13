let btn = document.getElementById("btn");
let inputTitle = document.getElementById("title");
let textarea = document.getElementById("textarea");
let taskNum = document.getElementById("taskNum");
let stickyCard = document.getElementById("stickyCard");
let deleteAllBtn = document.getElementById("deleteAllBtn");

btn.addEventListener("click", () => {
  if (inputTitle.value.trim() === "") {
    alert("The title field is empty.");
    return;
  }

  fetch("https://68219a2d259dad2655afc2ba.mockapi.io/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputTitle: inputTitle.value.trim(),
      textarea: textarea.value.trim(),
    }),
  })
    .then((response) => response.json())
    .then(() => {
      inputTitle.value = ""; // Clear input fields
      textarea.value = "";

      // Fetch and display tasks
      fetch("https://68219a2d259dad2655afc2ba.mockapi.io/tasks")
        .then((response) => response.json())
        .then((data) => {
          stickyCard.innerHTML = ""; // Clear tasks
          taskNum.innerHTML = data.length; // Update task count

          data.forEach((element) => {
            let sticky = document.createElement("div");
            sticky.classList.add("sticky");

            let stickyBtn = document.createElement("div");
            stickyBtn.classList.add("sticky-btn");

            let stickyCardBody = document.createElement("div");
            stickyCardBody.classList.add("sticky-card-body");

            let doneBtn = document.createElement("button");
            doneBtn.classList.add("done-btn");
            let editBtn = document.createElement("button");
            editBtn.classList.add("edit-btn");
            let delBtn = document.createElement("button");
            delBtn.classList.add("delete-btn");

            doneBtn.innerHTML = "Done";
            editBtn.innerText = "Edit";
            delBtn.innerText = "Delete";

            let stickyTitle = document.createElement("p");
            let stickyText = document.createElement("p");

            stickyTitle.innerText = `Title: ${element.inputTitle}`;
            stickyText.innerText = `Task: ${element.textarea}`;

            stickyBtn.appendChild(doneBtn);
            stickyBtn.appendChild(editBtn);
            stickyBtn.appendChild(delBtn);

            stickyCardBody.appendChild(stickyTitle);
            stickyCardBody.appendChild(stickyText);

            sticky.appendChild(stickyBtn);
            sticky.appendChild(stickyCardBody);

            stickyCard.appendChild(sticky);

            // Delete task
            delBtn.addEventListener("click", () => {
              fetch(
                `https://68219a2d259dad2655afc2ba.mockapi.io/tasks/${element.id}`,
                {
                  method: "DELETE",
                }
              ).then(() => {
                sticky.remove(); // Remove from DOM
                taskNum.innerHTML = Number(taskNum.innerHTML) - 1; // Update task count
              });
            });

            // Mark task as done
            doneBtn.addEventListener("click", () => {
              sticky.classList.add("sticky-done");
            });

            // editBtn.addEventListener("click", () => {
            //   let newTitle = prompt("Enter new title:", element.inputTitle)
            // });

            editBtn.addEventListener("click", () => {
              let newTitle = prompt("Enter new title:", element.inputTitle);
              let newText = prompt("Enter new task:", element.textarea);

              fetch(
                `https://68219a2d259dad2655afc2ba.mockapi.io/tasks/${element.id}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    inputTitle: newTitle.trim(),
                    textarea: newText.trim(),
                  }),
                }
              ).then(() => {
                stickyTitle.innerText = `Title: ${newTitle.trim()}`;
                stickyText.innerText = `Task:
                                       ${newText.trim()}`;
              });
            });

            
            // deleteAllBtn.addEventListener("click", () => {
                //   fetch(`https://68219a2d259dad2655afc2ba.mockapi.io/tasks/`, {
                    //     method: "DELETE",
                    //   }).then(() => {
                        //     sticky.remove();
                        //     taskNum.innerHTML = 0;
                        //   });
                        // });
                    });
                });
            });
        });
        
        // Delete task
        deleteAllBtn.addEventListener("click", () => {
          if (confirm("Are you sure you want to delete all tasks?")) {
            fetch("https://68219a2d259dad2655afc2ba.mockapi.io/tasks")
              .then((response) => response.json())
              .then((tasks) => {
                const deletePromises = tasks.map((task) =>
                  fetch(
                    `https://68219a2d259dad2655afc2ba.mockapi.io/tasks/${task.id}`,
                    {
                      method: "DELETE",
                    }
                  )
                );
                return Promise.all(deletePromises);
              })
              .then(() => {
                document.getElementById("stickyCard").innerHTML = ""; 
                alert("All tasks have been removed.");
                 taskNum.innerHTML = 0;
              })
          }
        });