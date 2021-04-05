document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

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
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
    });

    // Disable default submit behavior
    ev.preventDefault();
    return false;
  }
  
  function load_mailbox(mailbox) {

  // Save #emails-view node ref
  const emails_view = document.querySelector("#emails-view");
  
  // Show the mailbox and hide other views
  emails_view.style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  

  // Get emails from server
  fetch('/emails/' + mailbox)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);

      // Create parent container div
      const container = document.createElement("div");

      emails.forEach(email => {

        // Create email row div 
        const row = document.createElement("div");
        row.classList.add("email-item");
        if (!email.read) row.classList.add("email-item-unread");

        // Add desired fields to shown
        ["sender", "subject", "timestamp"].forEach((e) => {
          const item = document.createElement("span");
          item.innerHTML = email[e];
          row.append(item);
        });   

        // Add email row to parent container
        container.append(row);
      });

      // Add list of emails to emails-view
      emails_view.append(container);

      // Each email should then be rendered in its own box (e.g. as a <div> with a border) that displays who the email is from, what the subject line is, and the timestamp of the email.
      // If the email is unread, it should appear with a white background. If the email has been read, it should appear with a gray background.
  });

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