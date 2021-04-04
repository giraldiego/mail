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
  console.log("submit button was pressed");
  // Get data from form:
  const recipients = document.querySelector("#compose-recipients").value;
  console.log(recipients);
  const subject = document.querySelector("#compose-subject").value;
  console.log(subject);
  const body = document.querySelector("#compose-body").value;
  console.log(body);


  // Validate data

  // Make request to server
    // fetch('/emails', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //       recipients: 'user@hogwarts.ac.uk',
    //       subject: 'Test mail #',
    //       body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae velit recusandae aperiam nostrum sequi mollitia exercitationem natus ex ullam placeat!'
    //   })
    // })
    // .then(response => response.json())
    // .then(result => {
    //     // Print result
    //     console.log(result);
    // });
  // alert("submit button pressed!");
  // Disable default submit behavior
  ev.preventDefault();
  return false;
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}