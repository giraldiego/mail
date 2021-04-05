document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function swap_view(view) {

  ['#emails-view', '#compose-view','#mail-view'].forEach( e =>{
    if (e !== view)
      document.querySelector(e).style.display = 'none';
    else
      document.querySelector(e).style.display = 'block';
  });
}

function compose_email() {

  // Show compose view and hide other views
  swap_view('#compose-view');

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  document.querySelector("#compose-form").addEventListener("submit", submitHandler);

}

function submitHandler(ev) {
  
  // Get data from form:
  const recipients = document.querySelector("#compose-recipients").value;
  const subject = document.querySelector("#compose-subject").value;
  const body = document.querySelector("#compose-body").value;

  // build email object
  const email = {
    recipients: recipients,
    subject: subject,
    body: body
  };

  // Validate data
  // TODO

  // Make request to server
  fetch('/emails', {
      method: 'POST',
      body: JSON.stringify(email)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      } else
        return response.json();    
    })
    .then(result => {
        // Print result
        console.log(result);
        load_mailbox('sent');
    });

    // Disable default submit behavior
    ev.preventDefault();
    return false;
  }
  
  function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  swap_view('#emails-view');
  
  // Save #emails-view node ref
  const emails_view = document.querySelector("#emails-view");

  // Show the mailbox name
  mailboxTitle = mailbox.charAt(0).toUpperCase() + mailbox.slice(1);
  document.querySelector('#emails-view').innerHTML = `<h3>${mailboxTitle}</h3>`;
  
  // Change page's title
  // document.querySelector("title").innerHTML = mailboxTitle;

  // Get emails from server
  fetch('/emails/' + mailbox)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      // console.log(emails);

      // Create parent container div
      const container = document.createElement("div");

      emails.forEach(email => {

        // Create email row div 
        const row = document.createElement("div");

        // debugger;

        row.classList.add("email-item");
        if (!email.read) row.classList.add("email-item-unread");

        // Add desired fields to shown
        ["sender", "subject", "timestamp"].forEach((e) => {
          const item = document.createElement("span");
          // item.innerHTML = email[e];
          item.innerHTML = `\t${email[e]}\t|`
          row.append(item);
        });
        
        row.id = "emailId-" + email.id;
        
        row.addEventListener("click", clickEmailHandler);
        
        // Add archive/unarchive button
        if (mailbox !== "sent") {
          const btn = document.createElement("button");
          if (mailbox === "inbox") {
            btn.innerText = "archive";
            btn.value = "archive"; 
          } else if (mailbox === "archive") {
            btn.innerText = "unarchive";
            btn.value = "unarchive";
          } 
          btn.addEventListener("click", clickBtnHandler);        
          
          // row.append(row);
          row.insertBefore(btn, row.firstChild);
        } 
        // Add email row to parent container
        container.append(row);
        
      });

      // Add list of emails to emails-view
      emails_view.append(container);
  });

}

function clickEmailHandler(ev) {

  // Get email id from div
  email_id = this.id.split("-").pop();
  // console.log(this.id.split("-").pop());

  fetch('/emails/' + email_id)
  .then(response => response.json())
  .then(email => {
      // Print email
      // console.log(email);

      // Load email content on #mail_view
      load_mail(email);

      // Mark email as read
      fetch('/emails/' + email_id, {
        method: 'PUT',
        body: JSON.stringify({
            read: true
        })
      })
  });
}

function clickBtnHandler(ev) {

  const action = ev.currentTarget.value;
  console.log(action);
  
  const email_id = ev.currentTarget.parentNode.id.split("-").pop();
  console.log(email_id);
  
  // Decide what to do with the status
  const setArchived = (action === "archive") ? true : false;
  
  // Change archived status
  fetch('/emails/' + email_id, {
    method: 'PUT',
    body: JSON.stringify({
      archived: setArchived
    })
  })
  .then(response => load_mailbox('inbox'));
  
  // Stop other handlers
  ev.stopPropagation();
}

// Your application should show the email’s sender, recipients, subject, timestamp, and body.
function load_mail(email) {
  swap_view('#mail-view');

  // Save #emails-view node ref
  const mail_view = document.querySelector("#mail-view");
  mail_view.innerHTML = "";

  const email_header = document.createElement("div");
  email_header.classList.add("email-content-header", "pure-g");
  email_header.innerHTML = 
    `<div>
      <h1 class="email-content-title">${email.subject}</h1>
      <p class="email-content-subtitle">
        From: ${email.sender} at <span>${email.timestamp}</span>
      </p>
      <p class="email-content-subtitle">
        To: ${email.recipients}
      </p>
    </div>`

    const email_body = document.createElement("div");
    email_body.classList.add("email-content-body");
    email_body.innerHTML = 
      `<p>${email.body}</p>`

  mail_view.append(email_header, email_body);

  // Add Reply button
  
  const btn = document.createElement("button");
  
  btn.innerText = "Reply";
  btn.value = "reply";     
  btn.addEventListener("click", clickReplyHandler);        
  
  // row.append(row);
  mail_view.append(btn);
}

function clickReplyHandler(ev) {
  console.log("trying to reply...");
}

// {
//   "id": 100,
//   "sender": "foo@example.com",
//   "recipients": ["bar@example.com"],
//   "subject": "Hello!",
//   "body": "Hello, world!",
//   "timestamp": "Jan 2 2020, 12:00 AM",
//   "read": false,
//   "archived": false
// }
